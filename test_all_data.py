#!/usr/bin/env python
import os
import sys
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

import requests
from ai_reports.models import AIAgentConfig, ChatSession, ChatMessage
from supply_unlimited.sales.django_supply.models import Company, Inventory

print('\n' + '='*60)
print('✅ VERIFICAÇÃO DE DADOS E APIS')
print('='*60)

# Test companies API
print('\n🔍 Testando /api/companies/')
try:
    r = requests.get('http://localhost:8000/api/companies/')
    data = r.json()
    count = data.get('count', len(data.get('results', [])))
    print(f'✅ Status HTTP: {r.status_code}')
    print(f'✅ Companies encontradas: {count}')
    if data.get('results') and len(data['results']) > 0:
        print(f'   Primeiro: {data["results"][0]["name"]}')
except Exception as e:
    print(f'❌ Erro: {e}')

# Test inventory API
print('\n🔍 Testando /api/inventory/')
try:
    r = requests.get('http://localhost:8000/api/inventory/?limit=5')
    data = r.json()
    print(f'✅ Status HTTP: {r.status_code}')
    print(f'✅ Total no banco: {data.get("count", 0)}')
    print(f'✅ Retornando nesta página: {len(data.get("results", []))}')
    if data.get('results') and len(data['results']) > 0:
        print(f'   Primeiro: {data["results"][0]["product_name"]}')
except Exception as e:
    print(f'❌ Erro: {e}')

# Verify data in database
print('\n🔍 Dados no Banco (Django ORM)')
company_count = Company.objects.count()
inventory_count = Inventory.objects.count()
print(f'✅ Companies: {company_count}')
print(f'✅ Inventory items: {inventory_count}')

# Verify AI agents
print('\n🔍 AI Agents')
agents = AIAgentConfig.objects.all()
print(f'✅ Agentes criados: {agents.count()}')
for a in agents:
    messages = ChatMessage.objects.filter(agent=a).count()
    print(f'   - {a.name} ({a.model_name}): {messages} mensagens')

total_sessions = ChatSession.objects.count()
total_messages = ChatMessage.objects.count()
print(f'✅ Total Chat Sessions: {total_sessions}')
print(f'✅ Total Chat Messages: {total_messages}')

print('\n' + '='*60)
print('🎉 TUDO PRONTO!')
print('='*60 + '\n')
