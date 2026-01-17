from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True, help_text='Required. Enter your first name.', label='First Name')
    last_name = forms.CharField(max_length=30, required=True, help_text='Required. Enter your last name.', label='Last Name')
    email = forms.EmailField(max_length=254, required=True, help_text='Required. Enter a valid email address.', label='Email')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')