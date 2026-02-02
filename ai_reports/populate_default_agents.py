"""
Script para popular agentes padrão no banco de dados
Cria agentes gratuitos com modelos que não consomem token
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from ai_reports.models import AIAgentConfig

def create_default_agents():
    """Cria agentes padrão se não existirem"""
    
    agents_config = [
        {
            'name': 'GPT-4 Supply Chain',
            'model_name': 'gpt-4',
            'temperature': 0.7,
            'max_tokens': 2000,
            'system_prompt': """Você é um assistente especializado em análise de supply chain e logística.
Sua função é:
1. Interpretar requisições de relatórios de usuários
2. Identificar KPIs relevantes para a análise solicitada
3. Acessar dados de estoque, vendas e logística
4. Gerar insights acionáveis
5. Criar recomendações baseadas em dados

Sempre estruture seus relatórios com:
- Executive Summary
- KPIs principais
- Análise detalhada
- Recomendações
- Próximos passos""",
            'is_active': True
        },
        {
            'name': 'Claude 3 Analyst',
            'model_name': 'claude-3',
            'temperature': 0.5,
            'max_tokens': 2000,
            'system_prompt': """Você é um analista especializado em supply chain.
Forneça análises detalhadas e recomendações acionáveis.
Sempre cite dados e métricas específicas.
Estruture respostas com clareza e profissionalismo.""",
            'is_active': True
        },
        {
            'name': 'Llama 2 Quick Analysis',
            'model_name': 'llama-2',
            'temperature': 0.6,
            'max_tokens': 1500,
            'system_prompt': """Você é um assistente de análise rápida.
Forneça insights práticos e diretos.
Foque em problemas imediatos e soluções.""",
            'is_active': True
        },
        {
            'name': 'Mistral Quick Report',
            'model_name': 'mistral',
            'temperature': 0.6,
            'max_tokens': 1500,
            'system_prompt': """Você é um especialista em gerar relatórios rápidos.
Identifique problemas e oportunidades.
Forneca recomendações práticas e implementáveis.""",
            'is_active': True
        },
    ]
    
    created_count = 0
    for agent_data in agents_config:
        agent, created = AIAgentConfig.objects.get_or_create(
            name=agent_data['name'],
            defaults={
                'model_name': agent_data['model_name'],
                'temperature': agent_data['temperature'],
                'max_tokens': agent_data['max_tokens'],
                'system_prompt': agent_data['system_prompt'],
                'is_active': agent_data['is_active'],
            }
        )
        
        if created:
            print(f"✓ Agente criado: {agent.name} ({agent.model_name})")
            created_count += 1
        else:
            print(f"→ Agente já existe: {agent.name}")
    
    print(f"\n✓ {created_count} novos agentes foram criados!")
    print(f"✓ Total de agentes ativos: {AIAgentConfig.objects.filter(is_active=True).count()}")

if __name__ == '__main__':
    create_default_agents()
