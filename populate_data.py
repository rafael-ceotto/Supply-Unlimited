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
django.setup()

from users.models import Company, Store, Category, Product, Warehouse, WarehouseLocation, Inventory, Sale, DashboardMetrics

fake = Faker(['pt_BR', 'en_US'])

def clear_data():
    """Limpar dados existentes"""
    print("🗑️  Limpando dados existentes...")
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
            ownership_percentage=Decimal(str(round(uniform(50, 100), 2)))
        )
        companies.append(company)
        print(f"  ✓ {company.name} ({company.country})")
    
    # Criar algumas subsidiárias
    print("\n📊 Criando subsidiárias...")
    for company in companies[:3]:
        subsidiary = Company.objects.create(
            company_id=f"SUB-{company.company_id}",
            name=f"{company.name} - Subsidiary",
            country=company.country,
            city=fake.city(),
            parent=company,
            status='active',
            ownership_percentage=Decimal('100')
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
    print(f"\n📂 Criando {count} categorias...")
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
    
    for i in range(min(count, len(category_names))):
        category, created = Category.objects.get_or_create(
            name=category_names[i],
            defaults={'description': fake.text(max_nb_chars=100)}
        )
        if created:
            categories.append(category)
            print(f"  ✓ {category.name}")
        else:
            categories.append(category)
            print(f"  ℹ️  {category.name} (já existe)")
    
    return categories

def create_products(categories, count_per_category=10):
    """Criar produtos"""
    print(f"\n📦 Criando produtos...")
    products = []
    
    for category in categories:
        for i in range(count_per_category):
            product = Product.objects.create(
                sku=f"SKU-{fake.bothify(text='??-###')}",
                name=fake.word() + " " + fake.word(),
                category=category,
                description=fake.text(max_nb_chars=150),
                price=Decimal(str(round(uniform(10, 500), 2))),
                status=choice(['in-stock', 'low-stock', 'out-of-stock'])
            )
            products.append(product)
    
    print(f"  ✓ Criados {len(products)} produtos")
    return products

def create_warehouses(companies, count_per_company=2):
    """Criar armazéns"""
    print(f"\n🏭 Criando armazéns...")
    warehouses = []
    
    # Primeiro, pegar todas as lojas
    stores = Store.objects.all()
    
    for store in stores[:len(stores)//2]:  # Usar metade das lojas
        for i in range(count_per_company):
            warehouse = Warehouse.objects.create(
                warehouse_id=f"WH-{store.store_id}-{str(i+1).zfill(2)}",
                store=store,
                name=f"{store.name} Warehouse {i+1}"
            )
            warehouses.append(warehouse)
            print(f"  ✓ {warehouse.name}")
    
    return warehouses

def create_warehouse_locations(warehouses, products):
    """Criar localizações de armazém"""
    print(f"\n📍 Criando localizações de armazém...")
    from random import sample
    locations = []
    
    for warehouse in warehouses:
        # Usar apenas alguns produtos por armazém
        selected_products = sample(list(products), min(20, len(products)))
        
        for product in selected_products:
            try:
                location = WarehouseLocation.objects.create(
                    warehouse=warehouse,
                    product=product,
                    aisle=f"A{randint(1, 10)}",
                    shelf=f"S{randint(1, 5)}",
                    box=f"B{randint(1, 100)}",
                    quantity=randint(10, 1000)
                )
                locations.append(location)
            except Exception as e:
                print(f"  ⚠️  Erro ao criar localização: {e}")
    
    print(f"  ✓ Criadas {len(locations)} localizações")
    return locations

def create_inventory(stores, products):
    """Criar inventário"""
    print(f"\n📊 Criando inventário...")
    inventory_items = []
    
    for store in stores:
        # Cada loja tem alguns produtos
        from random import sample
        store_products = sample(list(products), min(30, len(products)))
        
        for product in store_products:
            try:
                inv = Inventory.objects.create(
                    product=product,
                    store=store,
                    quantity=randint(50, 500)
                )
                inventory_items.append(inv)
            except Exception as e:
                print(f"  ⚠️  Erro ao criar inventário: {e}")
    
    print(f"  ✓ Criados {len(inventory_items)} itens de inventário")
    return inventory_items

def create_sales(stores, products, count=200):
    """Criar vendas"""
    print(f"\n💰 Criando {count} vendas...")
    sales = []
    
    for _ in range(count):
        sale_date = fake.date_time_this_year()
        sale = Sale.objects.create(
            store=choice(stores),
            product=choice(products),
            quantity=randint(1, 50),
            total_amount=Decimal(str(round(uniform(50, 10000), 2))),
            sale_date=sale_date,
            month=sale_date.strftime('%b'),
            year=sale_date.year
        )
        sales.append(sale)
    
    print(f"  ✓ Criadas {len(sales)} vendas")
    return sales

def create_dashboard_metrics(count=30):
    """Criar métricas do dashboard"""
    print(f"\n📈 Criando métricas do dashboard...")
    
    for i in range(count):
        date = datetime.now().date() - timedelta(days=i)
        try:
            metrics = DashboardMetrics.objects.create(
                metric_date=date,
                total_revenue=Decimal(str(round(uniform(10000, 100000), 2))),
                total_orders=randint(50, 500),
                total_products=randint(50, 500),
                active_customers=randint(100, 1000)
            )
            print(f"  ✓ Métricas para {date}")
        except Exception as e:
            print(f"  ⚠️  Erro ao criar métricas: {e}")

def main():
    """Executar população de dados"""
    print("="*60)
    print("🚀 POPULANDO BANCO DE DADOS COM FAKER")
    print("="*60)
    
    # Limpar dados existentes
    clear_data()
    
    # Criar dados
    companies = create_companies(count=5)
    stores = create_stores(companies, count_per_company=3)
    categories = create_categories(count=8)
    products = create_products(categories, count_per_category=10)
    warehouses = create_warehouses(companies, count_per_company=2)
    locations = create_warehouse_locations(warehouses, products)
    inventory = create_inventory(stores, products)
    sales = create_sales(stores, products, count=200)
    create_dashboard_metrics(count=30)
    
    print("\n" + "="*60)
    print("✨ POPULAÇÃO CONCLUÍDA COM SUCESSO!")
    print("="*60)
    print(f"\n📊 Resumo dos dados criados:")
    print(f"  • Empresas: {Company.objects.count()}")
    print(f"  • Lojas: {Store.objects.count()}")
    print(f"  • Categorias: {Category.objects.count()}")
    print(f"  • Produtos: {Product.objects.count()}")
    print(f"  • Armazéns: {Warehouse.objects.count()}")
    print(f"  • Localizações: {WarehouseLocation.objects.count()}")
    print(f"  • Inventário: {Inventory.objects.count()}")
    print(f"  • Vendas: {Sale.objects.count()}")
    print(f"  • Métricas: {DashboardMetrics.objects.count()}")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
