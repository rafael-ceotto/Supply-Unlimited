#!/usr/bin/env python
import os
import json
import django
import sys

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "supply_unlimited.settings")
sys.path.insert(0, '/app')
django.setup()

from users.views import inventory_data
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.middleware import SessionMiddleware

# Create a request with authentication
factory = RequestFactory()
request = factory.get('/api/inventory/')

# Add session and user
middleware = SessionMiddleware(lambda x: None)
middleware.process_request(request)
request.session.save()
request.user = AnonymousUser()  # Use anonymous user for testing

# Call the view directly (bypass authentication requirement)
from django.db.models import Q

# Determine which app has Inventory model
try:
    from sales.models import Inventory
except ImportError:
    from users.models import Inventory

# Query directly
inventory_items = Inventory.objects.select_related('product', 'store', 'store__company').order_by('store__country')

print("Total inventory items in database:", inventory_items.count())

# Check countries without limit
all_data = []
for item in inventory_items:
    if item.quantity >= 200:
        status = 'High'
    elif item.quantity >= 50:
        status = 'Medium'
    else:
        status = 'Low'
    
    all_data.append({
        'id': item.id,
        'sku': item.product.sku,
        'name': item.product.name,
        'category': item.product.category.name if item.product.category else 'N/A',
        'store': item.store.country,
        'stock': item.quantity,
        'price': float(item.product.price),
        'status': status,
    })

print("Number of items when not limited:", len(all_data))
print("\nCountries in full database:")

countries_full = {}
for item in all_data:
    country = item['store']
    if country not in countries_full:
        countries_full[country] = 0
    countries_full[country] += 1

for country, count in sorted(countries_full.items()):
    print(f"  {country}: {count} items")

# Prepare data  
data = []
for item in inventory_items[:100]:
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

print("\nFirst 5 items:")
for item in data[:5]:
    print(f"  SKU: {item['sku']}, Name: {item['name']}, Country: {item['store']}")
