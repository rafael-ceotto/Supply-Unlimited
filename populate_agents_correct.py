#!/usr/bin/env python
import os
import sys
import django
import json
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')

django.setup()

from ai_reports.models import AIAgentConfig, ChatSession, ChatMessage
from django.contrib.auth.models import User
from supply_unlimited.sales.django_supply.models import Company, Inventory

def populate_agents_with_reports():
    print('\n' + '='*60)
    print('🤖 Recriando AI Agents com Modelos LLM Corretos...')
    print('='*60)
    
    # Clear existing
    ChatMessage.objects.all().delete()
    ChatSession.objects.all().delete()
    AIAgentConfig.objects.all().delete()
    
    # Get or create user
    user, _ = User.objects.get_or_create(username='rafa')
    
    # Agent configurations with real LLM models
    agents_config = [
        {
            'name': 'GPT-4',
            'model_name': 'gpt-4',
            'temperature': 0.7,
            'max_tokens': 2000,
            'system_prompt': 'You are an advanced business intelligence assistant powered by GPT-4. Analyze data and provide comprehensive business reports with actionable insights.'
        },
        {
            'name': 'Claude',
            'model_name': 'claude-3-opus',
            'temperature': 0.5,
            'max_tokens': 2000,
            'system_prompt': 'You are Claude, an AI assistant specializing in detailed business analysis and report generation. Provide thorough insights with supporting data.'
        },
        {
            'name': 'Llama',
            'model_name': 'llama-2-70b',
            'temperature': 0.6,
            'max_tokens': 1500,
            'system_prompt': 'You are Llama, a large language model optimized for business analytics. Generate clear, data-driven reports and recommendations.'
        },
        {
            'name': 'Mistral',
            'model_name': 'mistral-large',
            'temperature': 0.7,
            'max_tokens': 1800,
            'system_prompt': 'You are Mistral, an AI model designed for business intelligence. Create detailed reports with market analysis and performance metrics.'
        }
    ]
    
    # Create agents
    agents = []
    for config in agents_config:
        agent = AIAgentConfig.objects.create(
            name=config['name'],
            model_name=config['model_name'],
            temperature=config['temperature'],
            max_tokens=config['max_tokens'],
            system_prompt=config['system_prompt'],
            is_active=True
        )
        agents.append(agent)
        print(f"  ✓ {config['name']} ({config['model_name']}) criado")
    
    print('\n' + '='*60)
    print('✅ AI AGENTS CRIADOS COM SUCESSO!')
    print('='*60)
    print(f'🤖 Agents: {len(agents)}')
    print(f'🏢 Companies no banco: {Company.objects.count()}')
    print(f'📦 Inventory items: {Inventory.objects.count()}')
    print('='*60 + '\n')


if __name__ == '__main__':
    populate_agents_with_reports()

if __name__ == '__main__':
    populate_agents_with_reports()
