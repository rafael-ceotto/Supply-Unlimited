#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from django.test import Client
import json

c = Client()
r = c.get('/sales/api/')
data = json.loads(r.content)

print(f"Status: {r.status_code}")
print(f"Results count: {len(data.get('results', []))}")
if data.get('results'):
    print(f"First result: {json.dumps(data['results'][0], indent=2)}")
else:
    print(f"Data: {json.dumps(data, indent=2)}")
