#!/usr/bin/env python
import os
import django
import sys
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

from ai_reports.models import ChatSession, ChatMessage, GeneratedReport, AIAgentConfig
from django.contrib.auth.models import User

def populate_ai_agents():
    print("🤖 Criando AI Agents...")
    
    # Get or create admin user
    admin_user, _ = User.objects.get_or_create(username='rafa', defaults={'email': 'rafa@supply.com'})
    
    # Clear existing data
    ChatMessage.objects.all().delete()
    ChatSession.objects.all().delete()
    AIAgentConfig.objects.all().delete()
    GeneratedReport.objects.all().delete()
    
    # Create agent configs
    agents_data = [
        {
            'name': 'Sales Analytics Agent',
            'model_name': 'gpt-4',
            'system_prompt': 'You are a sales analytics expert. Analyze sales trends and provide insights.'
        },
        {
            'name': 'Inventory Management Agent',
            'model_name': 'gpt-4',
            'system_prompt': 'You are an inventory management expert. Optimize inventory levels.'
        },
        {
            'name': 'Performance Agent',
            'model_name': 'gpt-4',
            'system_prompt': 'You are a performance analyst. Track KPIs and metrics.'
        },
        {
            'name': 'Forecasting Agent',
            'model_name': 'gpt-4',
            'system_prompt': 'You are a demand forecasting expert. Predict trends.'
        },
        {
            'name': 'Risk Analysis Agent',
            'model_name': 'gpt-4',
            'system_prompt': 'You are a supply chain risk analyst. Identify risks.'
        }
    ]
    
    agents = []
    for data in agents_data:
        agent = AIAgentConfig.objects.create(
            name=data['name'],
            model_name=data['model_name'],
            system_prompt=data['system_prompt'],
            temperature=0.7,
            max_tokens=2000,
            is_active=True
        )
        agents.append(agent)
        print(f"  ✓ {agent.name}")
    
    # Create chat sessions
    print("\n💬 Criando Chat Sessions...")
    for i, agent in enumerate(agents):
        for j in range(2):
            session = ChatSession.objects.create(
                user=admin_user,
                title=f"{agent.name} Session #{j+1}",
                is_archived=False
            )
            print(f"  ✓ {session.title}")
            
            # Add chat messages
            messages = [
                {
                    'type': 'user',
                    'content': f'Analyze the {agent.name} data'
                },
                {
                    'type': 'ai',
                    'content': f'Processing {agent.name} analysis...',
                    'status': 'analyzing'
                },
                {
                    'type': 'ai',
                    'content': 'Data collection complete. Generating insights...',
                    'status': 'generating'
                },
                {
                    'type': 'ai',
                    'content': 'Analysis complete! Here are the key findings:\n1. Performance trend positive\n2. Growth opportunity identified\n3. Recommendations provided',
                    'status': 'complete'
                }
            ]
            
            for msg_idx, msg in enumerate(messages):
                ChatMessage.objects.create(
                    session=session,
                    message_type=msg['type'],
                    content=msg['content'],
                    status=msg.get('status'),
                    agent=agent,
                    agent_name=agent.name,
                    agent_model=agent.model_name,
                    created_at=(datetime.now() - timedelta(minutes=5-msg_idx))
                )
    
    print("\n" + "="*50)
    print("✅ AI AGENTS CRIADOS COM SUCESSO!")
    print("="*50)
    print(f"🤖 Agents: {AIAgentConfig.objects.count()}")
    print(f"💬 Chat Sessions: {ChatSession.objects.count()}")
    print(f"💬 Chat Messages: {ChatMessage.objects.count()}")
    print(f"📊 Generated Reports: {GeneratedReport.objects.count()}")
    print("="*50)

if __name__ == '__main__':
    populate_ai_agents()
