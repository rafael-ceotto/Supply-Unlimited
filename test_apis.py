#!/usr/bin/env python
import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

import requests

print('\n=== TESTE DE APIS ===\n')

print('Companies API:')
r = requests.get('http://localhost:8000/api/companies/')
data = r.json()
comp = data['results'][0]
print(f'  company_id: {comp.get("company_id")}')
print(f'  name: {comp.get("name")}')
print(f'  ownership_percentage: {comp.get("ownership_percentage")}')
print(f'  parent_name: {comp.get("parent_name")}')
print()

print('Inventory API:')
r = requests.get('http://localhost:8000/api/inventory/?limit=1')
data = r.json()
inv = data['results'][0]
print(f'  product_name: {inv.get("product_name")}')
print(f'  category: {inv.get("category")}')
print(f'  price: {inv.get("price")}')
print(f'  quantity: {inv.get("quantity")}')
print(f'  stock_status: {inv.get("stock_status")}')

print('\n=== OK ===\n')
