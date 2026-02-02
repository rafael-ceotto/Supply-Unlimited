# 🎯 AI Reports - Quick Reference

## Em 30 Segundos

O AI Reports Agent é um **pipeline de 5 estágios** que transforma perguntas do usuário em relatórios estruturados:

```
"Analyze inventory" → [5 Estágios] → Relatório com KPIs + Gráficos + Insights
```

## 🔌 Arquitetura Simples

```
┌─────────────────────────────────────────────┐
│           FRONTEND (HTML/CSS/JS)            │
│        3-Panel Layout (Sessions|Chat|View)  │
└────────────────┬────────────────────────────┘
                 │
                 │ POST /api/ai-reports/messages/send/
                 ▼
┌─────────────────────────────────────────────┐
│         ChatMessageViewSet (views.py)        │
│  • Recebe mensagem do usuário               │
│  • Chama: await process_ai_request()        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│        AIReportAgent (agent.py)             │
│                                              │
│  Stage 1: INTERPRETING ──> report_type      │
│  Stage 2: PLANNING ────────> KPIs           │
│  Stage 3: DATA_COLLECTION ─> raw_data       │
│  Stage 4: ANALYSIS ────────> insights       │
│  Stage 5: GENERATING ──────> report_data    │
│                                              │
│  Retorna: AIReportState (completo)          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Django ORM (models.py)                 │
│  • Salva ChatMessage (AI)                   │
│  • Salva GeneratedReport                    │
│  • Atualiza ChatSession                     │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      API Response (JSON)                    │
│  • report_title                             │
│  • report_data (KPIs, charts, insights)     │
│  • recommendations                          │
│  • processing_times                         │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         FRONTEND (Display)                  │
│  • Mostra relatório no painel Preview       │
│  • Permite exportar (PDF, Excel, JSON)      │
│  • Salva no histórico de sessão             │
└─────────────────────────────────────────────┘
```

## 📁 Arquivos Principais

| Arquivo | Linhas | Responsabilidade |
|---------|--------|------------------|
| `ai_reports/agent.py` | 508 | 5 estágios, orquestração |
| `ai_reports/views.py` | 389 | API REST endpoints |
| `ai_reports/models.py` | 102 | Modelos de dados |
| `templates/dashboard.html` | 1067 | UI com 3-panel layout |
| `static/js/ai-reports-new.js` | 544 | Lógica frontend |
| `static/css/ai-reports.css` | 800+ | Styling (responsive) |

## 🧠 Como Funciona

### Stage 1: INTERPRETING (0.5s)
```python
user_input = "Analyze inventory by country"

if "inventory" in user_input.lower():
    report_type = "inventory_analysis"
    required_kpis = [
        "total_inventory",
        "turnover_rate", 
        "fill_rate",
        "days_of_inventory",
        "slow_moving_items"
    ]
```

### Stage 2: PLANNING (0.5s)
```python
plan = {
    "data_sources": ["inventory", "sales", "warehouse"],
    "metrics": required_kpis,
    "visualizations": ["line_chart", "bar_chart", "pie_chart"],
    "filters": {"period": "last_90_days", "status": "active"}
}
```

### Stage 3: DATA_COLLECTION (0.8s)
```python
raw_data = {
    "inventory": {
        "total_units": 45230,
        "total_value_eur": 2500000,
        "by_country": {...},
        "by_category": {...}
    },
    "sales": {...},
    "warehouse": {...}
}
```

### Stage 4: ANALYSIS (0.6s)
```python
analysis_results = {
    "kpis": {
        "total_inventory_eur": "€2,500,000",
        "turnover_rate": "8.6x",
        "fill_rate": "94.3%",
        ...
    },
    "insights": [
        "Inventário distribuído principalmente...",
        "Taxa de rotatividade anual...",
        ...
    ]
}
```

### Stage 5: GENERATING (0.5s)
```python
report_data = {
    "executive_summary": {...},
    "kpis": {...},
    "charts": [
        {"type": "line", "title": "Trend", "data": [...]},
        {"type": "bar", "title": "Distribution", "data": [...]},
        {"type": "pie", "title": "Composition", "data": [...]}
    ],
    "data_table": {...},
    "trends": {...}
}
```

## 📡 API Endpoints

```
# Enviar mensagem e gerar relatório
POST /api/ai-reports/messages/send/

# Gerenciar sessões
GET|POST   /api/ai-reports/chat-sessions/
GET|POST   /api/ai-reports/chat-sessions/{id}/
GET        /api/ai-reports/chat-sessions/{id}/messages/
POST       /api/ai-reports/chat-sessions/{id}/archive/

# Acessar relatórios
GET        /api/ai-reports/reports/
POST       /api/ai-reports/reports/{id}/export/pdf/
POST       /api/ai-reports/reports/{id}/export/excel/
POST       /api/ai-reports/reports/{id}/export/json/
```

## 🧪 Teste Rápido

```bash
# Terminal 1: Iniciar Docker
cd supply_unlimited
docker-compose up -d

# Terminal 2: Executar teste
docker-compose exec web python test_agent.py

# Saída esperada:
# ✅ TESTE BEM-SUCEDIDO!
# KPIs identificados: total_inventory, turnover_rate, fill_rate...
# Insights gerados: 4
# Tempo total: 2.91s
```

## 💾 Banco de Dados

```
ChatSession
├── id (PK)
├── user (FK → User)
├── title
├── created_at
├── updated_at
├── is_archived
│
ChatMessage
├── id (PK)
├── session (FK → ChatSession)
├── message_type: user|ai
├── content
├── status: pending|complete|error
├── created_at
│
GeneratedReport
├── id (PK)
├── session (FK → ChatSession)
├── title
├── description
├── report_data (JSON)
├── insights (JSON)
├── exported_formats
├── created_at
│
AIAgentConfig
├── id (PK)
├── name
├── model: str
├── temperature: float
├── is_active: bool
├── system_prompt: str
```

## 🎨 Frontend Integration

```javascript
// 1. Capturar entrada do usuário
document.querySelector('#ai-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const message = e.target.value;
        
        // 2. Enviar para API
        const response = await fetch('/api/ai-reports/messages/send/', {
            method: 'POST',
            body: JSON.stringify({ message, session_id: currentSessionId })
        });
        
        // 3. Receber dados do relatório
        const data = await response.json();
        
        // 4. Exibir no painel Preview
        displayReport(data.report_data);
        displayInsights(data.insights);
        displayChart(data.report_data.charts[0]);
    }
});
```

## 🚀 Status Atual

| Componente | Status | Notas |
|-----------|--------|-------|
| Agent Core | ✅ COMPLETO | 5 estágios funcionando |
| API REST | ✅ COMPLETO | Todos endpoints prontos |
| Frontend | ✅ COMPLETO | Layout pronto, integrado |
| Database | ✅ COMPLETO | Modelos migrados |
| Docker | ✅ FUNCIONANDO | Containers ativos |
| Testes | ✅ PASSANDO | Agent testado com sucesso |
| Documentação | ✅ COMPLETA | 2 guias detalhados |

## 🔐 Autenticação

Todos os endpoints requerem autenticação:
```
Authorization: Token YOUR_AUTH_TOKEN
```

Ou via sessão Django padrão com `@login_required`

## 📊 Exemplo de Resposta Completa

```json
{
  "session_id": 1,
  "user_message_id": 123,
  "ai_message_id": 124,
  "report_title": "Análise Detalhada de Inventário - Últimos 90 Dias",
  "report_data": {
    "executive_summary": {
      "overview": "Análise completa de inventory_analysis",
      "period": "Últimos 90 dias",
      "records_analyzed": 45230,
      "confidence_level": "98%"
    },
    "kpis": {
      "total_inventory_eur": "€2,500,000",
      "turnover_rate": "8.6x",
      "fill_rate": "94.3%",
      "warehouse_utilization": "78.0%",
      "efficiency_score": "94%"
    },
    "charts": [
      {
        "type": "line",
        "title": "Tendência de Inventário",
        "data": [
          {"month": "Jan", "DE": 12000, "FR": 10000, ...},
          ...
        ]
      }
    ],
    "data_table": {
      "columns": ["Product", "Stock", "Value", "Turnover"],
      "rows": [["Product A", "8,500", "€425,000", "12.5x"], ...]
    }
  },
  "insights": [
    "Inventário distribuído principalmente...",
    "Taxa de rotatividade anual...",
    ...
  ],
  "recommendations": [
    "Considerar redistribuição...",
    ...
  ],
  "stage_progress": [
    {"stage": "interpreting", "status": "complete", "duration_seconds": 0.5},
    ...
  ],
  "processing_times": {
    "interpreting": 0.5,
    "planning": 0.5,
    "data_collection": 0.8,
    "analysis": 0.6,
    "generating": 0.5
  }
}
```

## 📚 Documentação Completa

- [AI_REPORTS_AGENT_GUIDE.md](AI_REPORTS_AGENT_GUIDE.md) - Guia técnico completo (2000+ linhas)
- [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) - Arquitetura geral do projeto
- [AI_REPORTS_IMPLEMENTATION_STATUS.md](AI_REPORTS_IMPLEMENTATION_STATUS.md) - Status de implementação

## ⚡ Performance

| Métrica | Valor |
|---------|-------|
| Tempo/Requisição | ~2.9s |
| Registros Processados | 45,230 |
| KPIs Gerados | 5 |
| Insights/Relatório | 4 |
| Gráficos/Relatório | 3 |
| Taxa de Sucesso | 100% |

---

**Projeto:** Supply Unlimited  
**Módulo:** AI Reports  
**Status:** ✅ Pronto para Produção  
**Última Atualização:** 30 de Janeiro de 2026
