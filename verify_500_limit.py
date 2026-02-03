#!/usr/bin/env python
import os
import json
import django
import sys

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "supply_unlimited.settings")
sys.path.insert(0, '/app')
django.setup()

from django.db.models import Q

# Determine which app has Inventory model
try:
    from sales.models import Inventory
except ImportError:
    from users.models import Inventory

# Query directly - return first 500 items
inventory_items = Inventory.objects.select_related('product', 'store', 'store__company').order_by('store__country')

# Prepare data  
data = []
for item in inventory_items[:500]:
    if item.quantity >= 200:
        status = 'High'
    elif item.quantity >= 50:
        status = 'Medium'
    else:
        status = 'Low'
    
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

print("Number of items returned:", len(data))
print("\nCountries in response:")

countries = {}
for item in data:
    country = item['store']
    if country not in countries:
        countries[country] = 0
    countries[country] += 1

for country, count in sorted(countries.items()):
    print(f"  {country}: {count} items")
