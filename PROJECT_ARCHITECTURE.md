# 🏗️ Supply Unlimited - Arquitetura Completa do Projeto

## 📊 O que é Supply Unlimited?

**Supply Unlimited** é uma plataforma Django de **gestão de supply chain** com:

```
┌─────────────────────────────────────────────┐
│        SUPPLY UNLIMITED DASHBOARD            │
├─────────────────────────────────────────────┤
│                                             │
│  1️⃣ Dashboard → Métricas de negócio        │
│  2️⃣ Companies → Gestão de empresas/lojas   │
│  3️⃣ Inventory → Controle de estoque        │
│  4️⃣ Analytics → Relatórios de vendas       │
│  5️⃣ AI Reports ← NOVO! Análises com IA     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🗄️ Estrutura de Dados (Models)

### **Usuários & Autenticação**
```
User (Django built-in)
├── Company (múltiplas empresas)
│   ├── Store (lojas físicas)
│   │   └── Warehouse (armazéns)
│   │       └── WarehouseLocation (localização específica)
│   └── Subsidiary (filiais)
```

### **Produtos & Estoque**
```
Product (SKU, nome, preço)
├── Category (categorias)
├── InventoryLevel (quantidade por warehouse)
└── InventoryMovement (rastreamento histórico)
```

### **Vendas**
```
Order (pedidos)
├── OrderLine (itens do pedido)
├── Delivery (entregas)
└── Sales Analytics (análises)
```

### **AI Reports** (NOVO)
```
ChatSession (conversa do usuário)
├── ChatMessage (mensagens individuais)
│   └── message_type: 'user' | 'ai'
├── GeneratedReport (relatório gerado)
│   └── report_data: { kpis, charts, tables, insights }
└── AIAgentConfig (configuração do agente)
```

---

## 🔄 Fluxo de Dados - AI Reports

### **Antes: Sem IA**
```
User → Click "Analytics" → Hardcoded Dashboard
```

### **Depois: Com LangChain + LangGraph**
```
┌──────────────────────────────────────────────────────┐
│  Frontend (aba AI Reports - já pronto!)              │
│  ┌────────────────────────────────────────┐          │
│  │ Usuário digita: "Analyze inventory"    │          │
│  │ [Send] ──→ /api/ai-reports/messages/  │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  Backend: Django ViewSet (views.py)                  │
│  ┌────────────────────────────────────────┐          │
│  │ POST /messages/send/                   │          │
│  │ - Save mensagem do usuário (ChatMessage)│         │
│  │ - Call: process_ai_request()           │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  LangChain + LangGraph Agent (agent.py)              │
│  ┌────────────────────────────────────────┐          │
│  │ Stage 1: INTERPRETING                  │          │
│  │   ↓ LLM entende: "análise de estoque"  │          │
│  │   ↓ Identifica: inventory_kpis         │          │
│  │                                        │          │
│  │ Stage 2: PLANNING                      │          │
│  │   ↓ Detecta: quais dados precisa       │          │
│  │   ↓ Monta: estratégia de ETL           │          │
│  │                                        │          │
│  │ Stage 3: DATA_COLLECTION               │          │
│  │   ↓ Query Django ORM:                  │          │
│  │   ↓   - InventoryLevel.objects...      │          │
│  │   ↓   - WarehouseLocation.objects...   │          │
│  │   ↓   - InventoryMovement.objects...   │          │
│  │                                        │          │
│  │ Stage 4: ANALYSIS                      │          │
│  │   ↓ Pandas: agregações, cálculos       │          │
│  │   ↓ Detecta: padrões, anomalias        │          │
│  │                                        │          │
│  │ Stage 5: GENERATING                    │          │
│  │   ↓ LLM gera insights em natural       │          │
│  │   ↓ Retorna:                           │          │
│  │      { title, kpis, charts, insights } │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  Database: Save GeneratedReport                      │
│  ┌────────────────────────────────────────┐          │
│  │ GeneratedReport(                       │          │
│  │   session_id=...,                      │          │
│  │   title="Inventory Analysis Report",   │          │
│  │   report_data={...},                   │          │
│  │   insights=[...]                       │          │
│  │ ).save()                               │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  Response back to Frontend                          │
│  ┌────────────────────────────────────────┐          │
│  │ {                                      │          │
│  │   "report_data": {                     │          │
│  │     "title": "...",                    │          │
│  │     "kpis": { "Total SKUs": 1234 },   │          │
│  │     "tables": [...],                   │          │
│  │     "charts": [...]                    │          │
│  │   }                                    │          │
│  │ }                                      │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  Frontend: Renderiza Report                         │
│  ┌────────────────────────────────────────┐          │
│  │ Mostra KPIs, gráficos, tabelas         │          │
│  │ (já tem HTML/CSS/JS pronto!)           │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
```

---

## 🧠 LangGraph Agent - Stages Detalhados

### **Stage 1: INTERPRETING**
```python
def interpret_request(state: AIReportState) -> AIReportState:
    """
    Input: "Analyze inventory turnover by country"
    
    LLM chama:
    - Entende a intenção (inventory_analysis)
    - Identifica KPIs necessários:
      * inventory_turnover
      * days_inventory_outstanding
      * stockout_frequency
    - Detecta filtros:
      * group_by: country
      * period: 90 days
    
    Output: 
    {
      "report_type": "inventory",
      "required_kpis": ["inventory_turnover", "dio", "stockout"],
      "data_filters": { "group_by": "country", "period": 90 }
    }
    """
```

### **Stage 2: PLANNING**
```python
def plan_analysis(state: AIReportState) -> AIReportState:
    """
    Input: KPIs necessários + filtros
    
    LLM decide:
    - Quais tabelas do DB acessar
    - Qual transformação fazer
    - Qual agregação usar
    
    Output:
    {
      "execution_plan": [
        "SELECT * FROM inventory WHERE ...",
        "GROUP BY country",
        "CALCULATE: days_inventory_outstanding",
        "DETECT: anomalies"
      ]
    }
    """
```

### **Stage 3: DATA_COLLECTION**
```python
def collect_data(state: AIReportState) -> AIReportState:
    """
    Input: Plano de execução
    
    Python executa:
    ```python
    from users.models import WarehouseLocation, InventoryLevel
    from ai_reports.models import InventoryMovement
    
    data = {
        'inventory_levels': InventoryLevel.objects.filter(...).values(),
        'movements': InventoryMovement.objects.filter(...).values(),
        'locations': WarehouseLocation.objects.filter(...).values(),
    }
    ```
    
    Output:
    {
      "raw_data": { ... },
      "data_summary": { "total_rows": 5000, ... }
    }
    """
```

### **Stage 4: ANALYSIS**
```python
def analyze_data(state: AIReportState) -> AIReportState:
    """
    Input: Raw data
    
    Python/Pandas executa:
    ```python
    import pandas as pd
    
    df = pd.DataFrame(state['raw_data'])
    analysis = {
        'inventory_turnover': df.groupby('country')['turnover'].mean(),
        'top_slow_movers': df.nlargest(10, 'days_held'),
        'anomalies': detect_outliers(df),
    }
    ```
    
    Output:
    {
      "analysis_results": { ... },
      "insights": ["SKUs slow-moving em Germany", "..."]
    }
    """
```

### **Stage 5: GENERATING**
```python
def generate_report(state: AIReportState) -> AIReportState:
    """
    Input: Análises + insights
    
    LLM formata:
    - Cria títulos e descrições
    - Estrutura as tabelas
    - Gera recomendações
    
    Output:
    {
      "report_title": "Inventory Turnover Analysis by Country",
      "report_data": {
        "kpis": {
          "Germany": { "turnover": 4.2, "dio": 45 },
          "France": { "turnover": 3.8, "dio": 52 }
        },
        "tables": [
          {
            "title": "Top 10 Slow Movers",
            "columns": ["SKU", "Country", "Days Held", "Value"],
            "rows": [...]
          }
        ],
        "charts": [
          {
            "type": "bar",
            "title": "Turnover by Country",
            "data": {...}
          }
        ]
      },
      "recommendations": [
        "Implementar ABC analysis",
        "Revisar lead times",
        "..."
      ]
    }
    """
```

---

## 📂 Estrutura de Arquivos Atuais

```
supply_unlimited/
├── ai_reports/                      ← NOVO APP
│   ├── models.py                    ✅ Pronto
│   │   ├── ChatSession
│   │   ├── ChatMessage
│   │   ├── GeneratedReport
│   │   └── AIAgentConfig
│   │
│   ├── views.py                     ⏳ Parcial
│   │   ├── ChatSessionViewSet
│   │   ├── ChatMessageViewSet
│   │   └── GeneratedReportViewSet
│   │
│   ├── agent.py                     ⏳ Estrutura
│   │   └── Precisa: LangChain/LangGraph
│   │
│   ├── serializers.py               ✅ Pronto
│   ├── urls.py                      ⏳ Falta configurar
│   └── tests.py
│
├── users/                           ✅ Existente
│   ├── models.py
│   │   ├── Company
│   │   ├── Store
│   │   ├── Product
│   │   ├── Warehouse
│   │   ├── InventoryLevel
│   │   ├── InventoryMovement
│   │   └── ...
│   └── ...
│
├── supply_unlimited/
│   ├── settings.py                  (Django config)
│   ├── urls.py                      (Rotas principais)
│   └── ...
│
├── templates/
│   └── dashboard.html               ✅ Novo layout AI Reports
│
├── static/
│   ├── css/
│   │   └── ai-reports.css          ✅ Novo: 800+ linhas
│   ├── js/
│   │   └── ai-reports-new.js       ✅ Novo: 544 linhas
│   └── ...
│
└── requirements.txt                 ⏳ Precisa: langchain, langgraph
```

---

## 🔌 O que Precisa Ser Feito

### **1. Instalar Dependências (requirements.txt)**
```
langchain==0.1.x
langgraph==0.x.x
langchain-openai==0.0.x  # ou outro provider
pandas==2.2.3  # (já tem)
```

### **2. Completar agent.py**
```python
# Implementar funções para cada stage:
- interpret_request()
- plan_analysis()
- collect_data()
- analyze_data()
- generate_report()

# Usar LangGraph para orquestrar
graph = StateGraph(AIReportState)
graph.add_node("interpreting", interpret_request)
graph.add_node("planning", plan_analysis)
# ...
```

### **3. Completar views.py**
```python
# Implementar:
class ChatMessageViewSet:
    @action(detail=False, methods=['post'], url_path='send')
    def send_message(self, request):
        # Chamar agent.py
        # Salvar report_data
        # Retornar ao frontend
```

### **4. Configurar URLs**
```python
# ai_reports/urls.py
urlpatterns = [
    path('chat-sessions/', ChatSessionViewSet.as_view(...)),
    path('messages/', ChatMessageViewSet.as_view(...)),
    path('messages/send/', ChatMessageViewSet.send()),
    # ...
]
```

### **5. Frontend (já está pronto!)**
```
✅ static/js/ai-reports-new.js
   - Função: handleSendMessage()
   - Chama: POST /api/ai-reports/messages/send/
   - Renderiza: report_data no preview panel

✅ static/css/ai-reports.css
   - Layout 3-coluna
   - Responsivo
   
✅ templates/dashboard.html
   - Seção AI Reports pronta
```

---

## 📋 Fluxo de Desenvolvimento Recomendado

### **Passo 1: Estrutura Básica do Agent (2-3 horas)**
```python
# agent.py - Versão 1
def process_ai_request(prompt: str, session_id: int) -> dict:
    """
    Versão 1: Sem LangChain ainda
    Apenas estrutura + dados de exemplo
    """
    return {
        "title": "Test Report",
        "kpis": {"Total SKUs": 1234},
        "tables": [],
        "charts": [],
        "insights": ["Insight 1"]
    }
```

### **Passo 2: ViewSets (1 hora)**
```python
# views.py
def send_message():
    # 1. Salvar mensagem do usuário
    # 2. Chamar agent.process_ai_request()
    # 3. Salvar GeneratedReport
    # 4. Retornar ao frontend
```

### **Passo 3: Integrar LangChain (3-4 horas)**
```python
# agent.py - Com LangChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4")
# Implementar stages...
```

### **Passo 4: LangGraph Orchestration (2-3 horas)**
```python
# agent.py - Com LangGraph
from langgraph.graph import StateGraph

graph = StateGraph(AIReportState)
# Add nodes, edges...
app = graph.compile()
```

### **Passo 5: Testes & Refinamento (2-3 horas)**
```python
# Testar cada stage
# Validar dados
# Otimizar prompts
```

---

## 🎯 O Resultado Final

Quando terminar, o usuário conseguirá:

```
1️⃣ Ir para aba "AI Reports"
2️⃣ Digitar: "Show top 10 products by revenue"
3️⃣ Clicar Send
4️⃣ Ver relatório gerado automaticamente com:
   - Título auto-gerado
   - KPIs calculados
   - Gráficos
   - Tabelas
   - Insights em linguagem natural
   - Recomendações
5️⃣ Histórico de conversas salvo
6️⃣ Possibilidade de exportar como PDF/Excel
```

---

## 📞 Resumo Técnico

| Componente | Status | Tech Stack |
|-----------|--------|-----------|
| **Frontend** | ✅ 100% | HTML/CSS/JS |
| **Database Models** | ✅ 100% | Django ORM |
| **API Endpoints** | ⏳ 70% | Django REST |
| **AI Agent** | ⏳ 0% | LangChain + LangGraph |
| **LLM Integration** | ⏳ 0% | OpenAI / Local LLM |
| **Data Collection** | ⏳ 0% | Pandas + Django ORM |
| **Report Generation** | ⏳ 0% | Jinja2 Templates |

---

## 🚀 Próximo Passo?

Quer que eu comece a implementar:

1. **Estrutura básica do agent.py** (sem LangChain ainda)
2. **ViewSets em views.py** (ligação frontend-backend)
3. **URLs configuration** (rotas)
4. **Primeiro teste end-to-end** (com dados fictícios)

Então progressivamente adicionamos LangChain + LangGraph?

---

**Está claro o projeto?** 🎯

