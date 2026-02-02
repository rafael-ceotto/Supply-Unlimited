# 🤖 AI Reports - Supply Chain Analytics Agent

## Contexto do Projeto

**Dashboard interno de Supply Chain** para analytics operacional com assistente de IA integrado.

- **Backend**: Django + Python
- **Frontend**: JavaScript (dashboard existente)
- **Orquestração**: LangGraph + LangChain
- **Deployment**: Docker

---

## 🎯 Objetivo da Aba "AI Reports"

Permitir que usuários **conversem com um agente de IA** para criar **relatórios personalizados de supply chain** em linguagem natural.

O agente atua como um **analista sênior de supply chain**, sendo capaz de:

✅ Interpretar pedidos em linguagem natural
✅ Identificar KPIs relevantes (estoque, transporte, fornecedores, lead time, OTIF, rupturas)
✅ Planejar e executar ETL quando necessário
✅ Trabalhar com múltiplas fontes de dados (ERP, WMS, TMS, banco interno, arquivos)
✅ Gerar datasets, métricas, visualizações e insights explicáveis

---

## 🏗️ Arquitetura de IA

### Orquestração por Estados (LangGraph)

O agente é orquestrado através de estados bem definidos:

1. **INTERPRETING** - Entender o pedido em linguagem natural
2. **PLANNING** - Detectar KPIs necessários
3. **DATA_COLLECTION** - Checagem de disponibilidade de dados
4. **ANALYSIS** - Planejamento e execução de ETL, validação de dados
5. **GENERATING** - Geração de insights e relatório final

**Arquivo responsável**: [`agent.py`](agent.py)

### Princípio de Separação de Responsabilidades

⚠️ **Muito importante**: O agente **NÃO executa lógica pesada** dentro do LLM

O LLM apenas:
- 📋 **Planeja** qual análise fazer
- 🎯 **Decide** quais KPIs extrair
- 🔀 **Orquestra** qual função chamar

Enquanto o **código Python executa**:
- 🔧 ETL
- 💾 Queries ao banco
- 📊 Cálculos de métricas
- 🔍 Validação de dados

---

## 📝 Diretrizes de Código

### Estrutura Geral

- ✅ Código **legível, modular e auditável**
- ✅ Evitar lógica "mágica" ou monolítica
- ✅ Favorecer **funções pequenas** com responsabilidade única
- ✅ **Tipagem clara** (type hints sempre)
- ✅ **Docstrings objetivas** (não fazer livros)

### SQL

- 🚫 **Apenas SELECT** - nada de INSERT/UPDATE/DELETE direto
- ✅ Use ORM Django sempre que possível
- 📌 Queries complexas: comentar a lógica

### Async & Caching

- ⚡ Sempre considerar **execução assíncrona** (Celery, asyncio)
- 💾 Implementar **cache** para queries repetidas
- ⏱️ Evitar timeouts em pedidos grandes

---

## 📂 Estrutura de Arquivos

```
ai_reports/
├── agent.py              # LangGraph agent orchestrator
├── models.py             # ChatSession, ChatMessage, GeneratedReport, AIAgentConfig
├── views.py              # Django REST API endpoints
├── serializers.py        # DRF serializers
├── urls.py               # URL routing
├── services/             # (criar se necessário)
│   ├── __init__.py
│   ├── etl_service.py    # Lógica de ETL
│   ├── kpi_service.py    # Cálculo de KPIs
│   └── data_service.py   # Queries e acesso a dados
├── utils/                # (criar se necessário)
│   ├── __init__.py
│   └── validators.py     # Validação de dados
├── tests.py
└── README.md             # Este arquivo
```

---

## 🔄 Fluxo de uma Requisição

```
Usuário faz pergunta
    ↓
ChatMessage.create() (user)
    ↓
process_ai_request() no agent.py
    ↓
INTERPRETING → PLANNING → DATA_COLLECTION → ANALYSIS → GENERATING
    ↓
GeneratedReport.create()
    ↓
ChatMessage.create() (ai)
    ↓
Resposta enviada ao frontend
```

---

## 🛠️ Componentes Principais

### `agent.py` - LangGraph Agent

**Responsável por**:
- Orquestração dos estágios
- Chamada de functions tools
- Erro handling e retry logic
- Async execution

**Padrão**:
```python
class AIReportAgent:
    async def process_request(self, state: AIReportState) -> AIReportState:
        # Executa cada estágio sequencialmente
        # Registra progresso
        # Retorna estado final com relatório
```

### `models.py` - Data Models

```python
ChatSession      # Sessão de conversa
ChatMessage      # Mensagens (user/ai)
GeneratedReport  # Relatórios com dados e insights
AIAgentConfig    # Config do agente (modelo, temp, tokens, prompt)
```

### `views.py` - REST APIs

Endpoints para:
- Criar sessões
- Enviar mensagens (com async processing)
- Recuperar histórico
- Arquivar/limpar sessões
- Exportar relatórios

### `services/` - Lógica de Negócio (criar conforme necessário)

- `etl_service.py` - Transformações de dados
- `kpi_service.py` - Cálculos de KPIs específicos
- `data_service.py` - Queries e acesso a múltiplas fontes

---

## 📊 KPIs Esperados

O agente deve ser capaz de extrair/calcular:

- **Estoque**: Nível, rotação, envelhecimento, obsolescência
- **Transporte**: Custo, lead time, OTIF (On Time In Full)
- **Fornecedores**: Performance, confiabilidade, tempo de entrega
- **Demanda**: Previsão, variabilidade, sazonalidade
- **Rupturas**: Frequência, impacto, causas
- **Receita**: Por produto, região, canal, cliente

---

## 🚀 Desenvolvimento

### Workflow

1. **Criar a função Python** (ex: `calculate_inventory_turnover()`)
2. **Registrar como tool** no LangGraph
3. **Testar isoladamente** com dados reais
4. **Integrar no agente** via estado
5. **Chamar pelo LLM** em linguagem natural
6. **Validar saída** e insights

### Exemplo: Nova KPI

```python
# 1. Função isolada (services/kpi_service.py)
async def calculate_inventory_turnover(
    filters: Dict[str, Any]
) -> Dict[str, float]:
    """Calcula rotação de inventário por categoria."""
    # Query ao banco
    # Cálculo
    # Validação
    return {"category": turnover_rate}

# 2. Registrada no agente
agent.register_tool(
    name="get_inventory_turnover",
    function=calculate_inventory_turnover,
    description="Calcula rotação de inventário"
)

# 3. LLM pode chamar naturalmente
# "Qual a rotação de inventário de eletrônicos?"
```

---

## 🔐 Boas Práticas

### Segurança

- ✅ Usuarios veem apenas seus próprios dados
- ✅ Validar entrada do usuário
- ✅ Usar permissões Django (`IsAuthenticated`)
- ✅ Audit log de requisições sensíveis

### Performance

- ⚡ Cache de queries frequentes
- ⚡ Pagination em resultados grandes
- ⚡ Async processing para relatórios pesados
- ⚡ Timeout em operações longas

### Manutenibilidade

- 📖 Código comentado mas não verboso
- 📖 Funcões com < 30 linhas quando possível
- 📖 Type hints sempre
- 📖 Testes para novos services

---

## 📌 Checklist para Novos Desenvolvimentos

Ao implementar nova feature no AI Reports:

- [ ] Criar função Python isolada em `services/`
- [ ] Adicionar type hints e docstring
- [ ] Testar função localmente
- [ ] Registrar como tool no agent (se necessário)
- [ ] Validar outputs (tipos, valores nulos)
- [ ] Adicionar error handling
- [ ] Implementar cache se aplicável
- [ ] Escrever testes unitários
- [ ] Documentar em README.md (este arquivo)
- [ ] Code review antes de merge

---

## 🔗 Referências Rápidas

- **LangGraph Docs**: https://langchain-ai.github.io/langgraph/
- **Django REST**: https://www.django-rest-framework.org/
- **Async Django**: https://docs.djangoproject.com/en/stable/topics/async/
- **Celery**: https://docs.celeryproject.org/

---

## 💬 Dúvidas ou Contribuições?

Consulte este README antes de iniciar novas features. 

**Mantenha este documento atualizado** conforme a arquitetura evolui.
