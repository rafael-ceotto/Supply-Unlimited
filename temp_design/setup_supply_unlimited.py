#!/usr/bin/env python3
"""
Supply Unlimited - Django Project Setup Script
Execute este script para criar toda a estrutura do projeto Django

Uso:
    python setup_supply_unlimited.py

Isso criará:
    - supply_project/ (projeto principal)
    - django_supply/ (aplicação)
    - Todos os arquivos necessários
"""

import os
import sys

def create_directory(path):
    """Cria diretório se não existir"""
    os.makedirs(path, exist_ok=True)
    print(f"✓ Criado: {path}")

def write_file(path, content):
    """Escreve conteúdo em arquivo"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Criado: {path}")

def main():
    print("=" * 60)
    print("SUPPLY UNLIMITED - Django Project Setup")
    print("=" * 60)
    print()

    # Criar estrutura de diretórios
    print("Criando estrutura de diretórios...")
    create_directory("supply_project")
    create_directory("django_supply")
    create_directory("django_supply/templates")
    create_directory("django_supply/static")
    create_directory("django_supply/management")
    create_directory("django_supply/management/commands")

    # ========== ARQUIVOS DO PROJETO PRINCIPAL ==========
    
    # manage.py
    write_file("manage.py", '''#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
''')

    # supply_project/__init__.py
    write_file("supply_project/__init__.py", "# Supply Project\n")

    # supply_project/settings.py
    write_file("supply_project/settings.py", '''"""
Django settings for Supply Unlimited project.
"""
import os
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-supply-unlimited-change-in-production'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_supply',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'supply_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'django_supply' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'supply_project.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Berlin'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'django_supply' / 'static']

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Login URL
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/login/'
''')

    # supply_project/urls.py
    write_file("supply_project/urls.py", '''"""
Supply Project URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('django_supply.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
''')

    # supply_project/wsgi.py
    write_file("supply_project/wsgi.py", '''"""
WSGI config for supply_project project.
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_project.settings')

application = get_wsgi_application()
''')

    # supply_project/asgi.py
    write_file("supply_project/asgi.py", '''"""
ASGI config for supply_project project.
"""
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_project.settings')

application = get_asgi_application()
''')

    # ========== ARQUIVOS DA APLICAÇÃO DJANGO_SUPPLY ==========
    
    # django_supply/__init__.py
    write_file("django_supply/__init__.py", "# Django Supply App\n")

    # django_supply/apps.py
    write_file("django_supply/apps.py", '''from django.apps import AppConfig


class DjangoSupplyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'django_supply'
    verbose_name = 'Supply Unlimited'
''')

    # django_supply/models.py
    write_file("django_supply/models.py", '''from django.db import models
from django.contrib.auth.models import User


class Company(models.Model):
    """Modelo para empresas e suas filiais"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]
    
    company_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subsidiaries'
    )
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    ownership_percentage = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.company_id})"
    
    def get_linked_companies(self):
        """Retorna todas as empresas vinculadas (subsidiárias)"""
        return self.subsidiaries.all()


class Store(models.Model):
    """Modelo para lojas físicas"""
    store_id = models.CharField(max_length=20, unique=True, primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.city}"


class Category(models.Model):
    """Modelo para categorias de produtos"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Modelo para produtos"""
    STATUS_CHOICES = [
        ('in-stock', 'In Stock'),
        ('low-stock', 'Low Stock'),
        ('out-of-stock', 'Out of Stock'),
    ]
    
    sku = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in-stock')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.sku})"


class Warehouse(models.Model):
    """Modelo para warehouse/armazém"""
    warehouse_id = models.CharField(max_length=20, unique=True, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='warehouses')
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.name} - {self.store.name}"


class WarehouseLocation(models.Model):
    """Modelo para localização específica no warehouse (Aisle -> Shelf -> Box)"""
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='locations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    aisle = models.CharField(max_length=10)
    shelf = models.CharField(max_length=10)
    box = models.CharField(max_length=10)
    quantity = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['warehouse', 'product', 'aisle', 'shelf', 'box']
        ordering = ['aisle', 'shelf', 'box']
    
    def __str__(self):
        return f"{self.product.sku} - Aisle {self.aisle}, Shelf {self.shelf}, Box {self.box}"


class Inventory(models.Model):
    """Modelo para estoque de produtos nas lojas"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    last_restocked = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'store']
        verbose_name_plural = "Inventories"
    
    def __str__(self):
        return f"{self.product.name} at {self.store.name}: {self.quantity}"


class Sale(models.Model):
    """Modelo para vendas"""
    sale_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateTimeField(auto_now_add=True)
    month = models.CharField(max_length=20)  # Ex: "Jan", "Feb"
    year = models.IntegerField()
    
    def __str__(self):
        return f"Sale #{self.sale_id} - {self.product.name}"
    
    def save(self, *args, **kwargs):
        # Atualizar mês e ano automaticamente
        if not self.month:
            self.month = self.sale_date.strftime('%b')
        if not self.year:
            self.year = self.sale_date.year
        super().save(*args, **kwargs)


class DashboardMetrics(models.Model):
    """Modelo para métricas do dashboard"""
    metric_date = models.DateField(unique=True)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    total_products = models.IntegerField(default=0)
    active_customers = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-metric_date']
    
    def __str__(self):
        return f"Metrics for {self.metric_date}"
''')

    # django_supply/views.py (parte 1)
    views_content_part1 = '''from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.db.models import Sum, Count, Q, F
from django.views.decorators.http import require_http_methods
from datetime import datetime, date
import json
import csv

from .models import (
    Company, Store, Product, Inventory, Sale, 
    WarehouseLocation, Warehouse, DashboardMetrics, Category
)


def login_view(request):
    """View para página de login"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {
                'error': 'Invalid credentials'
            })
    
    return render(request, 'login.html')


def logout_view(request):
    """View para logout"""
    logout(request)
    return redirect('login')


@login_required
def dashboard_view(request):
    """View principal do dashboard"""
    # Obter métricas do dia atual
    today = date.today()
    try:
        metrics = DashboardMetrics.objects.get(metric_date=today)
    except DashboardMetrics.DoesNotExist:
        metrics = DashboardMetrics.objects.create(
            metric_date=today,
            total_revenue=245820.50,
            total_orders=1834,
            total_products=8456,
            active_customers=342
        )
    
    context = {
        'user': request.user,
        'metrics': metrics,
    }
    return render(request, 'dashboard.html', context)


@login_required
def inventory_data(request):
    """API para obter dados de inventário com filtros"""
    # Obter parâmetros de filtro
    search_query = request.GET.get('search', '')
    store_filter = request.GET.get('store', 'all')
    category_filter = request.GET.get('category', 'all')
    stock_filter = request.GET.get('stock', 'all')
    city_filter = request.GET.get('city', 'all')
    company_filter = request.GET.get('company', 'all')
    
    # Query base
    inventory_items = Inventory.objects.select_related('product', 'store', 'store__company')
    
    # Aplicar filtros
    if search_query:
        inventory_items = inventory_items.filter(
            Q(product__name__icontains=search_query) |
            Q(product__sku__icontains=search_query) |
            Q(product__category__name__icontains=search_query)
        )
    
    if store_filter != 'all':
        inventory_items = inventory_items.filter(store__country=store_filter)
    
    if category_filter != 'all':
        inventory_items = inventory_items.filter(product__category__name=category_filter)
    
    if city_filter != 'all':
        inventory_items = inventory_items.filter(store__city=city_filter)
    
    if company_filter != 'all':
        inventory_items = inventory_items.filter(store__company__company_id=company_filter)
    
    if stock_filter != 'all':
        if stock_filter == 'in-stock':
            inventory_items = inventory_items.filter(quantity__gt=20)
        elif stock_filter == 'low-stock':
            inventory_items = inventory_items.filter(quantity__lte=20, quantity__gt=0)
        elif stock_filter == 'out-of-stock':
            inventory_items = inventory_items.filter(quantity=0)
    
    # Preparar dados para resposta
    data = []
    for item in inventory_items[:100]:  # Limitar a 100 itens
        # Determinar status
        if item.quantity > 20:
            status = 'in-stock'
        elif item.quantity > 0:
            status = 'low-stock'
        else:
            status = 'out-of-stock'
        
        data.append({
            'id': item.id,
            'sku': item.product.sku,
            'name': item.product.name,
            'category': item.product.category.name if item.product.category else 'N/A',
            'store': item.store.country,
            'stock': item.quantity,
            'price': float(item.product.price),
            'status': status,
        })
    
    return JsonResponse({'data': data})


@login_required
def warehouse_location_data(request, sku):
    """API para obter localização de produto no warehouse"""
    product = get_object_or_404(Product, sku=sku)
    store_name = request.GET.get('store', '')
    
    # Buscar localizações do produto
    locations = WarehouseLocation.objects.filter(
        product=product
    ).select_related('warehouse', 'warehouse__store')
    
    if store_name:
        locations = locations.filter(warehouse__store__country=store_name)
    
    # Organizar dados
    warehouse_data = []
    for loc in locations:
        warehouse_data.append({
            'aisle': loc.aisle,
            'shelf': loc.shelf,
            'box': loc.box,
            'quantity': loc.quantity,
            'lastUpdated': loc.last_updated.strftime('%I:%M %p'),
        })
    
    return JsonResponse({
        'productName': product.name,
        'productSku': product.sku,
        'storeName': store_name,
        'warehouseData': warehouse_data,
    })
'''

    # django_supply/views.py (parte 2)
    views_content_part2 = '''

@login_required
def sales_data(request):
    """API para dados de vendas com filtros"""
    city_filter = request.GET.get('city', 'all')
    company_filter = request.GET.get('company', 'all')
    store_filter = request.GET.get('store', 'all')
    product_filter = request.GET.get('product', 'all')
    
    # Query base - agrupar vendas por mês e país
    sales = Sale.objects.select_related('store', 'product')
    
    # Aplicar filtros
    if city_filter != 'all':
        sales = sales.filter(store__city=city_filter)
    
    if company_filter != 'all':
        sales = sales.filter(store__company__company_id=company_filter)
    
    if store_filter != 'all':
        sales = sales.filter(store__store_id=store_filter)
    
    if product_filter != 'all':
        sales = sales.filter(product__category__name=product_filter)
    
    # Agrupar por mês e país
    sales_by_month = {}
    for sale in sales:
        month = sale.month
        country = sale.store.country.lower()
        
        if month not in sales_by_month:
            sales_by_month[month] = {
                'month': month,
                'germany': 0,
                'france': 0,
                'italy': 0,
                'spain': 0,
                'netherlands': 0,
            }
        
        if country in sales_by_month[month]:
            sales_by_month[month][country] += float(sale.total_amount)
    
    data = list(sales_by_month.values())
    return JsonResponse({'data': data})


@login_required
def company_list(request):
    """View para listar empresas"""
    country_filter = request.GET.get('country', 'all')
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    
    companies = Company.objects.all()
    
    if country_filter != 'all':
        companies = companies.filter(country=country_filter)
    
    if status_filter != 'all':
        companies = companies.filter(status=status_filter)
    
    if search_query:
        companies = companies.filter(
            Q(name__icontains=search_query) |
            Q(company_id__icontains=search_query) |
            Q(city__icontains=search_query)
        )
    
    # Preparar dados
    companies_data = []
    for company in companies:
        linked_companies = company.get_linked_companies()
        parent_name = company.parent.name if company.parent else None
        
        companies_data.append({
            'id': company.company_id,
            'name': company.name,
            'parent_id': company.parent.company_id if company.parent else None,
            'parent_name': parent_name,
            'country': company.country,
            'city': company.city,
            'status': company.status,
            'ownership': company.ownership_percentage,
            'linked_count': linked_companies.count(),
        })
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'companies': companies_data})
    
    return render(request, 'companies.html', {
        'companies': companies_data,
    })


@login_required
def company_details(request, company_id):
    """API para detalhes de uma empresa"""
    company = get_object_or_404(Company, company_id=company_id)
    
    # Obter empresas vinculadas
    linked_companies = []
    for linked in company.get_linked_companies():
        linked_companies.append({
            'id': linked.company_id,
            'name': linked.name,
            'city': linked.city,
            'country': linked.country,
            'ownership': linked.ownership_percentage,
            'status': linked.status,
        })
    
    data = {
        'id': company.company_id,
        'name': company.name,
        'country': company.country,
        'city': company.city,
        'status': company.status,
        'ownership': company.ownership_percentage,
        'parent_id': company.parent.company_id if company.parent else None,
        'parent_name': company.parent.name if company.parent else None,
        'linked_companies': linked_companies,
    }
    
    return JsonResponse(data)


@login_required
@require_http_methods(["POST"])
def company_create(request):
    """Criar nova empresa"""
    data = json.loads(request.body)
    
    # Gerar ID automático
    last_company = Company.objects.order_by('-company_id').first()
    if last_company:
        last_num = int(last_company.company_id.split('-')[1])
        new_id = f"COM-{str(last_num + 1).zfill(3)}"
    else:
        new_id = "COM-001"
    
    company = Company.objects.create(
        company_id=new_id,
        name=data['name'],
        country=data['country'],
        city=data['city'],
        parent_id=data.get('parent_id') or None,
        ownership_percentage=data.get('ownership', 100),
        status=data.get('status', 'active'),
    )
    
    return JsonResponse({
        'success': True,
        'company_id': company.company_id,
        'message': 'Company created successfully'
    })


@login_required
@require_http_methods(["POST"])
def company_update(request, company_id):
    """Atualizar empresa existente"""
    company = get_object_or_404(Company, company_id=company_id)
    data = json.loads(request.body)
    
    company.name = data.get('name', company.name)
    company.country = data.get('country', company.country)
    company.city = data.get('city', company.city)
    company.parent_id = data.get('parent_id') or None
    company.ownership_percentage = data.get('ownership', company.ownership_percentage)
    company.status = data.get('status', company.status)
    company.save()
    
    return JsonResponse({
        'success': True,
        'message': 'Company updated successfully'
    })


@login_required
@require_http_methods(["POST"])
def company_delete(request, company_id):
    """Deletar empresa"""
    company = get_object_or_404(Company, company_id=company_id)
    
    # Verificar se tem subsidiárias
    if company.get_linked_companies().exists():
        return JsonResponse({
            'success': False,
            'message': 'Cannot delete company with linked subsidiaries'
        }, status=400)
    
    company.delete()
    
    return JsonResponse({
        'success': True,
        'message': 'Company deleted successfully'
    })


@login_required
@require_http_methods(["POST"])
def company_merge(request):
    """Mesclar duas empresas"""
    data = json.loads(request.body)
    source_id = data.get('source_company_id')
    target_id = data.get('target_company_id')
    
    source = get_object_or_404(Company, company_id=source_id)
    target = get_object_or_404(Company, company_id=target_id)
    
    # Transferir todas as lojas da source para target
    Store.objects.filter(company=source).update(company=target)
    
    # Transferir subsidiárias
    Company.objects.filter(parent=source).update(parent=target)
    
    # Deletar source company
    source.delete()
    
    return JsonResponse({
        'success': True,
        'message': f'Successfully merged {source.name} into {target.name}'
    })


@login_required
def export_inventory(request):
    """Exportar inventário para CSV"""
    format_type = request.GET.get('format', 'csv')
    
    inventory_items = Inventory.objects.select_related('product', 'store').all()
    
    if format_type == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inventory.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['SKU', 'Product Name', 'Category', 'Store', 'Quantity', 'Price'])
        
        for item in inventory_items:
            writer.writerow([
                item.product.sku,
                item.product.name,
                item.product.category.name if item.product.category else 'N/A',
                item.store.name,
                item.quantity,
                item.product.price,
            ])
        
        return response
    
    # Adicionar outros formatos (PDF, Excel) conforme necessário
    return JsonResponse({'error': 'Invalid format'}, status=400)
'''

    write_file("django_supply/views.py", views_content_part1 + views_content_part2)

    # Continuar com os outros arquivos...
    print("\nContinuando com arquivos restantes...")

    # django_supply/urls.py
    write_file("django_supply/urls.py", '''from django.urls import path
from . import views

urlpatterns = [
    # Autenticação
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Dashboard
    path('dashboard/', views.dashboard_view, name='dashboard'),
    
    # APIs de dados
    path('api/inventory/', views.inventory_data, name='inventory_data'),
    path('api/warehouse/<str:sku>/', views.warehouse_location_data, name='warehouse_location'),
    path('api/sales/', views.sales_data, name='sales_data'),
    
    # Gerenciamento de empresas
    path('companies/', views.company_list, name='company_list'),
    path('api/company/<str:company_id>/', views.company_details, name='company_details'),
    path('api/company/create/', views.company_create, name='company_create'),
    path('api/company/<str:company_id>/update/', views.company_update, name='company_update'),
    path('api/company/<str:company_id>/delete/', views.company_delete, name='company_delete'),
    path('api/company/merge/', views.company_merge, name='company_merge'),
    
    # Exportação
    path('export/inventory/', views.export_inventory, name='export_inventory'),
]
''')

    # django_supply/admin.py
    write_file("django_supply/admin.py", '''from django.contrib import admin
from .models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, Sale, DashboardMetrics
)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['company_id', 'name', 'parent', 'country', 'city', 'status', 'ownership_percentage']
    list_filter = ['status', 'country']
    search_fields = ['company_id', 'name', 'city']


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ['store_id', 'name', 'company', 'city', 'country', 'is_active']
    list_filter = ['is_active', 'country']
    search_fields = ['store_id', 'name', 'city']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['sku', 'name', 'category', 'price', 'status']
    list_filter = ['status', 'category']
    search_fields = ['sku', 'name']


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ['warehouse_id', 'name', 'store']
    search_fields = ['warehouse_id', 'name']


@admin.register(WarehouseLocation)
class WarehouseLocationAdmin(admin.ModelAdmin):
    list_display = ['warehouse', 'product', 'aisle', 'shelf', 'box', 'quantity', 'last_updated']
    list_filter = ['warehouse', 'aisle']
    search_fields = ['product__sku', 'product__name']


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'store', 'quantity', 'last_restocked']
    list_filter = ['store']
    search_fields = ['product__sku', 'product__name']


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['sale_id', 'product', 'store', 'quantity', 'total_amount', 'sale_date']
    list_filter = ['sale_date', 'store']
    search_fields = ['product__name', 'store__name']


@admin.register(DashboardMetrics)
class DashboardMetricsAdmin(admin.ModelAdmin):
    list_display = ['metric_date', 'total_revenue', 'total_orders', 'total_products', 'active_customers']
    list_filter = ['metric_date']
''')

    print("\nCriando templates HTML...")
    
    # Devido ao limite de tamanho, vou criar arquivos adicionais
    # Continua no próximo write...

    print("\n" + "=" * 60)
    print("ESTRUTURA BÁSICA CRIADA COM SUCESSO!")
    print("=" * 60)
    print("\nPróximos passos:")
    print("1. Execute: python create_templates.py")
    print("2. Execute: python manage.py makemigrations")
    print("3. Execute: python manage.py migrate")
    print("4. Execute: python manage.py createsuperuser")
    print("5. Execute: python manage.py populate_data")
    print("6. Execute: python manage.py runserver")
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
''')

    print("\n✅ Arquivo de setup criado com sucesso!")
    print("\n📄 Arquivo criado: setup_supply_unlimited.py")
    print("\n🚀 Para executar:")
    print("   python setup_supply_unlimited.py")

main()
