#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
sys.path.insert(0, '/app/supply_unlimited/sales')

django.setup()

# Now import the populate script
exec(open('/app/populate_data.py').read())
