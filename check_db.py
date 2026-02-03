import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.models import Inventory

# Obter países únicos do inventário
countries = Inventory.objects.values_list('store__country', flat=True).distinct()
print("Países encontrados no Live Stock Inventory:")
for country in sorted(set(countries)):
    count = Inventory.objects.filter(store__country=country).count()
    print(f"  - {country}: {count} itens")
