#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from supply_unlimited.sales.django_supply.models import Inventory, Store

# Verificar países no inventário
inventory_stores = set(Inventory.objects.values_list('store__country', flat=True).distinct())
print('Países no Inventory:', sorted(inventory_stores))

# Verificar todas as lojas
all_stores = set(Store.objects.values_list('country', flat=True).distinct())
print('Países em Store:', sorted(all_stores))

# Verificar quantos itens por país
print('\nQuantidade de itens por país:')
for country in sorted(inventory_stores):
    count = Inventory.objects.filter(store__country=country).count()
    print(f'  {country}: {count} itens')
