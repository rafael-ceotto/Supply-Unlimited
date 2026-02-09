"""
Script to populate the database with sample data
Execute: python populate_data.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
import random

from users.models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, Sale, DashboardMetrics
)
from ai_reports.models import AIAgentConfig

def populate_database():
    """Populate the database with sample data"""
    
    print('Starting database population...')
    
    # Clear existing data
    print('Cleaning up old data...')
    DashboardMetrics.objects.all().delete()
    Sale.objects.all().delete()
    Inventory.objects.all().delete()
    WarehouseLocation.objects.all().delete()
    Warehouse.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    Store.objects.all().delete()
    Company.objects.all().delete()
    AIAgentConfig.objects.all().delete()
    
    # Create companies
    print('Creating companies...')
    companies = []
    company_names = [
        ('COM-001', 'Tech Innovations Inc.', 'United States'),
        ('COM-002', 'Global Supplies Ltd.', 'United Kingdom'),
        ('COM-003', 'Digital Solutions', 'Canada'),
        ('COM-004', 'Enterprise Systems', 'Germany'),
        ('COM-005', 'Innovation Labs', 'France')
    ]
    
    for company_id, name, country in company_names:
        company = Company.objects.create(
            company_id=company_id,
            name=name,
            country=country,
            city='New York' if 'United States' in country else 'London' if 'Kingdom' in country else 'Toronto' if 'Canada' in country else 'Berlin' if 'Germany' in country else 'Paris',
            status='active',
            ownership_percentage=100
        )
        companies.append(company)
        print(f'  ✓ {name}')
    
    # Create stores
    print('\nCreating stores/locations...')
    stores = []
    store_locations = [
        ('HQ', 'Headquarters'),
        ('West', 'West Coast'),
        ('East', 'East Coast'),
        ('Mid', 'Midwest'),
        ('South', 'South Region'),
    ]
    
    store_counter = 1
    for company in companies:
        for loc_code, loc_name in store_locations:
            store = Store.objects.create(
                store_id=f'{company.company_id}-{loc_code}',
                company=company,
                name=f'{company.name} - {loc_name}',
                city='New York' if random.random() > 0.5 else 'Los Angeles',
                country=company.country,
                address=f'{random.randint(100, 9999)} {loc_name} Road',
                is_active=True
            )
            stores.append(store)
            store_counter += 1
    
    print(f'  ✓ {len(stores)} stores created')
    
    # Create categories
    print('\nCreating product categories...')
    categories = []
    category_names = [
        'Electronics', 'Software', 'Hardware',
        'Services', 'Consulting', 'Support',
        'Cloud Services', 'Security'
    ]
    
    for name in category_names:
        category = Category.objects.create(
            name=name,
            description=f'{name} products and services'
        )
        categories.append(category)
    
    print(f'  ✓ {len(categories)} categories created')
    
    # Create products
    print('\nCreating products...')
    products = []
    product_data = [
        ('SKU-0001', 'Server Package', 'Premium server with support'),
        ('SKU-0002', 'Cloud Suite', 'Cloud infrastructure bundle'),
        ('SKU-0003', 'Security Edition', 'Advanced security tools'),
        ('SKU-0004', 'Desktop Pro', 'High-performance workstation'),
        ('SKU-0005', 'Laptop Elite', 'Professional laptop'),
        ('SKU-0006', 'Database License', 'Enterprise database software'),
        ('SKU-0007', 'Support Plan', '24/7 technical support'),
        ('SKU-0008', 'Backup Solution', 'Automated backup and recovery'),
        ('SKU-0009', 'Monitoring Tool', 'System monitoring platform'),
        ('SKU-0010', 'API Gateway', 'API management solution'),
        ('SKU-0011', 'Network Switch', '48-port managed switch'),
        ('SKU-0012', 'Router Pro', 'Enterprise router'),
        ('SKU-0013', 'Storage Array', 'NAS storage solution'),
        ('SKU-0014', 'Printer Pro', 'Network printer'),
        ('SKU-0015', 'Scanner Device', 'Document scanner'),
        ('SKU-0016', 'UPS System', 'Uninterruptible power supply'),
        ('SKU-0017', 'Rack Cabinet', '42U server rack'),
        ('SKU-0018', 'Cooling Unit', 'Precision cooling system'),
        ('SKU-0019', 'Cable Management', 'Structured cabling'),
        ('SKU-0020', 'Maintenance Kit', 'Annual maintenance package'),
    ]
    
    for sku, name, description in product_data:
        product = Product.objects.create(
            sku=sku,
            name=name,
            description=description,
            category=random.choice(categories),
            price=Decimal(str(random.randint(100, 10000))),
            status='in-stock'
        )
        products.append(product)
    
    # Add more products to reach 50+
    for i in range(30):
        sku = f'SKU-{1000+i+20:04d}'
        product = Product.objects.create(
            sku=sku,
            name=f'Product {len(products)+1}',
            description=f'Premium product from {random.choice(categories).name}',
            category=random.choice(categories),
            price=Decimal(str(random.randint(100, 5000))),
            status='in-stock'
        )
        products.append(product)
    
    print(f'  ✓ {len(products)} products created')
    
    # Create warehouses
    print('\nCreating warehouses...')
    warehouses = []
    for i, store in enumerate(stores[:5]):  # Create warehouse for first 5 stores
        warehouse_id = f'{store.store_id}-WH-{i+1:03d}'
        warehouse = Warehouse.objects.create(
            warehouse_id=warehouse_id,
            store=store,
            name=f'Warehouse {store.name}'
        )
        warehouses.append(warehouse)
    
    print(f'  ✓ {len(warehouses)} warehouses created')
    
    # Create warehouse locations
    print('\nCreating warehouse locations...')
    location_count = 0
    for warehouse in warehouses:
        for product in random.sample(products, min(10, len(products))):
            location = WarehouseLocation.objects.create(
                warehouse=warehouse,
                product=product,
                aisle=f'A{random.randint(1, 5)}',
                shelf=f'S{random.randint(1, 10)}',
                box=f'B{random.randint(1, 20)}',
                quantity=random.randint(10, 100)
            )
            location_count += 1
    
    print(f'  ✓ {location_count} warehouse locations created')
    
    # Create inventory
    print('\nCreating inventory records...')
    inventory_count = 0
    for store in stores:
        for product in random.sample(products, min(15, len(products))):
            inventory = Inventory.objects.create(
                store=store,
                product=product,
                quantity=random.randint(5, 200)
            )
            inventory_count += 1
    
    print(f'  ✓ {inventory_count} inventory records created')
    
    # Create sales
    print('\nCreating sales records...')
    sale_count = 0
    for _ in range(50):
        store = random.choice(stores)
        product = random.choice(products)
        quantity = random.randint(1, 10)
        sale_date = timezone.now() - timedelta(days=random.randint(0, 90))
        
        sale = Sale.objects.create(
            store=store,
            product=product,
            quantity=quantity,
            total_amount=product.price * quantity,
            sale_date=sale_date,
            month=sale_date.strftime('%b'),
            year=sale_date.year
        )
        sale_count += 1
    
    print(f'  ✓ {sale_count} sales records created')
    
    # Create AI agent configurations
    print('\nConfiguring AI agents...')
    ai_agents = [
        ('Sales Analyst', 'Analyzes sales trends and patterns'),
        ('Inventory Manager', 'Manages inventory levels and alerts'),
        ('Report Generator', 'Generates comprehensive reports'),
        ('Trend Predictor', 'Predicts future trends'),
    ]
    
    for name, description in ai_agents:
        try:
            agent = AIAgentConfig.objects.create(
                name=name,
                model_name='gpt-4',
                temperature=0.7,
                max_tokens=2000,
                system_prompt=f'You are an AI assistant for {name}. {description}'
            )
            print(f'  ✓ {name}')
        except Exception as e:
            print(f'  ⚠ {name} - {str(e)[:50]}')
    
    print('\n✅ Sample data loaded successfully!')
    print(f'\nCreated:')
    print(f'  • {len(companies)} Companies')
    print(f'  • {len(stores)} Stores')
    print(f'  • {len(products)} Products')
    print(f'  • {inventory_count} Inventory Records')
    print(f'  • {sale_count} Sample Sales')
    print(f'  • Multiple AI Agents')
    print(f'\nYour dashboard is ready with data!')

if __name__ == '__main__':
    populate_database()
