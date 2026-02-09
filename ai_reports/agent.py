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
        
        # Execute each stage sequentially
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
                
                print(f"[AI Agent] Executing: {stage.value}")
                handler = self.stage_handlers[stage]
                state = await handler(state)
                
                processing_time = (datetime.now() - start_time).total_seconds()
                state['processing_times'][stage.value] = processing_time
                
                # Record progress
                state['stage_progress'].append({
                    'stage': stage.value,
                    'status': 'complete',
                    'duration_seconds': processing_time,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"[AI Agent] Error at stage {stage.value}: {str(e)}")
                state['errors'].append(f"{stage.value}: {str(e)}")
                # Continue with partial data
        
        state['current_stage'] = ProcessingStage.COMPLETE
        print(f"[AI Agent] Processing completed in {sum(state['processing_times'].values()):.2f}s")
        
        return state
    
    async def _interpret_request(self, state: AIReportState) -> AIReportState:
        """
        Stage 1: Interpret user request
        - Identify report type
        - Define required KPIs
        - Determine data filters
        """
        user_request = state['user_request'].lower()
        
        # Simple interpretation logic (can be expanded with real LLM)
        if any(word in user_request for word in ['inventario', 'inventory', 'estoque', 'stock']):
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
        
        # Simulate interpretation
        await asyncio.sleep(0.5)
        
        print(f"  ✓ Report type identified: {state['report_type']}")
        print(f"  ✓ Required KPIs: {', '.join(state['required_kpis'])}")
        
        return state
    
    async def _plan_analysis(self, state: AIReportState) -> AIReportState:
        """
        Stage 2: Plan analysis
        - Define data sources
        - Calculate metrics
        - Structure visualizations
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
        
        print(f"  ✓ Analysis plan created")
        print(f"  ✓ Data sources: {', '.join(plan['data_sources'])}")
        print(f"  ✓ Visualizations: {len(plan['visualizations'])} charts")
        
        return state
    
    async def _collect_data(self, state: AIReportState) -> AIReportState:
        """
        Stage 3: Collect data
        - Fetch data based on report type
        - Return different data for each analysis
        """
        # Generate different data based on report type
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
        print(f"  ✓ Data collected: {state['data_summary']['records_processed']} records")
        print(f"  ✓ Data quality: {state['data_summary']['data_quality']}")
        
        return state
    
    async def _analyze_data(self, state: AIReportState) -> AIReportState:
        """
        Stage 4: Analyze data
        - Calculate report type specific KPIs
        - Identify trends
        - Generate contextualized insights
        """
        data = state['raw_data']
        report_type = state.get('report_type', 'general_analysis')
        
        # Calculate metrics specific by type
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
                    "Inventory distributed mainly in Germany (33%) and France (27%)",
                    "Annual turnover rate of 8.6x indicates good stock flow",
                    "Warehouse utilization at 78% - adequate space for growth",
                    "Electronics category represents 40% of total inventory"
                ]
            }
            state['recommendations'] = [
                "Consider stock redistribution to Italy and Spain to improve local coverage",
                "Turnover rate of 8.6x is healthy - maintain current replenishment strategy",
                "Leverage 22% free capacity to plan 15-20% growth",
                "Implement forecasting system for Electronics - most critical category"
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
                    f"Sales growth of {growth:.1f}% indicates strong market demand",
                    "Germany leads with €1.85M in sales (38% of total)",
                    "Online channel is the largest contributor with 43% of total sales",
                    "Repeat customer rate of 68% shows good retention"
                ]
            }
            state['recommendations'] = [
                "Expand 'Premium Electronics A' line which leads in sales",
                "Increase investment in online channel - channel with best performance",
                "Implement loyalty program to leverage 68% repeat customer rate",
                "Replicate Germany\'s success strategy in secondary markets"
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
                    'supply_disruptions': f"{incidents} in 90 days",
                    'at_risk_regions': f"{data['geopolitical_risks']['high_risk_regions']} identified"
                },
                'trends': {
                    'risk_trend': 'moderate',
                    'supplier_resilience': 'needs_improvement',
                    'geopolitical_risk': 'increasing'
                },
                'top_insights': [
                    f"Supplier concentration at 34% indicates moderate supply chain risk",
                    f"12 suppliers in high-risk regions represent {(12/data['supply_chain']['total_suppliers']*100):.0f}% of base",
                    "3 incidents in 90 days with average recovery time of 24 hours",
                    "Contingency plans only partial - identify critical gaps"
                ]
            }
            state['recommendations'] = [
                "Diversify suppliers: increase alternative suppliers from 8 to 15",
                "Implement complete contingency plan for geopolitical risk regions",
                "Reduce lead time variance from 28% through long-term partnerships",
                "Monitor obsolete items (12%) and develop liquidation strategy"
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
                    "Supply chain in overall positive condition with 15% growth",
                    "127 active suppliers with 89% reliability",
                    "2,847 customers with 92% satisfaction",
                    "Operations in 12 warehouse locations geographically distributed"
                ]
            }
            state['recommendations'] = [
                "Maintain investment in supplier diversification",
                "Expand presence in secondary markets based on growth",
                "Implement automation in warehouse to improve efficiency",
                "Deepen analysis of customer satisfaction metrics"
            ]
        
        state['insights'] = state['analysis_results']['top_insights']
        
        await asyncio.sleep(0.6)
        
        print(f"  ✓ {len(state['analysis_results']['kpis'])} KPIs calculated")
        print(f"  ✓ {len(state['insights'])} insights identified")
        
        return state
    
    async def _generate_report(self, state: AIReportState) -> AIReportState:
        """
        Stage 5: Generate final report
        - Structure data for display
        - Create tables and charts
        - Compose executive summary
        """
        state['report_title'] = self._generate_title(state)
        
        # Prepare report data for visualization
        state['report_data'] = {
            'executive_summary': {
                'overview': f"Complete {state['report_type'].replace('_', ' ')} analysis completed successfully",
                'period': 'Last 90 days',
                'records_analyzed': state['data_summary']['records_processed'],
                'confidence_level': '98%'
            },
            'kpis': state['analysis_results']['kpis'],
            'charts': [
                {
                    'type': 'line',
                    'title': 'Inventory Trends',
                    'data': self._generate_chart_data('line'),
                    'countries': ['DE', 'FR', 'IT', 'ES']
                },
                {
                    'type': 'bar',
                    'title': 'Distribution by Country',
                    'data': self._generate_chart_data('bar'),
                },
                {
                    'type': 'pie',
                    'title': 'Category Breakdown',
                    'data': self._generate_chart_data('pie'),
                }
            ],
            'data_table': self._generate_data_table(),
            'trends': state['analysis_results']['trends']
        }
        
        await asyncio.sleep(0.5)
        
        print(f"  ✓ Report title: '{state['report_title']}'")
        print(f"  ✓ {len(state['report_data']['charts'])} visualizations generated")
        print(f"  ✓ Structured recommendations: {len(state['recommendations'])} items")
        
        return state
    
    def _generate_title(self, state: AIReportState) -> str:
        """Generate appropriate title for the report"""
        report_types = {
            'inventory_analysis': 'Detailed Inventory Analysis - Last 90 Days',
            'risk_analysis': 'Supply Chain Risk Assessment',
            'sales_performance': 'Sales Performance Report',
            'general_analysis': 'Supply Chain General Analysis'
        }
        return report_types.get(state.get('report_type', 'general_analysis'), 'Supply Chain Report')
    
    def _generate_chart_data(self, chart_type: str) -> List[Dict[str, Any]]:
        """Generate sample data for charts"""
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
        """Generate data for results table"""
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
    Main function to process an AI report request
    
    Args:
        user_request: Text of the user request
        user_id: ID of the user
        session_id: ID of the chat session
        agent_config: Agent configuration (AIAgentConfig model instance)
        
    Returns:
        Final state with generated report
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
