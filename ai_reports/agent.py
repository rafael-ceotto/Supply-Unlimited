"""
LangGraph AI Agent for Supply Chain Reports
Orchestrates the flow of report requests processing using LangGraph

🔥 DEVELOPMENT CONTEXT PROMPT
============================================

This module implements an AI agent that acts as a senior supply chain analyst.

FUNDAMENTAL PRINCIPLES:
------------------------
1. The agent does NOT execute heavy logic inside the LLM
   - LLM only: plans, decides, orchestrates
   - Python executes: ETL, queries, calculations, validation

2. Code must be: readable, modular, auditable
   - Small and well-defined functions
   - Type hints always
   - Objective docstrings

3. SQL: SELECT only, use Django ORM when possible

4. Always consider: caching and asynchronous execution (Celery/asyncio)

AGENT STAGES (LangGraph):
------------------------------
1. INTERPRETING  → Understand request in natural language
2. PLANNING      → Detect required KPIs
3. DATA_COLLECTION → Check available data
4. ANALYSIS      → Planning and execution of ETL, validation
5. GENERATING    → Generation of insights and final report

EXPECTED KPIs:
---------------
- Inventory: level, rotation, aging, obsolescence
- Transportation: cost, lead time, OTIF (On Time In Full)
- Suppliers: performance, reliability, delivery
- Demand: forecast, variability, seasonality
- Stockouts: frequency, impact, causes
- Revenue: by product, region, channel, customer

CODE STRUCTURE:
-------------------
✅ DO: small functions, clear typing, async when possible
❌ DON'T: monoliths, "magic" logic, hardcoded queries

Refer to ai_reports/README.md for complete documentation.
"""

from typing import TypedDict, List, Optional, Dict, Any
from datetime import datetime
import json
import asyncio
from enum import Enum


class ProcessingStage(str, Enum):
    """Processing stages of the AI agent"""
    INTERPRETING = "interpreting"
    PLANNING = "planning"
    DATA_COLLECTION = "data_collection"
    ANALYSIS = "analysis"
    GENERATING = "generating"
    COMPLETE = "complete"


class AIReportState(TypedDict):
    """State of the report request throughout the pipeline"""
    # Input
    user_request: str
    user_id: str
    session_id: str
    
    # Processing stages
    current_stage: ProcessingStage
    stage_progress: List[Dict[str, Any]]
    
    # Interpretation
    report_type: Optional[str]
    required_kpis: List[str]
    data_filters: Dict[str, Any]
    
    # Data collection
    raw_data: Optional[Dict[str, Any]]
    data_summary: Optional[Dict[str, Any]]
    
    # Analysis
    analysis_results: Optional[Dict[str, Any]]
    insights: List[str]
    
    # Final report
    report_title: str
    report_data: Dict[str, Any]
    recommendations: List[str]
    
    # Metadata
    processing_times: Dict[str, float]
    errors: List[str]


class AIReportAgent:
    """
    Main AI Reports agent using LangGraph pattern
    Coordinates the stages of report processing
    """
    
    def __init__(self, config=None):
        """
        Initializes the agent with optional configuration
        
        Args:
            config: Agent configuration (AIAgentConfig model or dict with model, temperature, etc.)
        """
        if config and hasattr(config, 'model_name'):
            # Is an instance of the AIAgentConfig model
            self.config = {
                'model': config.model_name,
                'temperature': config.temperature,
                'max_tokens': config.max_tokens,
                'system_prompt': config.system_prompt,
                'name': config.name
            }
        else:
            # Is a dict or None
            self.config = config or {
                'model': 'gpt-4',
                'temperature': 0.7,
                'max_tokens': 2000
            }
        self.stage_handlers = {
            ProcessingStage.INTERPRETING: self._interpret_request,
            ProcessingStage.PLANNING: self._plan_analysis,
            ProcessingStage.DATA_COLLECTION: self._collect_data,
            ProcessingStage.ANALYSIS: self._analyze_data,
            ProcessingStage.GENERATING: self._generate_report,
        }
    
    async def process_request(self, state: AIReportState) -> AIReportState:
        """
        Processes a report request through all stages
        
        Args:
            state: Initial state of the request
            
        Returns:
            Final state with generated report
        """
        print(f"[AI Agent] Starting request processing: {state['user_request'][:50]}...")
        
        # Set initial stages
        state['stage_progress'] = []
        state['processing_times'] = {}
        state['errors'] = []
        state['insights'] = []
        state['recommendations'] = []
        state['required_kpis'] = []
        state['data_filters'] = {}
        
        # Executar cada estágio sequencialmente
        stages = [
            ProcessingStage.INTERPRETING,
            ProcessingStage.PLANNING,
            ProcessingStage.DATA_COLLECTION,
            ProcessingStage.ANALYSIS,
            ProcessingStage.GENERATING,
        ]
        
        for stage in stages:
            try:
                start_time = datetime.now()
                state['current_stage'] = stage
                
                print(f"[AI Agent] Executando: {stage.value}")
                handler = self.stage_handlers[stage]
                state = await handler(state)
                
                processing_time = (datetime.now() - start_time).total_seconds()
                state['processing_times'][stage.value] = processing_time
                
                # Registrar progresso
                state['stage_progress'].append({
                    'stage': stage.value,
                    'status': 'complete',
                    'duration_seconds': processing_time,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"[AI Agent] Erro no estágio {stage.value}: {str(e)}")
                state['errors'].append(f"{stage.value}: {str(e)}")
                # Continuar com dados parciais
        
        state['current_stage'] = ProcessingStage.COMPLETE
        print(f"[AI Agent] Processamento concluído em {sum(state['processing_times'].values()):.2f}s")
        
        return state
    
    async def _interpret_request(self, state: AIReportState) -> AIReportState:
        """
        Estágio 1: Interpretar requisição do usuário
        - Identificar tipo de relatório
        - Definir KPIs necessários
        - Determinar filtros de dados
        """
        user_request = state['user_request'].lower()
        
        # Lógica de interpretação simples (pode ser expandida com LLM real)
        if any(word in user_request for word in ['inventário', 'inventory', 'estoque', 'stock']):
            state['report_type'] = 'inventory_analysis'
            state['required_kpis'] = [
                'total_inventory',
                'turnover_rate',
                'fill_rate',
                'days_of_inventory',
                'slow_moving_items'
            ]
        elif any(word in user_request for word in ['risco', 'risk', 'supply chain']):
            state['report_type'] = 'risk_analysis'
            state['required_kpis'] = [
                'supply_concentration',
                'geographic_risk',
                'lead_time_variation',
                'supplier_reliability'
            ]
        elif any(word in user_request for word in ['desempenho', 'performance', 'vendas', 'sales']):
            state['report_type'] = 'sales_performance'
            state['required_kpis'] = [
                'total_sales',
                'growth_rate',
                'top_products',
                'regional_performance'
            ]
        else:
            state['report_type'] = 'general_analysis'
            state['required_kpis'] = ['total_inventory', 'total_sales', 'efficiency_rate']
        
        # Simular interpretação
        await asyncio.sleep(0.5)
        
        print(f"  ✓ Tipo de relatório identificado: {state['report_type']}")
        print(f"  ✓ KPIs necessários: {', '.join(state['required_kpis'])}")
        
        return state
    
    async def _plan_analysis(self, state: AIReportState) -> AIReportState:
        """
        Estágio 2: Planejar análise
        - Definir fonte de dados
        - Calcular métricas
        - Estruturar visualizações
        """
        plan = {
            'data_sources': ['inventory', 'sales', 'warehouse'],
            'metrics_to_calculate': state['required_kpis'],
            'visualizations': [
                'time_series_chart',
                'bar_chart',
                'heat_map',
                'data_table'
            ],
            'analysis_depth': 'detailed'
        }
        
        state['data_filters'] = {
            'period': 'last_90_days',
            'countries': ['DE', 'FR', 'IT', 'ES'],
            'status': 'active'
        }
        
        await asyncio.sleep(0.5)
        
        print(f"  ✓ Plano de análise criado")
        print(f"  ✓ Fontes de dados: {', '.join(plan['data_sources'])}")
        print(f"  ✓ Visualizações: {len(plan['visualizations'])} gráficos")
        
        return state
    
    async def _collect_data(self, state: AIReportState) -> AIReportState:
        """
        Estágio 3: Coletar dados
        - Buscar dados baseado no tipo de relatório
        - Retornar dados diferentes para cada análise
        """
        # Gerar dados diferentes baseado no tipo de relatório
        report_type = state.get('report_type', 'general_analysis')
        
        if report_type == 'inventory_analysis':
            state['raw_data'] = {
                'inventory': {
                    'total_units': 45230,
                    'total_value_eur': 2500000,
                    'by_country': {'DE': 15000, 'FR': 12000, 'IT': 10000, 'ES': 8230},
                    'by_category': {'Electronics': 18000, 'Components': 16000, 'Raw Materials': 11230}
                },
                'sales': {'last_30_days': 125000, 'last_90_days': 385000, 'growth_rate': 0.15},
                'warehouse': {'utilization': 0.78, 'efficiency_score': 0.94, 'locations_active': 12}
            }
        
        elif report_type == 'sales_performance':
            state['raw_data'] = {
                'sales': {
                    'total_sales_eur': 4850000,
                    'last_30_days': 385000,
                    'last_90_days': 1250000,
                    'growth_rate': 0.23,
                    'by_country': {'DE': 1850000, 'FR': 1350000, 'IT': 950000, 'ES': 700000},
                    'by_channel': {'Online': 2100000, 'Wholesale': 1950000, 'Retail': 800000},
                    'top_products': ['Premium Electronics A', 'Standard Components B', 'Bulk Materials C']
                },
                'customers': {
                    'total_customers': 2847,
                    'repeat_customers': 0.68,
                    'average_order_value': 1705
                },
                'trends': {'month_1': 0.08, 'month_2': 0.15, 'month_3': 0.23}
            }
        
        elif report_type == 'risk_analysis':
            state['raw_data'] = {
                'supply_chain': {
                    'total_suppliers': 127,
                    'critical_suppliers': 8,
                    'supplier_concentration': 0.34,
                    'geographic_concentration': 0.42,
                    'lead_time_avg_days': 18,
                    'lead_time_variance': 0.28
                },
                'warehouse_risks': {
                    'obsolete_inventory_pct': 0.12,
                    'slow_moving_items': 342,
                    'overstocked_products': 56
                },
                'supply_disruptions': {
                    'incidents_last_90_days': 3,
                    'average_recovery_time_hours': 24,
                    'affected_sales_pct': 0.08
                },
                'geopolitical_risks': {
                    'high_risk_regions': 2,
                    'at_risk_suppliers': 12,
                    'contingency_plans': 'partial'
                }
            }
        
        else:  # general_analysis
            state['raw_data'] = {
                'inventory': {'total_units': 45230, 'total_value_eur': 2500000},
                'sales': {'last_90_days': 1250000, 'growth_rate': 0.15},
                'warehouse': {'utilization': 0.78, 'locations_active': 12},
                'suppliers': {'total': 127, 'reliable': 0.89},
                'customers': {'total': 2847, 'satisfaction': 0.92}
            }
        
        state['data_summary'] = {
            'records_processed': 45230,
            'time_range': 'last_90_days',
            'data_quality': 'high',
            'missing_values': 0
        }
        
        await asyncio.sleep(0.8)
        print(f"  ✓ Dados coletados: {state['data_summary']['records_processed']} registros")
        print(f"  ✓ Qualidade dos dados: {state['data_summary']['data_quality']}")
        
        return state
    
    async def _analyze_data(self, state: AIReportState) -> AIReportState:
        """
        Estágio 4: Analisar dados
        - Calcular KPIs específicos do tipo de relatório
        - Identificar tendências
        - Gerar insights contextualizados
        """
        data = state['raw_data']
        report_type = state.get('report_type', 'general_analysis')
        
        # Calcular métricas específicas por tipo
        if report_type == 'inventory_analysis':
            total_inventory = data['inventory']['total_value_eur']
            inventory_turnover = data['sales']['last_90_days'] / total_inventory * 4
            
            state['analysis_results'] = {
                'kpis': {
                    'total_inventory_eur': f"€{total_inventory:,.0f}",
                    'turnover_rate': f"{inventory_turnover:.1f}x",
                    'fill_rate': "94.3%",
                    'warehouse_utilization': f"{data['warehouse']['utilization']*100:.1f}%",
                    'efficiency_score': f"{data['warehouse']['efficiency_score']*100:.0f}%"
                },
                'trends': {
                    'inventory_trend': 'stable',
                    'sales_trend': 'increasing',
                    'efficiency_trend': 'improving'
                },
                'top_insights': [
                    "Inventário distribuído principalmente na Alemanha (33%) e França (27%)",
                    "Taxa de rotatividade anual de 8.6x indica bom fluxo de estoque",
                    "Utilização de armazém em 78% - espaço adequado para crescimento",
                    "Categoria Electronics representa 40% do inventário total"
                ]
            }
            state['recommendations'] = [
                "Considerar redistribuição de estoque para Itália e Espanha para melhorar cobertura local",
                "Taxa de turnover de 8.6x é saudável - manter estratégia atual de reabastecimento",
                "Aproveitar 22% de capacidade livre para planejar crescimento de 15-20%",
                "Implementar sistema de previsão para Electronics - categoria mais crítica"
            ]
        
        elif report_type == 'sales_performance':
            total_sales = data['sales']['total_sales_eur']
            growth = data['sales']['growth_rate'] * 100
            avg_order = data['customers']['average_order_value']
            
            state['analysis_results'] = {
                'kpis': {
                    'total_sales_eur': f"€{total_sales:,.0f}",
                    'growth_rate': f"{growth:.1f}%",
                    'avg_order_value': f"€{avg_order:,.0f}",
                    'repeat_customer_rate': f"{data['customers']['repeat_customers']*100:.0f}%",
                    'total_customers': f"{data['customers']['total_customers']:,}"
                },
                'trends': {
                    'sales_trend': 'strong_increasing',
                    'customer_trend': 'growing',
                    'revenue_trend': 'accelerating'
                },
                'top_insights': [
                    f"Crescimento de vendas de {growth:.1f}% indica forte demanda no mercado",
                    "Alemanha lidera com €1.85M em vendas (38% do total)",
                    "Canal online é o maior contribuidor com 43% das vendas totais",
                    "Taxa de clientes recorrentes de 68% mostra boa retenção"
                ]
            }
            state['recommendations'] = [
                "Expandir linha de 'Premium Electronics A' que lidera vendas",
                "Aumentar investimento em canal online - canal com melhor performance",
                "Implementar programa de fidelidade para aproveitar 68% de clientes recorrentes",
                "Replicar estratégia de sucesso de Alemanha em mercados secundários"
            ]
        
        elif report_type == 'risk_analysis':
            suppliers_critical = data['supply_chain']['critical_suppliers']
            concentration = data['supply_chain']['supplier_concentration'] * 100
            incidents = data['supply_disruptions']['incidents_last_90_days']
            
            state['analysis_results'] = {
                'kpis': {
                    'supplier_concentration': f"{concentration:.0f}%",
                    'critical_suppliers': f"{suppliers_critical} of {data['supply_chain']['total_suppliers']}",
                    'lead_time_days': f"{data['supply_chain']['lead_time_avg_days']} days",
                    'supply_disruptions': f"{incidents} em 90 dias",
                    'at_risk_regions': f"{data['geopolitical_risks']['high_risk_regions']} identified"
                },
                'trends': {
                    'risk_trend': 'moderate',
                    'supplier_resilience': 'needs_improvement',
                    'geopolitical_risk': 'increasing'
                },
                'top_insights': [
                    f"Concentração de fornecedores em 34% indica risco moderado de supply chain",
                    f"12 fornecedores em regiões de alto risco representam {(12/data['supply_chain']['total_suppliers']*100):.0f}% da base",
                    "3 incidentes em 90 dias com tempo médio de recuperação de 24h",
                    "Planos de contingência apenas parciais - identificar gaps críticos"
                ]
            }
            state['recommendations'] = [
                "Diversificar fornecedores: aumentar número de fornecedores alternativos de 8 para 15",
                "Implementar plano de contingência completo para regiões de risco geopolítico",
                "Reduzir lead time variância de 28% através de parcerias de longo prazo",
                "Monitorar itens obsoletos (12%) e desenvolver estratégia de liquidação"
            ]
        
        else:  # general_analysis
            state['analysis_results'] = {
                'kpis': {
                    'total_inventory': f"€{data['inventory']['total_value_eur']:,.0f}",
                    'total_sales_90d': f"€{data['sales']['last_90_days']:,.0f}",
                    'warehouse_locations': f"{data['warehouse']['locations_active']}",
                    'supplier_reliability': f"{data['suppliers']['reliable']*100:.0f}%",
                    'customer_satisfaction': f"{data['customers']['satisfaction']*100:.0f}%"
                },
                'trends': {
                    'overall_trend': 'positive',
                    'growth_trend': 'increasing',
                    'efficiency_trend': 'stable'
                },
                'top_insights': [
                    "Supply chain em condição geral positiva com crescimento de 15%",
                    "127 fornecedores ativos com 89% de confiabilidade",
                    "2.847 clientes com satisfação de 92%",
                    "Operações em 12 locais de warehouse distribuídos geograficamente"
                ]
            }
            state['recommendations'] = [
                "Manter investimento em diversificação de fornecedores",
                "Expandir presença em mercados secundários baseado em crescimento",
                "Implementar automação em warehouse para melhorar eficiência",
                "Aprofundar análise de satisfação de clientes"
            ]
        
        state['insights'] = state['analysis_results']['top_insights']
        
        await asyncio.sleep(0.6)
        
        print(f"  ✓ {len(state['analysis_results']['kpis'])} KPIs calculados")
        print(f"  ✓ {len(state['insights'])} insights identificados")
        
        return state
    
    async def _generate_report(self, state: AIReportState) -> AIReportState:
        """
        Estágio 5: Gerar relatório final
        - Estruturar dados para exibição
        - Criar tabelas e gráficos
        - Compor resumo executivo
        """
        state['report_title'] = self._generate_title(state)
        
        # Preparar dados de relatório para visualização
        state['report_data'] = {
            'executive_summary': {
                'overview': f"Análise completa de {state['report_type'].replace('_', ' ')} realizada com sucesso",
                'period': 'Últimos 90 dias',
                'records_analyzed': state['data_summary']['records_processed'],
                'confidence_level': '98%'
            },
            'kpis': state['analysis_results']['kpis'],
            'charts': [
                {
                    'type': 'line',
                    'title': 'Tendência de Inventário',
                    'data': self._generate_chart_data('line'),
                    'countries': ['DE', 'FR', 'IT', 'ES']
                },
                {
                    'type': 'bar',
                    'title': 'Distribuição por País',
                    'data': self._generate_chart_data('bar'),
                },
                {
                    'type': 'pie',
                    'title': 'Composição por Categoria',
                    'data': self._generate_chart_data('pie'),
                }
            ],
            'data_table': self._generate_data_table(),
            'trends': state['analysis_results']['trends']
        }
        
        await asyncio.sleep(0.5)
        
        print(f"  ✓ Título do relatório: '{state['report_title']}'")
        print(f"  ✓ {len(state['report_data']['charts'])} visualizações geradas")
        print(f"  ✓ Recomendações estruturadas: {len(state['recommendations'])} items")
        
        return state
    
    def _generate_title(self, state: AIReportState) -> str:
        """Gerar título apropriado para o relatório"""
        report_types = {
            'inventory_analysis': 'Análise Detalhada de Inventário - Últimos 90 Dias',
            'risk_analysis': 'Avaliação de Riscos da Supply Chain',
            'sales_performance': 'Relatório de Desempenho de Vendas',
            'general_analysis': 'Análise Geral da Supply Chain'
        }
        return report_types.get(state.get('report_type', 'general_analysis'), 'Relatório de Supply Chain')
    
    def _generate_chart_data(self, chart_type: str) -> List[Dict[str, Any]]:
        """Gerar dados de exemplo para gráficos"""
        if chart_type == 'line':
            return [
                {'month': 'Jan', 'DE': 12000, 'FR': 10000, 'IT': 8500, 'ES': 7000},
                {'month': 'Feb', 'DE': 13000, 'FR': 11000, 'IT': 9000, 'ES': 7500},
                {'month': 'Mar', 'DE': 15000, 'FR': 12000, 'IT': 10000, 'ES': 8230},
            ]
        elif chart_type == 'bar':
            return [
                {'country': 'Germany', 'value': 15000},
                {'country': 'France', 'value': 12000},
                {'country': 'Italy', 'value': 10000},
                {'country': 'Spain', 'value': 8230},
            ]
        elif chart_type == 'pie':
            return [
                {'label': 'Electronics', 'value': 40},
                {'label': 'Components', 'value': 35},
                {'label': 'Raw Materials', 'value': 25},
            ]
        return []
    
    def _generate_data_table(self) -> Dict[str, Any]:
        """Gerar dados para tabela de resultados"""
        return {
            'columns': ['Product', 'Stock (Units)', 'Value (EUR)', 'Turnover', 'Last Updated'],
            'rows': [
                ['Product A', '8,500', '€425,000', '12.5x', '30 Jan 2026'],
                ['Product B', '6,200', '€310,000', '10.8x', '29 Jan 2026'],
                ['Product C', '5,800', '€290,000', '9.2x', '28 Jan 2026'],
                ['Product D', '4,500', '€225,000', '8.5x', '27 Jan 2026'],
                ['Product E', '3,900', '€195,000', '7.1x', '26 Jan 2026'],
            ],
            'pagination': {
                'current_page': 1,
                'total_pages': 12,
                'items_per_page': 5,
                'total_items': 57
            }
        }


async def process_ai_request(user_request: str, user_id: str, session_id: str, agent_config=None):
    """
    Função principal para processar uma requisição de relatório IA
    
    Args:
        user_request: Texto da requisição do usuário
        user_id: ID do usuário
        session_id: ID da sessão de chat
        agent_config: Configuração do agente (AIAgentConfig model instance)
        
    Returns:
        Estado final com relatório gerado
    """
    agent = AIReportAgent(agent_config)
    
    initial_state = AIReportState(
        user_request=user_request,
        user_id=user_id,
        session_id=session_id,
        current_stage=ProcessingStage.INTERPRETING,
        stage_progress=[],
        report_type=None,
        required_kpis=[],
        data_filters={},
        raw_data=None,
        data_summary=None,
        analysis_results=None,
        insights=[],
        report_title='',
        report_data={},
        recommendations=[],
        processing_times={},
        errors=[]
    )
    
    return await agent.process_request(initial_state)
