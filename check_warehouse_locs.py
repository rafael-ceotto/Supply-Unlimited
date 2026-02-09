import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.models import WarehouseLocation, Warehouse

wl_count = WarehouseLocation.objects.count()
w_count = Warehouse.objects.count()

print(f'Total Warehouse Locations: {wl_count}')
print(f'Total Warehouses: {w_count}')

if wl_count > 0:
    wl = WarehouseLocation.objects.first()
    print(f'\nSample warehouse location:')
    print(f'  Product: {wl.product.sku} - {wl.product.name}')
    print(f'  Warehouse: {wl.warehouse.name}')
    print(f'  Aisle: {wl.aisle}, Shelf: {wl.shelf}, Box: {wl.box}')
    print(f'  Quantity: {wl.quantity}')
    
    # Check locations for a specific inventory item
    from users.models import Inventory
    inv = Inventory.objects.get(id=2627)
    wl_check = WarehouseLocation.objects.filter(product=inv.product).count()
    print(f'\n  Product {inv.product.sku} has {wl_check} warehouse locations')
