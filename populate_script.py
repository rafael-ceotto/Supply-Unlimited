#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')

django.setup()

# Now we can import the models
from supply_unlimited.sales.django_supply.models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, DashboardMetrics
)
from supply_unlimited.sales.models import Sale

from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
import random

def populate_data():
    print('Iniciando população do banco de dados...')
    
    # Limpar dados existentes
    print('Limpando dados antigos...')
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
    print('Criando empresas...')
    techcorp = Company.objects.create(
        company_id='COM-001',
        name='TechCorp EU',
        country='Germany',
        city='Berlin',
        status='active',
        ownership_percentage=100
    )

    techcorp_france = Company.objects.create(
        company_id='COM-002',
        name='TechCorp France',
        parent=techcorp,
        country='France',
        city='Paris',
        status='active',
        ownership_percentage=100
    )

    amazon_eu = Company.objects.create(
        company_id='COM-003',
        name='Amazon EU',
        country='Germany',
        city='Frankfurt',
        status='active',
        ownership_percentage=100
    )

    alibaba_eu = Company.objects.create(
        company_id='COM-004',
        name='Alibaba Europe',
        country='Netherlands',
        city='Amsterdam',
        status='active',
        ownership_percentage=100
    )

    walmart_eu = Company.objects.create(
        company_id='COM-005',
        name='Walmart EU',
        country='UK',
        city='London',
        status='active',
        ownership_percentage=100
    )

    # Criar lojas
    print('Criando lojas...')
    store1 = Store.objects.create(
        company=techcorp,
        store_id='STORE-001',
        name='TechCorp Berlin Main',
        city='Berlin',
        country='Germany',
        manager_email='manager1@techcorp.eu'
    )

    store2 = Store.objects.create(
        company=techcorp_france,
        store_id='STORE-002',
        name='TechCorp Paris',
        city='Paris',
        country='France',
        manager_email='manager2@techcorp.fr'
    )

    store3 = Store.objects.create(
        company=amazon_eu,
        store_id='STORE-003',
        name='Amazon Frankfurt',
        city='Frankfurt',
        country='Germany',
        manager_email='manager3@amazon.eu'
    )

    store4 = Store.objects.create(
        company=alibaba_eu,
        store_id='STORE-004',
        name='Alibaba Amsterdam',
        city='Amsterdam',
        country='Netherlands',
        manager_email='manager4@alibaba.eu'
    )

    store5 = Store.objects.create(
        company=walmart_eu,
        store_id='STORE-005',
        name='Walmart London',
        city='London',
        country='UK',
        manager_email='manager5@walmart.eu'
    )

    # Criar categorias
    print('Criando categorias...')
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
        description='Beauty and personal care'
    )

    cat_books = Category.objects.create(
        name='Books',
        description='Books and media'
    )

    # Criar produtos
    print('Criando produtos...')
    products_data = [
        {
            'sku': 'ELEC-001',
            'name': 'Wireless Headphones',
            'category': cat_electronics,
            'description': 'High quality wireless headphones',
            'unit_price': Decimal('79.99'),
            'supplier': 'TechSupply Inc'
        },
        {
            'sku': 'ELEC-002',
            'name': 'USB-C Cable',
            'category': cat_electronics,
            'description': 'Durable USB-C charging cable',
            'unit_price': Decimal('12.99'),
            'supplier': 'CableWorld'
        },
        {
            'sku': 'CLOTH-001',
            'name': 'Blue T-Shirt',
            'category': cat_clothing,
            'description': 'Cotton blue t-shirt',
            'unit_price': Decimal('19.99'),
            'supplier': 'TextileCorp'
        },
        {
            'sku': 'CLOTH-002',
            'name': 'Black Jeans',
            'category': cat_clothing,
            'description': 'Classic black denim jeans',
            'unit_price': Decimal('49.99'),
            'supplier': 'DenimWorld'
        },
        {
            'sku': 'BEAUTY-001',
            'name': 'Facial Cream',
            'category': cat_beauty,
            'description': 'Moisturizing facial cream',
            'unit_price': Decimal('24.99'),
            'supplier': 'BeautyPlus'
        },
        {
            'sku': 'BEAUTY-002',
            'name': 'Shampoo',
            'category': cat_beauty,
            'description': 'Anti-frizz shampoo',
            'unit_price': Decimal('9.99'),
            'supplier': 'HairCare Co'
        },
        {
            'sku': 'BOOK-001',
            'name': 'Python Programming',
            'category': cat_books,
            'description': 'Learn Python programming',
            'unit_price': Decimal('39.99'),
            'supplier': 'BookWorld'
        },
        {
            'sku': 'BOOK-002',
            'name': 'Web Development Guide',
            'category': cat_books,
            'description': 'Complete web dev guide',
            'unit_price': Decimal('44.99'),
            'supplier': 'TechBooks Inc'
        }
    ]

    products = {}
    for data in products_data:
        product = Product.objects.create(
            sku=data['sku'],
            name=data['name'],
            category=data['category'],
            description=data['description'],
            unit_price=data['unit_price'],
            supplier=data['supplier']
        )
        products[data['sku']] = product

    # Criar warehouses
    print('Criando warehouses...')
    warehouse1 = Warehouse.objects.create(
        store=store1,
        warehouse_id='WH-001',
        name='Berlin Main Warehouse'
    )

    warehouse2 = Warehouse.objects.create(
        store=store3,
        warehouse_id='WH-002',
        name='Frankfurt Distribution Center'
    )

    # Criar warehouse locations
    print('Criando warehouse locations...')
    locations1 = []
    for i in range(1, 4):
        loc = WarehouseLocation.objects.create(
            warehouse=warehouse1,
            aisle=f'A{i}',
            shelf=f'S{i}',
            bin=f'B{i}'
        )
        locations1.append(loc)

    locations2 = []
    for i in range(1, 3):
        loc = WarehouseLocation.objects.create(
            warehouse=warehouse2,
            aisle=f'B{i}',
            shelf=f'S{i}',
            bin=f'B{i}'
        )
        locations2.append(loc)

    # Criar inventory
    print('Criando inventory...')
    inventory_data = [
        {
            'product_sku': 'ELEC-001',
            'location': locations1[0],
            'quantity': 150
        },
        {
            'product_sku': 'ELEC-002',
            'location': locations1[1],
            'quantity': 500
        },
        {
            'product_sku': 'CLOTH-001',
            'location': locations1[2],
            'quantity': 200
        },
        {
            'product_sku': 'CLOTH-002',
            'location': locations2[0],
            'quantity': 120
        },
        {
            'product_sku': 'BEAUTY-001',
            'location': locations2[1],
            'quantity': 300
        },
        {
            'product_sku': 'BEAUTY-002',
            'location': locations1[0],
            'quantity': 450
        },
        {
            'product_sku': 'BOOK-001',
            'location': locations1[1],
            'quantity': 80
        },
        {
            'product_sku': 'BOOK-002',
            'location': locations2[0],
            'quantity': 60
        }
    ]

    for data in inventory_data:
        product = products[data['product_sku']]
        Inventory.objects.create(
            product=product,
            warehouse_location=data['location'],
            quantity_on_hand=data['quantity'],
            quantity_reserved=0,
            quantity_available=data['quantity'],
            reorder_level=data['quantity'] * Decimal('0.2')
        )

    # Criar sales
    print('Criando sales...')
    for i in range(20):
        sale = Sale.objects.create(
            product=random.choice(list(products.values())).name,
            customer=f'Customer {i+1}',
            description=f'Sale transaction {i+1}',
            amount=Decimal(str(round(random.uniform(50, 500), 2)))
        )

    # Criar dashboard metrics
    print('Criando dashboard metrics...')
    for store in [store1, store3]:
        metrics = DashboardMetrics.objects.create(
            store=store,
            total_inventory_value=Decimal('100000.00'),
            low_stock_items=5,
            total_sales_today=Decimal('5000.00'),
            total_sales_month=Decimal('150000.00'),
            total_customers=random.randint(100, 500)
        )

    print('✅ Banco de dados populado com sucesso!')
    print(f'- {Company.objects.count()} Empresas')
    print(f'- {Store.objects.count()} Lojas')
    print(f'- {Product.objects.count()} Produtos')
    print(f'- {Inventory.objects.count()} Itens de Inventory')
    print(f'- {Sale.objects.count()} Sales')

if __name__ == '__main__':
    populate_data()
