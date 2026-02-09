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
    company_data = [
        ('COM-001', 'Tech Innovations Inc.', 'United States', 'New York', 'active', 100),
        ('COM-002', 'Global Supplies Ltd.', 'United Kingdom', 'London', 'active', 80),
        ('COM-003', 'Digital Solutions', 'Canada', 'Toronto', 'active', 90),
        ('COM-004', 'Enterprise Systems', 'Germany', 'Berlin', 'pending', 75),
        ('COM-005', 'Innovation Labs', 'France', 'Paris', 'inactive', 60),
        ('COM-006', 'Northern Tech', 'Sweden', 'Stockholm', 'active', 85),
        ('COM-007', 'Pacific Logistics', 'Australia', 'Sydney', 'active', 95),
        ('COM-008', 'Iberia Distribution', 'Spain', 'Madrid', 'pending', 70),
        ('COM-009', 'Nordic Solutions', 'Norway', 'Oslo', 'inactive', 50),
        ('COM-010', 'Asian Markets', 'Singapore', 'Singapore', 'active', 88),
    ]
    
    for company_id, name, country, city, status, ownership in company_data:
        company = Company.objects.create(
            company_id=company_id,
            name=name,
            country=country,
            city=city,
            status=status,
            ownership_percentage=ownership
        )
        companies.append(company)
        print(f'  ✓ {name}')
    
    # Create stores
    print('\nCreating stores/locations...')
    stores = []
    store_locations = [
        ('HQ', 'HeadquartersMain'),
        ('West', 'West Location'),
        ('East', 'East Location'),
        ('Mid', 'Central Location'),
        ('South', 'South Location'),
    ]
    
    for company in companies:
        for loc_code, loc_name in store_locations:
            store = Store.objects.create(
                store_id=f'{company.company_id}-{loc_code}',
                company=company,
                name=f'{company.name} - {loc_name}',
                city=company.city,
                country=company.country,
                address=f'{random.randint(100, 9999)} {loc_name} Street',
                is_active=True if company.status == 'active' else False
            )
            stores.append(store)
    
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
            description=f'{name} products and solutions'
        )
        categories.append(category)
    
    print(f'  ✓ {len(categories)} categories created')
    
    # Create products
    print('\nCreating products...')
    products = []
    product_data = [
        ('SKU-0001', 'USB-C Cable 2m', 'High-speed USB-C charging cable', 12.99),
        ('SKU-0002', 'HDMI Cable 1.5m', '4K HDMI 2.1 cable', 15.49),
        ('SKU-0003', 'Screen Protector', 'Tempered glass screen protector', 8.99),
        ('SKU-0004', 'Phone Stand', 'Adjustable aluminum phone stand', 19.99),
        ('SKU-0005', 'Wireless Mouse', 'Ergonomic 2.4GHz wireless mouse', 24.99),
        ('SKU-0006', 'Mechanical Keyboard', 'RGB mechanical keyboard', 79.99),
        ('SKU-0007', 'USB Hub 7-Port', 'USB 3.0 7-port hub with power', 34.99),
        ('SKU-0008', 'External SSD 1TB', '1TB USB-C external SSD', 99.99),
        ('SKU-0009', 'Webcam 1080p', 'Full HD USB webcam with mic', 44.99),
        ('SKU-0010', 'Desk Lamp LED', 'Adjustable LED desk lamp', 39.99),
        ('SKU-0011', 'Laptop Stand', 'Aluminum laptop cooling stand', 29.99),
        ('SKU-0012', 'USB Power Strip', '4 outlets + 2 USB charging', 27.99),
        ('SKU-0013', 'Cable Organizer Kit', 'Cable clips and organizers', 14.99),
        ('SKU-0014', 'Microphone USB', 'Studio-quality USB microphone', 89.99),
        ('SKU-0015', 'Monitor Arm', 'Adjustable single monitor arm', 59.99),
        ('SKU-0016', 'Desk Mat', 'Large leather desk mouse pad', 34.99),
        ('SKU-0017', 'Monitor Light Bar', 'USB monitor light bar', 69.99),
        ('SKU-0018', 'Cooling Pad Laptop', 'Laptop cooling pad with fans', 32.99),
        ('SKU-0019', 'Surge Protector', '6 outlet surge protector', 21.99),
        ('SKU-0020', 'Phone Charger 65W', 'Fast charger 65W USB-C', 49.99),
    ]
    
    for sku, name, description, price in product_data:
        product = Product.objects.create(
            sku=sku,
            name=name,
            description=description,
            category=random.choice(categories),
            price=Decimal(str(price)),
            status='in-stock'
        )
        products.append(product)
    
    # Add more products to reach 50+
    additional_products = [
        'USB-A Cable 3m', 'Type-C Adapter', 'HDMI Splitter', 'DisplayPort Cable',
        'DVI Cable 2m', 'Network Cable Cat6', 'Audio Jack Splitter', 'VGA Cable',
        'Thunderbolt Cable', 'Mini HDMI Cable', 'MicroUSB Cable', 'Lightning Cable',
        'USB HUB 4-Port', 'Card Reader', 'Docking Station', 'USB Switch',
        'Wireless Charger', 'Portable Battery', 'Power Bank 20000mAh', 'Solar Charger',
        'Screen Cleaner', 'Keyboard Cleaner', 'Cable Sleeve', 'Monitor Riser',
        'Bluetooth Speaker', 'USB Fan', 'LED Ring Light', 'Pop Socket',
        'Phone Case Stand', 'Wireless Charger Pad'
    ]
    
    for i, name in enumerate(additional_products):
        sku = f'SKU-{1020+i:04d}'
        product = Product.objects.create(
            sku=sku,
            name=name,
            description=f'Quality {name.lower()} with premium build',
            category=random.choice(categories),
            price=Decimal(str(round(random.uniform(9.99, 99.99), 2))),
            status='in-stock'
        )
        products.append(product)
    
    print(f'  ✓ {len(products)} products created')
    
    # Create warehouses
    print('\nCreating warehouses...')
    warehouses = []
    for i, store in enumerate(stores[:10]):  # Create warehouse for first 10 stores
        warehouse_id = f'{store.store_id}-WH-{i+1:03d}'
        warehouse = Warehouse.objects.create(
            warehouse_id=warehouse_id,
            store=store,
            name=f'Warehouse {store.name}'
        )
        warehouses.append(warehouse)
    
    print(f'  ✓ {len(warehouses)} warehouses created')
    
    # Create inventory
    print('\nCreating inventory records...')
    inventory_count = 0
    for store in stores:
        # Select 15-20 products per store
        store_products = random.sample(products, min(15, len(products)))
        for product in store_products:
            # 20% chance of being out of stock
            if random.random() < 0.2:
                quantity = 0
            elif random.random() < 0.3:
                quantity = random.randint(1, 20)  # Low stock
            else:
                quantity = random.randint(25, 200)  # In stock
            
            inventory = Inventory.objects.create(
                store=store,
                product=product,
                quantity=quantity
            )
            inventory_count += 1
    
    print(f'  ✓ {inventory_count} inventory records created')
    
    # Create warehouse locations (only for in-stock or low-stock products)
    # MOVED AFTER INVENTORY CREATION so warehouse locations can link to actual inventory
    print('\nCreating warehouse locations...')
    location_count = 0
    for warehouse in warehouses:
        # Get products with stock in this warehouse's store
        in_stock_inventory = Inventory.objects.filter(
            store=warehouse.store,
            quantity__gt=0
        ).select_related('product')
        
        # Add warehouse locations for ALL in-stock products
        for inv in in_stock_inventory:
            location = WarehouseLocation.objects.create(
                warehouse=warehouse,
                product=inv.product,
                aisle=f'A{random.randint(1, 8)}',
                shelf=f'S{random.randint(1, 10)}',
                box=f'B{random.randint(1, 20)}',
                quantity=inv.quantity
            )
            location_count += 1
    
    print(f'  ✓ {location_count} warehouse locations created')
    
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
        ('gpt', 'GPT-4 Agent', 'Analyzes sales trends and patterns using GPT-4'),
        ('claude', 'Claude Agent', 'Manages inventory levels and alerts using Claude'),
        ('llama', 'Llama Agent', 'Generates comprehensive reports using Llama'),
        ('mistral', 'Mistral Agent', 'Predicts future trends using Mistral'),
    ]
    
    for agent_key, name, description in ai_agents:
        try:
            agent = AIAgentConfig.objects.create(
                name=name,
                model_name=agent_key,
                temperature=0.7,
                max_tokens=2000,
                system_prompt=f'You are an AI assistant powered by {agent_key}. {description}. Always respond in the same language as the user input.'
            )
            print(f'  ✓ {name}')
        except Exception as e:
            print(f'  ⚠ {name} - {str(e)[:50]}')
    
    # Create admin user
    print('\nCreating admin user...')
    from django.contrib.auth.models import User
    try:
        admin_user = User.objects.get(username='rafa')
        admin_user.set_password('rafa123')
        admin_user.save()
        print(f'  ✓ Admin user "rafa" updated')
    except User.DoesNotExist:
        admin_user = User.objects.create_superuser('rafa', 'rafa@supply.com', 'rafa123')
        print(f'  ✓ Admin user "rafa" created')
    
    print('\n✅ Sample data loaded successfully!')
    print(f'\nCreated:')
    print(f'  • {len(companies)} Companies')
    print(f'  • {len(stores)} Stores')
    print(f'  • {len(products)} Products')
    print(f'  • {inventory_count} Inventory Records')
    print(f'  • {sale_count} Sample Sales')
    print(f'  • Multiple AI Agents')
    print(f'\nYour dashboard is ready with data!')
    print(f'\n🔐 Login credentials:')
    print(f'  Username: rafa')
    print(f'  Password: rafa123')

if __name__ == '__main__':
    populate_database()
