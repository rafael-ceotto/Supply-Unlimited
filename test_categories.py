#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

import requests

r = requests.get('http://localhost:8000/api/inventory/?limit=150')
data = r.json()
categories = set()
statuses = set()
for item in data['results']:
    categories.add(item.get('category'))
    statuses.add(item.get('stock_status'))

print(f'Categories em {len(data["results"])} itens:')
for cat in sorted(categories):
    print(f'  - {cat}')
print()
print(f'Stock statuses: {sorted(statuses)}')
