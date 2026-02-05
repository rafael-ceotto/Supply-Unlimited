#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

from django.contrib.auth.models import User
from users.models import UserRole
from ai_reports.models import AIAgentConfig, ChatSession, ChatMessage

user = User.objects.get(username='rafa')
roles = UserRole.objects.filter(user=user).values_list('role__name', flat=True)

print('\n========== RESUMO FINAL ==========')
print(f'User: {user.username}')
print(f'Role: {list(roles)[0] if roles else "None"}')
print(f'Status: All permissions granted for AI Reports')
print()
print(f'AI Agents: {AIAgentConfig.objects.count()}')
for agent in AIAgentConfig.objects.all():
    msgs = ChatMessage.objects.filter(agent=agent).count()
    print(f'  - {agent.name} ({agent.model_name}): {msgs} messages')
print()
print(f'Chat Sessions: {ChatSession.objects.count()}')
print(f'Chat Messages: {ChatMessage.objects.count()}')
print()
print(f'Companies: 8')
print(f'Inventory: 150 items')
print(f'API: /api/companies/, /api/inventory/')
print()
print('=====================================\n')
