"""
URL configuration for supply_unlimited project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from users.views import (
    login_view, logout_view, dashboard_view, register_view, 
    inventory_page, companies_page, reports_page, sales_page,
    settings_view, update_profile_view, change_password_view
)

def redirect_to_login(request):
    return redirect('login')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('inventory/', inventory_page, name='inventory'),
    path('companies/', companies_page, name='companies'),
    path('reports/', reports_page, name='reports'),
    path('sales/', sales_page, name='sales'),
    path('settings/', settings_view, name='settings'),
    path('update-profile/', update_profile_view, name='update_profile'),
    path('change-password/', change_password_view, name='change_password'),
    path('', login_view, name='home'),  # Página inicial redirecionando para login
    path('', include('users.urls')),
    path('sales/', include('supply_unlimited.sales.urls')),
    path('api/ai-reports/', include('ai_reports.urls')),
]
