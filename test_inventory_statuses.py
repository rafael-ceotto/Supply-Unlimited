import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.models import Inventory

# Get an out-of-stock inventory
inv_out = Inventory.objects.filter(quantity=0).first()
if inv_out:
    print(f'Out-of-stock Inventory ID: {inv_out.id}')
    print(f'  Product: {inv_out.product.sku} - {inv_out.product.name}')
    print(f'  Store: {inv_out.store.name}')
    print(f'  Quantity: {inv_out.quantity}')
    print(f'\nTest URL: http://localhost:8000/api/inventory/{inv_out.id}/warehouse/')

# Get an in-stock inventory
inv_in = Inventory.objects.filter(quantity__gte=25).first()
if inv_in:
    print(f'\nIn-stock Inventory ID: {inv_in.id}')
    print(f'  Product: {inv_in.product.sku} - {inv_in.product.name}')
    print(f'  Store: {inv_in.store.name}')
    print(f'  Quantity: {inv_in.quantity}')
    print(f'Test URL: http://localhost:8000/api/inventory/{inv_in.id}/warehouse/')
