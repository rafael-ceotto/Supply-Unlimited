#!/usr/bin/env python
import os
import django
import sys
from datetime import datetime, timedelta
from decimal import Decimal
from random import randint, choice, uniform
from faker import Faker

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

from supply_unlimited.sales.django_supply.models import (
    Company, Store, Category, Product, Warehouse, 
    WarehouseLocation, Inventory, DashboardMetrics
)
from supply_unlimited.sales.models import Sale

fake = Faker(['pt_BR', 'en_US'])

def clear_data():
    """Limpar dados existentes"""
    print("🧹 Limpando dados existentes...")
    DashboardMetrics.objects.all().delete()
    Sale.objects.all().delete()
    Inventory.objects.all().delete()
    WarehouseLocation.objects.all().delete()
    Warehouse.objects.all().delete()
    Product.objects.all().delete()
    Store.objects.all().delete()
    Company.objects.all().delete()
    print("✅ Dados limpos!")

def create_companies(count=5):
    """Criar empresas"""
    print(f"\n🏢 Criando {count} empresas...")
    companies = []

    countries = ['Brazil', 'USA', 'Mexico', 'Canada', 'Argentina', 'Chile', 'Colombia']

    for i in range(count):
        company = Company.objects.create(
            company_id=f"COM-{str(i+1).zfill(3)}",
            name=fake.company(),
            country=choice(countries),
            city=fake.city(),
            status=choice(['active', 'inactive', 'pending']),
            ownership_percentage=randint(50, 100)
        )
        companies.append(company)
        print(f"  ✓ {company.name} ({company.country})")

    # Criar algumas subsidiárias
    print("\n🏢 Criando subsidiárias...")
    for company in companies[:3]:
        subsidiary = Company.objects.create(
            company_id=f"SUB-{company.company_id}",
            name=f"{company.name} - Subsidiary",
            country=company.country,
            city=fake.city(),
            parent=company,
            status='active',
            ownership_percentage=100
        )
        print(f"  ✓ {subsidiary.name} (parent: {company.name})")

    return companies

def create_stores(companies, count_per_company=3):
    """Criar lojas"""
    print(f"\n🏪 Criando lojas...")
    stores = []

    for company in companies:
        for i in range(count_per_company):
            store = Store.objects.create(
                store_id=f"STR-{company.company_id}-{str(i+1).zfill(2)}",
                name=f"{company.name} Store {i+1}",
                company=company,
                country=company.country,
                city=fake.city(),
                address=fake.address(),
                is_active=choice([True, True, True, False])
            )
            stores.append(store)
            print(f"  ✓ {store.name}")

    return stores

def create_categories(count=8):
    """Criar categorias de produtos"""
    print(f"\n📁 Criando {count} categorias...")
    categories = []

    category_names = [
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Sports & Outdoors',
        'Tools & Hardware',
        'Beauty & Personal Care',
        'Food & Beverages',
        'Books & Media'
    ]

    for name in category_names[:count]:
        category = Category.objects.create(
            name=name,
            description=f"Products in {name} category"
        )
        categories.append(category)
        print(f"  ✓ {category.name}")

    return categories

def create_products(categories, count_per_category=5):
    """Criar produtos"""
    print(f"\n📦 Criando produtos...")
    products = []

    for category in categories:
        for i in range(count_per_category):
            product = Product.objects.create(
                sku=f"SKU-{category.name[:3].upper()}-{str(i+1).zfill(4)}",
                name=f"{fake.word().capitalize()} {fake.word().capitalize()} {i+1}",
                category=category,
                description=fake.sentence(),
                price=Decimal(str(round(uniform(10, 500), 2))),
                status=choice(['in-stock', 'low-stock', 'out-of-stock'])
            )
            products.append(product)
            print(f"  ✓ {product.name} (${product.price})")

    return products

def create_warehouses(stores, count_per_store=2):
    """Criar warehouses"""
    print(f"\n🏭 Criando warehouses...")
    warehouses = []

    for store in stores:
        for i in range(count_per_store):
            warehouse = Warehouse.objects.create(
                warehouse_id=f"WH-{store.store_id}-{str(i+1).zfill(2)}",
                name=f"{store.name} Warehouse {i+1}",
                store=store
            )
            warehouses.append(warehouse)
            print(f"  ✓ {warehouse.name}")

    return warehouses

def create_warehouse_locations(warehouses, products, locations_per_warehouse=8):
    """Criar localizações no warehouse"""
    print(f"\n📍 Criando localizações de warehouse...")
    locations = []

    for warehouse in warehouses:
        for i in range(locations_per_warehouse):
            if products:
                product = choice(products)
                location = WarehouseLocation.objects.create(
                    warehouse=warehouse,
                    product=product,
                    aisle=f"A{randint(1, 10)}",
                    shelf=f"S{randint(1, 10)}",
                    box=f"B{randint(1, 10)}",
                    quantity=randint(10, 500)
                )
                locations.append(location)
                print(f"  ✓ {product.name} at {warehouse.name} - Qty: {location.quantity}")

    return locations

def create_inventory(stores, products, count_per_store=10):
    """Criar inventory"""
    print(f"\n📊 Criando inventory...")
    inventories = []

    for store in stores:
        products_sample = choice(products) if products else None
        for i in range(min(count_per_store, len(products))):
            product = products[i % len(products)] if products else None
            if product:
                try:
                    inventory = Inventory.objects.create(
                        product=product,
                        store=store,
                        quantity=randint(20, 1000)
                    )
                    inventories.append(inventory)
                    print(f"  ✓ {product.name} @ {store.name} - Qty: {inventory.quantity}")
                except:
                    pass

    return inventories

def create_sales(products, count=100):
    """Criar vendas"""
    print(f"\n💰 Criando {count} vendas...")
    sales_list = []

    for i in range(count):
        product = choice(products) if products else f"Product {i+1}"
        product_name = product.name if hasattr(product, 'name') else str(product)
        
        sale = Sale.objects.create(
            product=product_name,
            customer=fake.company(),
            description=f"Sale {i+1} - {fake.text(max_nb_chars=50)}",
            amount=Decimal(str(round(uniform(50, 500), 2)))
        )
        sales_list.append(sale)
        if i % 10 == 0:
            print(f"  ✓ {i+1}/{count} vendas criadas...")

    print(f"✅ {count} vendas criadas!")
    return sales_list

def create_dashboard_metrics(stores, count=30):
    """Criar métricas de dashboard"""
    print(f"\n📈 Criando métricas...")
    metrics = []

    for i in range(count):
        metric_date = (datetime.now() - timedelta(days=i)).date()
        try:
            dashboard_metric = DashboardMetrics.objects.create(
                metric_date=metric_date,
                total_revenue=Decimal(str(randint(10000, 100000))),
                total_orders=randint(10, 100),
                total_products=randint(5, 50),
                active_customers=randint(5, 50)
            )
            metrics.append(dashboard_metric)
            if i % 5 == 0:
                print(f"  ✓ Métrica para {metric_date}")
        except:
            pass

    return metrics

def main():
    print("="*60)
    print("🚀 POPULANDO BANCO DE DADOS")
    print("="*60)
    
    clear_data()
    companies = create_companies(5)
    stores = create_stores(companies, count_per_company=3)
    categories = create_categories(8)
    products = create_products(categories, count_per_category=5)
    warehouses = create_warehouses(stores, count_per_store=2)
    locations = create_warehouse_locations(warehouses, products, locations_per_warehouse=8)
    inventories = create_inventory(stores, products, count_per_store=10)
    sales = create_sales(products, count=100)
    metrics = create_dashboard_metrics(stores, count=30)
    
    print("\n" + "="*60)
    print("✅ BANCO DE DADOS POPULADO COM SUCESSO!")
    print("="*60)
    print(f"🏢 Companies: {Company.objects.count()}")
    print(f"🏪 Stores: {Store.objects.count()}")
    print(f"📁 Categories: {Category.objects.count()}")
    print(f"📦 Products: {Product.objects.count()}")
    print(f"🏭 Warehouses: {Warehouse.objects.count()}")
    print(f"📍 Warehouse Locations: {WarehouseLocation.objects.count()}")
    print(f"📊 Inventories: {Inventory.objects.count()}")
    print(f"💰 Sales: {Sale.objects.count()}")
    print(f"📈 Dashboard Metrics: {DashboardMetrics.objects.count()}")
    print("="*60)

if __name__ == '__main__':
    main()
