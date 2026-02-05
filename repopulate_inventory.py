#!/usr/bin/env python
import os
import sys
import django
from random import randint, choice

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')

django.setup()

from supply_unlimited.sales.django_supply.models import Inventory, Product, Store

print('\n' + '='*60)
print('📦 Recriando Inventory com todas as categorias...')
print('='*60 + '\n')

# Delete old inventory
Inventory.objects.all().delete()
print('✓ Inventory anterior deletado')

# Get all data
products = Product.objects.all()
stores = Store.objects.all()

print(f'✓ Produtos: {products.count()}')
print(f'✓ Lojas: {stores.count()}')

# Create inventory for each product in each store with varied quantities
created = 0
categories_with_inv = set()

for product in products:
    for store in stores:
        # Create varied inventory quantities
        quantity = choice([0, 5, 15, 25, 50, 100, 150, 200])
        
        inventory = Inventory.objects.create(
            product=product,
            store=store,
            quantity=quantity
        )
        created += 1
        
        if product.category:
            categories_with_inv.add(product.category.name)

print(f'\n✓ Inventory items criados: {created}')
print(f'✓ Categorias com inventário: {len(categories_with_inv)}')
for cat in sorted(categories_with_inv):
    print(f'   - {cat}')

# Check stock status distribution
from supply_unlimited.sales.django_supply.models import Inventory as Inv
all_inv = Inv.objects.all()
in_stock = all_inv.filter(quantity__gt=10).count()
low_stock = all_inv.filter(quantity__gt=0, quantity__lte=10).count()
out_of_stock = all_inv.filter(quantity=0).count()

print(f'\n✓ Stock Status Distribution:')
print(f'   - In Stock (>10): {in_stock}')
print(f'   - Low Stock (1-10): {low_stock}')
print(f'   - Out of Stock (0): {out_of_stock}')

print('\n' + '='*60)
print('✅ Inventory recriado com sucesso!')
print('='*60 + '\n')
