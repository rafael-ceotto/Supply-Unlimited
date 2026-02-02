# AI Reports Agent - Guia Completo

## 🎯 Visão Geral

O AI Reports Agent é um sistema inteligente de geração de relatórios baseado em **LangChain** e **LangGraph**. Ele processa requisições do usuário em linguagem natural e gera relatórios analíticos estruturados em 5 estágios de processamento.

## 🏗️ Arquitetura

### Estágios de Processamento

```
┌─────────────┐
│ INTERPRETING│  → Entender a requisição e identificar tipo de relatório
└──────┬──────┘
       │
┌──────▼──────┐
│  PLANNING   │  → Definir KPIs necessários e estratégia de análise
└──────┬──────┘
       │
┌──────▼──────────────┐
│ DATA_COLLECTION     │  → Buscar dados do banco e processar
└──────┬──────────────┘
       │
┌──────▼──────┐
│  ANALYSIS   │  → Calcular métricas, identificar insights
└──────┬──────┘
       │
┌──────▼──────┐
│ GENERATING  │  → Estruturar relatório final com visualizações
└──────┬──────┘
       │
┌──────▼──────┐
│  COMPLETE   │  → Relatório pronto para exibição
└─────────────┘
```

### Componentes

**1. `ai_reports/agent.py` - Motor de Processamento**
- Classe `AIReportAgent`: Orquestra os 5 estágios
- Função `process_ai_request()`: Ponto de entrada assíncrono
- Cada estágio implementado como método `_<stage_name>()`

**2. `ai_reports/views.py` - API REST**
- `ChatSessionViewSet`: Gerenciar conversas
- `ChatMessageViewSet`: Enviar mensagens (`/api/ai-reports/messages/send/`)
- `GeneratedReportViewSet`: Acessar relatórios gerados
- `AIAgentConfigViewSet`: Configurar agente (admin only)

**3. `ai_reports/models.py` - Persistência**
- `ChatSession`: Sessão de chat do usuário
- `ChatMessage`: Mensagens (user/ai)
- `GeneratedReport`: Relatórios gerados (dados + insights)
- `AIAgentConfig`: Configuração do agente (modelo, temperatura, etc)

**4. `ai_reports/urls.py` - Roteamento**
- Mapeamento de endpoints para ViewSets
- Customização de rotas (`send`, `export/pdf`, etc)

## 📡 API Endpoints

### Enviar Mensagem e Gerar Relatório
```
POST /api/ai-reports/messages/send/

Body:
{
    "message": "Analyze inventory by country",
    "session_id": 1
}

Response:
{
    "session_id": 1,
    "user_message_id": 123,
    "ai_message_id": 124,
    "report_title": "Análise Detalhada de Inventário - Últimos 90 Dias",
    "report_data": {
        "executive_summary": {...},
        "kpis": {...},
        "charts": [...],
        "data_table": {...},
        "trends": {...}
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
    "stage_progress": [...],
    "processing_times": {
        "interpreting": 0.50,
        "planning": 0.50,
        ...
    }
}
```

### Criar Nova Sessão
```
POST /api/ai-reports/chat-sessions/

Body:
{
    "title": "Análise de Q1"
}

Response:
{
    "id": 1,
    "title": "Análise de Q1",
    "user": 1,
    "created_at": "2026-01-30T15:00:00Z",
    "updated_at": "2026-01-30T15:00:00Z",
    "is_archived": false
}
```

### Listar Sessões
```
GET /api/ai-reports/chat-sessions/

Response:
[
    {
        "id": 1,
        "title": "Análise de Q1",
        "created_at": "2026-01-30T15:00:00Z",
        "message_count": 5
    },
    ...
]
```

### Obter Mensagens da Sessão
```
GET /api/ai-reports/chat-sessions/{id}/messages/

Response:
[
    {
        "id": 123,
        "session": 1,
        "message_type": "user",
        "content": "Analyze inventory",
        "created_at": "2026-01-30T15:05:00Z"
    },
    {
        "id": 124,
        "session": 1,
        "message_type": "ai",
        "content": "Análise Detalhada de Inventário...",
        "status": "complete"
    }
]
```

### Exportar Relatório
```
POST /api/ai-reports/reports/{id}/export/pdf/
POST /api/ai-reports/reports/{id}/export/excel/
POST /api/ai-reports/reports/{id}/export/json/

Response: Arquivo baixado
```

## 🔄 Fluxo de Execução Completo

### Frontend → Backend
```javascript
// 1. Frontend envia mensagem
fetch('/api/ai-reports/messages/send/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({
        message: 'Analyze inventory by country',
        session_id: 1
    })
})
```

### Backend - ViewSet
```python
# 2. ChatMessageViewSet.send_message() recebe requisição
# 3. Cria ChatMessage com tipo 'user'
# 4. Chama agent.process_ai_request()
```

### Agent - 5 Estágios
```python
# 5. INTERPRETING: Detecta "inventory_analysis"
# 6. PLANNING: Define KPIs = [total_inventory, turnover_rate, ...]
# 7. DATA_COLLECTION: Busca dados (mock data ou queries reais)
# 8. ANALYSIS: Calcula métricas e identifica insights
# 9. GENERATING: Estrutura relatório com gráficos
```

### Backend - Persistência
```python
# 10. Cria ChatMessage com tipo 'ai'
# 11. Cria GeneratedReport com dados estruturados
# 12. Retorna response à API
```

### Frontend - Exibição
```javascript
// 13. Frontend recebe response
// 14. Exibe relatório no painel preview
// 15. Mostra insights e recomendações
// 16. Permite exportar (PDF, Excel, JSON)
```

## 🧠 Tipos de Relatórios Detectados

O agent identifica automaticamente o tipo baseado em palavras-chave:

| Tipo | Palavras-chave | KPIs |
|------|---|---|
| **inventory_analysis** | inventário, inventory, estoque, stock | total_inventory, turnover_rate, fill_rate, days_of_inventory, slow_moving_items |
| **risk_analysis** | risco, risk, supply chain | supply_concentration, geographic_risk, lead_time_variation, supplier_reliability |
| **sales_performance** | desempenho, performance, vendas, sales | total_sales, growth_rate, top_products, regional_performance |
| **general_analysis** | (padrão) | total_inventory, total_sales, efficiency_rate |

## 📊 Estrutura de Dados do Relatório

```javascript
report_data = {
    "executive_summary": {
        "overview": "string",
        "period": "string",
        "records_analyzed": number,
        "confidence_level": "string"
    },
    "kpis": {
        "metric_name": "value",
        ...
    },
    "charts": [
        {
            "type": "line|bar|pie",
            "title": "string",
            "data": [...],
            "countries": ["string", ...]
        }
    ],
    "data_table": {
        "columns": ["Col1", "Col2", ...],
        "rows": [["val1", "val2", ...], ...],
        "pagination": {
            "current_page": number,
            "total_pages": number,
            "items_per_page": number,
            "total_items": number
        }
    },
    "trends": {
        "metric_name": "trend_direction",
        ...
    }
}
```

## 🚀 Teste Rápido

### Via Django Shell
```bash
docker-compose exec web python test_agent.py
```

### Via cURL
```bash
curl -X POST http://localhost:8000/api/ai-reports/messages/send/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Analyze inventory levels",
    "session_id": 1
  }'
```

## ⚙️ Configuração

### Variáveis de Ambiente
```env
# .env (criar na raiz do projeto)
OPENAI_API_KEY=sk-...  # Para usar LLM real
AI_AGENT_MODEL=gpt-4
AI_AGENT_TEMPERATURE=0.7
AI_AGENT_MAX_TOKENS=2000
```

### Ativar LLM Real
No futuro, para conectar a um LLM real (OpenAI, Anthropic, etc):

```python
# ai_reports/agent.py
from langchain.chat_models import ChatOpenAI

def __init__(self, config=None):
    self.config = config or {...}
    self.llm = ChatOpenAI(
        model_name=self.config['model'],
        temperature=self.config['temperature']
    )
```

## 🎨 Frontend - Como Usar

### JavaScript
```javascript
// 1. Criar nova sessão
async function createSession() {
    const res = await fetch('/api/ai-reports/chat-sessions/', {
        method: 'POST',
        body: JSON.stringify({title: 'Análise Q1'})
    });
    return res.json();
}

// 2. Enviar mensagem
async function sendMessage(sessionId, message) {
    const res = await fetch('/api/ai-reports/messages/send/', {
        method: 'POST',
        body: JSON.stringify({
            session_id: sessionId,
            message: message
        })
    });
    const data = res.json();
    
    // Exibir no preview
    displayReport(data.report_data);
    displayInsights(data.insights);
    displayRecommendations(data.recommendations);
}

// 3. Exportar
async function exportReport(reportId, format) {
    window.location = `/api/ai-reports/reports/${reportId}/export/${format}/`;
}
```

## 📈 Próximos Passos

1. **Integrar LLM Real** - Conectar OpenAI ou alternative
2. **Queries Dinâmicas** - Substituir mock data por queries reais ao banco
3. **Armazenamento de Histórico** - Manter histórico de análises
4. **Cache Inteligente** - Cachear análises recentes
5. **Agendamento** - Gerar relatórios em horários pré-definidos
6. **Notificações** - Alertar usuários quando relatórios estão prontos

## 🐛 Troubleshooting

### Erro: "Module not found: langchain"
```bash
docker-compose exec web pip install langchain==0.1.9
```

### Erro: "async not awaited"
Certifique-se que a função `send_message` é chamada com `await`:
```python
state = await process_ai_request(...)
```

### Lentidão no Processamento
- Aumentar `data_collection_timeout`
- Usar cache de dados
- Implementar paginação em queries

## 📚 Referências

- [LangChain Docs](https://python.langchain.com)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [Django REST Framework](https://www.django-rest-framework.org)
- [Async Django](https://docs.djangoproject.com/en/6.0/topics/async/)
