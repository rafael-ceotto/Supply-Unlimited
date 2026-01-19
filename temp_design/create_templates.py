#!/usr/bin/env python3
"""
Script para criar templates HTML e management commands
Execute APÓS setup_supply_unlimited.py
"""

import os

def write_file(path, content):
    """Escreve conteúdo em arquivo"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Criado: {path}")

def main():
    print("=" * 60)
    print("Criando Templates e Commands")
    print("=" * 60)
    print()

    # __init__ files para management
    write_file("django_supply/management/__init__.py", "")
    write_file("django_supply/management/commands/__init__.py", "")

    # LOGIN TEMPLATE
    login_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supply Unlimited - Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            height: 100vh;
            overflow: hidden;
        }
        .login-container {
            display: flex;
            height: 100vh;
        }
        .left-side {
            flex: 1;
            background: linear-gradient(135deg, #10b981 0%, #ecfdf5 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .logo-container {
            position: relative;
            width: 200px;
            height: 200px;
            margin-bottom: 40px;
        }
        .logo-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: bold;
            color: #10b981;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 10;
        }
        .ellipse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 3px solid rgba(16, 185, 129, 0.3);
            border-radius: 50%;
        }
        .ellipse-1 {
            width: 180px;
            height: 180px;
            animation: rotate 8s linear infinite;
        }
        .ellipse-2 {
            width: 200px;
            height: 200px;
            animation: rotate 12s linear infinite reverse;
        }
        .orbit-ball {
            position: absolute;
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }
        @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .company-title {
            font-size: 42px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            letter-spacing: 2px;
        }
        .company-subtitle {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin-top: 10px;
        }
        .right-side {
            flex: 1;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }
        .form-container {
            width: 100%;
            max-width: 400px;
        }
        .form-header {
            margin-bottom: 40px;
        }
        .form-header h2 {
            font-size: 32px;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .form-header p {
            color: #6b7280;
            font-size: 14px;
        }
        .form-group {
            margin-bottom: 24px;
        }
        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
        }
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
        }
        .checkbox-group input {
            margin-right: 8px;
        }
        .checkbox-group label {
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="left-side">
            <div class="logo-container">
                <div class="logo-circle">SU</div>
                <div class="ellipse ellipse-1">
                    <div class="orbit-ball" style="top: 0; left: 50%; transform: translateX(-50%);"></div>
                    <div class="orbit-ball" style="top: 50%; right: 0; transform: translateY(-50%);"></div>
                    <div class="orbit-ball" style="bottom: 0; left: 50%; transform: translateX(-50%);"></div>
                    <div class="orbit-ball" style="top: 50%; left: 0; transform: translateY(-50%);"></div>
                </div>
                <div class="ellipse ellipse-2">
                    <div class="orbit-ball" style="top: 15%; right: 15%;"></div>
                    <div class="orbit-ball" style="top: 15%; left: 15%;"></div>
                    <div class="orbit-ball" style="bottom: 15%; right: 15%;"></div>
                    <div class="orbit-ball" style="bottom: 15%; left: 15%;"></div>
                </div>
            </div>
            <h1 class="company-title">SUPPLY UNLIMITED</h1>
            <p class="company-subtitle">European Operations Division</p>
        </div>
        <div class="right-side">
            <div class="form-container">
                <div class="form-header">
                    <h2>Welcome Back</h2>
                    <p>Please login to your account</p>
                </div>
                {% if error %}
                <div class="error-message">{{ error }}</div>
                {% endif %}
                <form method="POST" action="{% url 'login' %}">
                    {% csrf_token %}
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <button type="submit" class="submit-btn">Login</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>'''

    write_file("django_supply/templates/login.html", login_html)

    # DASHBOARD TEMPLATE (simplificado devido ao tamanho)
    dashboard_html = '''{% load static %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Supply Unlimited - Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
        .top-bar { height: 64px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-mini { width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; }
        .logo-text { font-size: 20px; font-weight: bold; color: #1f2937; }
        .user-section { display: flex; align-items: center; gap: 16px; }
        .btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; }
        .btn-outline { background: white; color: #6b7280; border: 1px solid #d1d5db; }
        .main-container { display: flex; height: calc(100vh - 64px); }
        .sidebar { width: 256px; background: linear-gradient(180deg, #ecfdf5 0%, white 50%, #ecfdf5 100%); border-right: 1px solid #e5e7eb; overflow-y: auto; }
        .sidebar-header { padding: 24px; }
        .sidebar-menu { padding: 12px; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 4px; border-radius: 8px; color: #374151; cursor: pointer; text-decoration: none; }
        .menu-item:hover { background: #d1fae5; }
        .menu-item.active { background: #10b981; color: white; box-shadow: 0 2px 8px rgba(16,185,129,0.3); }
        .content { flex: 1; overflow-y: auto; padding: 24px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .metric-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .metric-value { font-size: 32px; font-weight: bold; color: #1f2937; }
        .table-container { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; }
        thead th { background: #f9fafb; padding: 12px 24px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; }
        tbody td { padding: 16px 24px; border-bottom: 1px solid #f3f4f6; }
        .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .status-badge.in-stock { background: #d1fae5; color: #065f46; }
        .status-badge.low-stock { background: #fef3c7; color: #92400e; }
        .status-badge.out-of-stock { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="top-bar">
        <div class="logo-section">
            <div class="logo-mini">SU</div>
            <div class="logo-text">Supply Unlimited</div>
        </div>
        <div class="user-section">
            <div>{{ user.username }}</div>
            <button class="btn btn-outline" onclick="window.location.href='{% url 'logout' %}'">Logout</button>
        </div>
    </div>
    <div class="main-container">
        <div class="sidebar">
            <div class="sidebar-header"><h2>Menu</h2></div>
            <div class="sidebar-menu">
                <a href="#" class="menu-item active">Dashboard</a>
                <a href="#" class="menu-item">Inventory</a>
                <a href="{% url 'company_list' %}" class="menu-item">Companies</a>
            </div>
        </div>
        <div class="content">
            <h1>Dashboard</h1>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">€{{ metrics.total_revenue }}</div>
                    <div>Total Revenue</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{{ metrics.total_orders }}</div>
                    <div>Total Orders</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{{ metrics.total_products }}</div>
                    <div>Products</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{{ metrics.active_customers }}</div>
                    <div>Customers</div>
                </div>
            </div>
            <div class="table-container">
                <div style="padding: 20px;"><h3>Live Inventory</h3></div>
                <div id="inventory-table"><div style="padding: 40px; text-align: center;">Loading...</div></div>
            </div>
        </div>
    </div>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
        async function loadInventory() {
            const response = await fetch('/api/inventory/');
            const result = await response.json();
            let html = '<table><thead><tr><th>SKU</th><th>Product</th><th>Store</th><th>Stock</th><th>Price</th><th>Status</th></tr></thead><tbody>';
            result.data.forEach(item => {
                html += `<tr><td>${item.sku}</td><td>${item.name}</td><td>${item.store}</td><td>${item.stock}</td><td>€${item.price.toFixed(2)}</td><td><span class="status-badge ${item.status}">${item.status}</span></td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('inventory-table').innerHTML = html;
        }
        loadInventory();
    </script>
</body>
</html>'''

    write_file("django_supply/templates/dashboard.html", dashboard_html)

    # POPULATE DATA COMMAND
    populate_command = '''"""
Script para popular o banco de dados com dados de exemplo
Execute com: python manage.py populate_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
import random

from django_supply.models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, Sale, DashboardMetrics
)


class Command(BaseCommand):
    help = 'Popula o banco de dados com dados de exemplo'

    def handle(self, *args, **options):
        self.stdout.write('Populando banco de dados...')

        # Limpar dados
        DashboardMetrics.objects.all().delete()
        Sale.objects.all().delete()
        Inventory.objects.all().delete()
        WarehouseLocation.objects.all().delete()
        Warehouse.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Store.objects.all().delete()
        Company.objects.all().delete()

        # Criar empresas
        techcorp = Company.objects.create(
            company_id='COM-001', name='TechCorp EU', country='Germany',
            city='Berlin', status='active', ownership_percentage=100
        )
        techcorp_fr = Company.objects.create(
            company_id='COM-002', name='TechCorp France', parent=techcorp,
            country='France', city='Paris', status='active', ownership_percentage=75
        )
        global_ind = Company.objects.create(
            company_id='COM-003', name='Global Industries', country='Italy',
            city='Rome', status='active', ownership_percentage=100
        )

        # Criar lojas
        store_de = Store.objects.create(
            store_id='STORE-001', company=techcorp, name='TechCorp Berlin',
            city='Berlin', country='Germany', address='Hauptstr 123'
        )
        store_fr = Store.objects.create(
            store_id='STORE-002', company=techcorp_fr, name='TechCorp Paris',
            city='Paris', country='France', address='Rue de la Paix 45'
        )

        # Criar categorias
        cat_elec = Category.objects.create(name='Electronics', description='Electronic devices')
        cat_furn = Category.objects.create(name='Furniture', description='Office furniture')

        # Criar produtos
        products = [
            ('SUP-001', 'Industrial Drill', cat_elec, 299.99),
            ('SUP-002', 'Office Chair', cat_furn, 189.50),
            ('SUP-003', 'Laptop Stand', cat_elec, 79.99),
            ('SUP-004', 'Printer Paper', cat_elec, 12.99),
        ]
        
        for sku, name, cat, price in products:
            Product.objects.create(
                sku=sku, name=name, category=cat, price=Decimal(str(price)), status='in-stock'
            )

        # Criar warehouse
        wh = Warehouse.objects.create(
            warehouse_id='WH-001', store=store_de, name='Main Warehouse Berlin'
        )

        # Criar warehouse locations
        for product in Product.objects.all():
            for i in range(3):
                WarehouseLocation.objects.create(
                    warehouse=wh, product=product,
                    aisle=f'A{random.randint(1,3)}',
                    shelf=f'S{random.randint(1,3)}',
                    box=f'B{random.randint(1,3):02d}',
                    quantity=random.randint(5, 50)
                )

        # Criar inventário
        for product in Product.objects.all():
            for store in Store.objects.all():
                Inventory.objects.create(
                    product=product, store=store, quantity=random.randint(10, 200)
                )

        # Criar métricas
        DashboardMetrics.objects.create(
            metric_date=timezone.now().date(),
            total_revenue=Decimal('245820.50'),
            total_orders=1834,
            total_products=Product.objects.count(),
            active_customers=342
        )

        self.stdout.write(self.style.SUCCESS('✓ Banco de dados populado!'))
'''

    write_file("django_supply/management/commands/populate_data.py", populate_command)

    # requirements.txt
    write_file("requirements.txt", '''Django>=4.2,<5.0
Pillow>=10.0.0
''')

    # README
    readme = '''# Supply Unlimited - Django Application

## Instalação Rápida

1. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

2. **Migrar banco de dados:**
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Criar superusuário:**
```bash
python manage.py createsuperuser
```

4. **Popular dados de exemplo:**
```bash
python manage.py populate_data
```

5. **Executar servidor:**
```bash
python manage.py runserver
```

6. **Acessar aplicação:**
- Dashboard: http://localhost:8000/dashboard/
- Admin: http://localhost:8000/admin/

## Funcionalidades

✅ Login com logo animado
✅ Dashboard com métricas
✅ Inventário com filtros
✅ Warehouse Location (Aisles → Shelves → Boxes)
✅ Gerenciamento de Empresas (CRUD + Merge)
✅ APIs RESTful
✅ Exportação CSV

## Estrutura

```
supply_project/
├── manage.py
├── supply_project/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── django_supply/
    ├── models.py
    ├── views.py
    ├── urls.py
    ├── admin.py
    └── templates/
```

## APIs Disponíveis

- `GET /api/inventory/` - Lista inventário
- `GET /api/warehouse/<sku>/` - Localização warehouse
- `GET /api/sales/` - Dados vendas
- `GET /companies/` - Lista empresas
- `POST /api/company/create/` - Criar empresa
- `POST /api/company/<id>/update/` - Atualizar empresa
- `POST /api/company/<id>/delete/` - Deletar empresa
- `POST /api/company/merge/` - Mesclar empresas
- `GET /export/inventory/` - Exportar CSV

Supply Unlimited © 2026
'''

    write_file("README.md", readme)

    print("\n" + "=" * 60)
    print("✅ TODOS OS ARQUIVOS CRIADOS COM SUCESSO!")
    print("=" * 60)
    print("\n📋 Próximos passos:")
    print("1. pip install -r requirements.txt")
    print("2. python manage.py makemigrations")
    print("3. python manage.py migrate")
    print("4. python manage.py createsuperuser")
    print("5. python manage.py populate_data")
    print("6. python manage.py runserver")
    print("\n🌐 Acesse: http://localhost:8000")
    print("=" * 60)

if __name__ == "__main__":
    main()
'''

create_templates.py
