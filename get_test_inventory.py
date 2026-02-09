import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.models import Inventory

# Get first in-stock inventory
inv = Inventory.objects.filter(quantity__gt=0).first()
if inv:
    print(f'Testing with Inventory ID: {inv.id}')
    print(f'  Product: {inv.product.sku} - {inv.product.name}')
    print(f'  Store: {inv.store.name}')
    print(f'  Quantity: {inv.quantity}')
    print(f'\nTest URL: http://localhost:8000/api/inventory/{inv.id}/warehouse/')
else:
    print('No in-stock inventory found')
