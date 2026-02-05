#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
import random
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')

django.setup()

# Import models
from supply_unlimited.sales.django_supply.models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, DashboardMetrics
)
from supply_unlimited.sales.models import Sale
from django.contrib.auth.models import User

def populate_all_data():
    print('🚀 Iniciando população completa do banco...')
    
    # Clear existing data
    print('🧹 Limpando dados antigos...')
    DashboardMetrics.objects.all().delete()
    Sale.objects.all().delete()
    Inventory.objects.all().delete()
    WarehouseLocation.objects.all().delete()
    Warehouse.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    Store.objects.all().delete()
    Company.objects.all().delete()
    
    # Create Companies
    print('🏢 Criando empresas...')
    amazon = Company.objects.create(
        company_id='COM-001',
        name='Amazon EU',
        country='Germany',
        city='Frankfurt',
        status='active',
        ownership_percentage=100
    )
    
    alibaba = Company.objects.create(
        company_id='COM-002',
        name='Alibaba Europe',
        country='Netherlands',
        city='Amsterdam',
        status='active',
        ownership_percentage=100
    )
    
    walmart = Company.objects.create(
        company_id='COM-003',
        name='Walmart EU',
        country='UK',
        city='London',
        status='active',
        ownership_percentage=100
    )
    
    tesco = Company.objects.create(
        company_id='COM-004',
        name='Tesco UK',
        country='UK',
        city='London',
        status='active',
        ownership_percentage=100
    )
    
    techcorp = Company.objects.create(
        company_id='COM-005',
        name='TechCorp Germany',
        country='Germany',
        city='Berlin',
        status='active',
        ownership_percentage=100
    )
    
    # Create Stores
    print('🏪 Criando lojas...')
    store_amazon = Store.objects.create(
        store_id='STORE-001',
        company=amazon,
        name='Amazon Frankfurt Warehouse',
        city='Frankfurt',
        country='Germany',
        address='Mainstrasse 1, Frankfurt',
        is_active=True
    )
    
    store_alibaba = Store.objects.create(
        store_id='STORE-002',
        company=alibaba,
        name='Alibaba Amsterdam Warehouse',
        city='Amsterdam',
        country='Netherlands',
        address='Prinsengracht 1, Amsterdam',
        is_active=True
    )
    
    store_walmart = Store.objects.create(
        store_id='STORE-003',
        company=walmart,
        name='Walmart London Store',
        city='London',
        country='UK',
        address='Oxford Street 100, London',
        is_active=True
    )
    
    store_tesco = Store.objects.create(
        store_id='STORE-004',
        company=tesco,
        name='Tesco London Store',
        city='London',
        country='UK',
        address='Piccadilly 200, London',
        is_active=True
    )
    
    store_tech = Store.objects.create(
        store_id='STORE-005',
        company=techcorp,
        name='TechCorp Berlin Store',
        city='Berlin',
        country='Germany',
        address='Brandenburger Tor 1, Berlin',
        is_active=True
    )
    
    # Create Categories
    print('📁 Criando categorias...')
    cat_electronics = Category.objects.create(
        name='Electronics',
        description='Electronic devices and gadgets'
    )
    
    cat_clothing = Category.objects.create(
        name='Clothing',
        description='Apparel and accessories'
    )
    
    cat_beauty = Category.objects.create(
        name='Beauty',
        description='Beauty and personal care products'
    )
    
    cat_books = Category.objects.create(
        name='Books',
        description='Books and educational materials'
    )
    
    # Create Products
    print('📦 Criando produtos...')
    products_data = [
        ('ELEC-001', 'Wireless Headphones', cat_electronics, 'High quality wireless headphones', Decimal('79.99')),
        ('ELEC-002', 'USB-C Cable', cat_electronics, 'Durable USB-C charging cable', Decimal('12.99')),
        ('ELEC-003', 'Laptop Stand', cat_electronics, 'Ergonomic aluminum laptop stand', Decimal('34.99')),
        ('CLOTH-001', 'Blue T-Shirt', cat_clothing, 'Cotton blue t-shirt', Decimal('19.99')),
        ('CLOTH-002', 'Black Jeans', cat_clothing, 'Classic black denim jeans', Decimal('49.99')),
        ('CLOTH-003', 'White Sneakers', cat_clothing, 'Classic white leather sneakers', Decimal('69.99')),
        ('BEAUTY-001', 'Facial Cream', cat_beauty, 'Moisturizing facial cream', Decimal('24.99')),
        ('BEAUTY-002', 'Shampoo', cat_beauty, 'Anti-frizz shampoo', Decimal('9.99')),
        ('BEAUTY-003', 'Face Mask', cat_beauty, 'Hydrating face mask', Decimal('14.99')),
        ('BOOK-001', 'Python Programming', cat_books, 'Learn Python programming', Decimal('39.99')),
        ('BOOK-002', 'Web Development', cat_books, 'Complete web dev guide', Decimal('44.99')),
        ('BOOK-003', 'Machine Learning', cat_books, 'ML algorithms and practices', Decimal('54.99')),
    ]
    
    products = {}
    for sku, name, category, desc, price in products_data:
        product = Product.objects.create(
            sku=sku,
            name=name,
            category=category,
            description=desc,
            price=price,
            status='in-stock'
        )
        products[sku] = product
    
    # Create Warehouses
    print('🏭 Criando warehouses...')
    warehouse_amazon = Warehouse.objects.create(
        warehouse_id='WH-001',
        store=store_amazon,
        name='Amazon Frankfurt Main Warehouse'
    )
    
    warehouse_alibaba = Warehouse.objects.create(
        warehouse_id='WH-002',
        store=store_alibaba,
        name='Alibaba Amsterdam Distribution Center'
    )
    
    warehouse_walmart = Warehouse.objects.create(
        warehouse_id='WH-003',
        store=store_walmart,
        name='Walmart London Main Warehouse'
    )
    
    # Create Warehouse Locations
    print('📍 Criando localizações de warehouse...')
    locations_amazon = []
    for i in range(1, 4):
        loc = WarehouseLocation.objects.create(
            warehouse=warehouse_amazon,
            product=list(products.values())[i-1],
            aisle=f'A{i}',
            shelf=f'S{i}',
            box=f'B{i}',
            quantity=random.randint(50, 200)
        )
        locations_amazon.append(loc)
    
    locations_alibaba = []
    for i in range(1, 4):
        loc = WarehouseLocation.objects.create(
            warehouse=warehouse_alibaba,
            product=list(products.values())[3+i-1],
            aisle=f'B{i}',
            shelf=f'S{i}',
            box=f'B{i}',
            quantity=random.randint(50, 200)
        )
        locations_alibaba.append(loc)
    
    locations_walmart = []
    for i in range(1, 4):
        loc = WarehouseLocation.objects.create(
            warehouse=warehouse_walmart,
            product=list(products.values())[6+i-1] if 6+i-1 < len(products) else list(products.values())[0],
            aisle=f'C{i}',
            shelf=f'S{i}',
            box=f'B{i}',
            quantity=random.randint(50, 200)
        )
        locations_walmart.append(loc)
    
    # Create Inventory
    print('📊 Criando inventory...')
    for i, (sku, product) in enumerate(products.items()):
        store = random.choice([store_amazon, store_alibaba, store_walmart, store_tesco])
        Inventory.objects.create(
            product=product,
            store=store,
            quantity=random.randint(20, 500)
        )
    
    # Create Sales
    print('💰 Criando vendas...')
    for i in range(50):
        Sale.objects.create(
            product=random.choice(list(products.values())).name,
            customer=random.choice(['Amazon', 'Alibaba', 'Walmart', 'Tesco', 'Online Customer']),
            description=f'Sales transaction #{i+1}',
            amount=Decimal(str(round(random.uniform(50, 500), 2)))
        )
    
    # Create Dashboard Metrics
    print('📈 Criando métricas...')
    from datetime import timedelta as td
    for i, store in enumerate([store_amazon, store_alibaba, store_walmart]):
        metrics_date = (datetime.now() - td(days=i)).date()
        DashboardMetrics.objects.create(
            metric_date=metrics_date,
            total_revenue=Decimal(str(random.randint(5000, 50000))),
            total_orders=random.randint(10, 100),
            total_products=len(products),
            active_customers=random.randint(50, 500)
        )
    
    # Print Summary
    print('\n' + '='*50)
    print('✅ BANCO DE DADOS RESTAURADO COM SUCESSO!')
    print('='*50)
    print(f'🏢 {Company.objects.count()} Empresas')
    print(f'🏪 {Store.objects.count()} Lojas')
    print(f'📦 {Product.objects.count()} Produtos')
    print(f'📊 {Inventory.objects.count()} Itens de Inventory')
    print(f'💰 {Sale.objects.count()} Vendas')
    print(f'📈 {DashboardMetrics.objects.count()} Métricas')
    print(f'👤 {User.objects.count()} Usuários')
    print('='*50)
    print('\n👤 Usuários no sistema:')
    for user in User.objects.all():
        print(f'   - {user.username} ({user.email})')

if __name__ == '__main__':
    populate_all_data()
