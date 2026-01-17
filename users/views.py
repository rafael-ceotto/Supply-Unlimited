# users/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import CustomUserCreationForm

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            
            if request.POST.get('remember'):                
                request.session.set_expiry(1209600)  # 2 semanas
            else:                
                request.session.set_expiry(0)

            return redirect('dashboard')
        else:
            messages.error(request, "Usuário ou senha inválidos.")
    else:
        form = AuthenticationForm()
    
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)  # Função do Django para fazer logout
    return HttpResponseRedirect('/login/')

def dashboard_view(request):
    if not request.user.is_authenticated:
        return redirect('login')  # Redireciona para a página de login se o usuário não estiver autenticado
    return render(request, 'dashboard.html')

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Conta criada com sucesso! Você já pode fazer login.')
            return redirect('login')
        else:
            messages.error(request, "Erro ao criar a conta. Verifique os dados.")
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})