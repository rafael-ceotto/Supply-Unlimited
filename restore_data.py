#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from django.contrib.auth.models import User
from decimal import Decimal
import random

print("=" * 60)
print("RESTAURANDO DADOS")
print("=" * 60)

# Create superuser
User.objects.filter(username='rafa').delete()
User.objects.create_superuser('rafa', 'rafa@example.com', 'devrafa')
print('✓ Usuario rafa criado')

print('✅ Dados restaurados com sucesso!')
