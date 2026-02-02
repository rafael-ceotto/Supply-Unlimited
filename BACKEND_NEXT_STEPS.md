# 🎯 AI Reports - Próximos Passos (Backend)

## 📋 Resumo Rápido

**Frontend**: ✅ 100% completo e testável  
**Backend**: ⏳ Pronto para implementação  
**Status**: Layout aparecendo? Teste agora!

---

## 🧪 Teste Agora (Frontend)

### 1. Servidor rodando?
```bash
python manage.py runserver 0.0.0.0:8000
```

### 2. Navegador aberto?
```
http://localhost:8000/dashboard
```

### 3. Clicou em "AI Reports"?
✓ Deve aparecer o layout 3-coluna

### 4. Tipo mensagem?
```
"Show inventory analysis for last 90 days"
```

### 5. Clica Send?
✓ Vai dar erro (backend não pronto) - isso é NORMAL!

---

## ⏳ Backend: O que Implementar

### Fase 1: ViewSets (1-2 horas)

#### Arquivo: `ai_reports/views.py`

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import ChatSession, ChatMessage, GeneratedReport
from .serializers import (
    ChatSessionSerializer,
    ChatMessageSerializer,
    GeneratedReportSerializer
)

# ============================================
# 1. ChatSessionViewSet
# ============================================

class ChatSessionViewSet(viewsets.ModelViewSet):
    """
    API endpoints for chat sessions
    
    GET    /api/ai-reports/chat-sessions/           - List all sessions
    POST   /api/ai-reports/chat-sessions/           - Create new session
    GET    /api/ai-reports/chat-sessions/{id}/      - Get single session
    DELETE /api/ai-reports/chat-sessions/{id}/      - Delete session
    """
    serializer_class = ChatSessionSerializer
    
    def get_queryset(self):
        # Only return sessions for current user
        return ChatSession.objects.filter(
            user=self.request.user
        ).order_by('-updated_at')
    
    def perform_create(self, serializer):
        # Auto-set user when creating
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Clear all sessions for user"""
        ChatSession.objects.filter(user=request.user).delete()
        return Response(
            {'message': 'All sessions cleared'},
            status=status.HTTP_204_NO_CONTENT
        )


# ============================================
# 2. ChatMessageViewSet
# ============================================

class ChatMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoints for chat messages
    
    GET  /api/ai-reports/messages/                  - List all messages
    POST /api/ai-reports/messages/                  - Create message
    POST /api/ai-reports/messages/send/             - Send & process
    """
    serializer_class = ChatMessageSerializer
    
    def get_queryset(self):
        # Filter by session if provided
        session_id = self.request.query_params.get('session_id')
        qs = ChatMessage.objects.all()
        if session_id:
            qs = qs.filter(session_id=session_id)
        return qs.order_by('created_at')
    
    @action(detail=False, methods=['post'])
    def send(self, request):
        """
        Send message and get AI report
        
        Request:
        {
            "session_id": int,
            "text": "User message"
        }
        
        Response:
        {
            "message_id": int,
            "report_data": {
                "title": "Inventory Analysis",
                "kpis": { "SKUs": 1234, "Value": "$5M" },
                "tables": [{ "title": "...", "columns": [], "rows": [] }],
                "charts": [{ "type": "bar", "labels": [], "datasets": [] }],
                "insights": ["insight1", "insight2"]
            }
        }
        """
        session_id = request.data.get('session_id')
        text = request.data.get('text')
        
        if not session_id or not text:
            return Response(
                {'error': 'session_id and text required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create session
        session = ChatSession.objects.get(
            id=session_id,
            user=request.user
        )
        
        # Save user message
        user_msg = ChatMessage.objects.create(
            session=session,
            text=text,
            role='user'
        )
        
        # Process with agent
        from .agent import AIReportAgent
        agent = AIReportAgent()
        
        try:
            # Call agent to get report
            report_data = agent.process_request(
                prompt=text,
                session_history=session.get_history()
            )
            
            # Save assistant message
            assistant_msg = ChatMessage.objects.create(
                session=session,
                text=text,  # or formatted text
                role='assistant',
                report_data=report_data
            )
            
            # Update session title if new
            if not session.title or session.title == "New Session":
                session.title = report_data.get('title', 'Untitled')
                session.save()
            
            return Response({
                'message_id': assistant_msg.id,
                'report_data': report_data
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================
# 3. GeneratedReportViewSet
# ============================================

class GeneratedReportViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for generated reports
    
    GET /api/ai-reports/reports/           - List all reports
    GET /api/ai-reports/reports/{id}/      - Get single report
    GET /api/ai-reports/reports/{id}/export/  - Export to PDF/Excel
    """
    serializer_class = GeneratedReportSerializer
    
    def get_queryset(self):
        return GeneratedReport.objects.filter(
            message__session__user=self.request.user
        ).order_by('-created_at')
    
    @action(detail=True, methods=['get'])
    def export(self, request, pk=None):
        """Export report to PDF or Excel"""
        report = self.get_object()
        format = request.query_params.get('format', 'pdf')
        
        # TODO: Implement PDF/Excel export
        # from reportlab or openpyxl
        
        return Response(
            {'error': 'Export not yet implemented'},
            status=status.HTTP_501_NOT_IMPLEMENTED
        )
```

### Fase 2: URLs (15 minutos)

#### Arquivo: `ai_reports/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'chat-sessions', views.ChatSessionViewSet, basename='chatsession')
router.register(r'messages', views.ChatMessageViewSet, basename='chatmessage')
router.register(r'reports', views.GeneratedReportViewSet, basename='generatedreport')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Fase 3: Incluir em URLs Principais

#### Arquivo: `supply_unlimited/urls.py`

```python
urlpatterns = [
    # ... existing patterns ...
    path('api/ai-reports/', include('ai_reports.urls')),
]
```

---

## 🔗 Integração com LangGraph

### O que falta em `agent.py`:

```python
# Atualmente: agent.py tem estrutura de LangGraph
# Falta: Implementação real de cada stage

# Você precisa em cada stage:
# 1. INTERPRETING: Parse prompt → extract KPIs
# 2. PLANNING: Create strategy → data sources
# 3. DATA_COLLECTION: Query databases → aggregate
# 4. ANALYSIS: Process data → calculate metrics
# 5. GENERATING: Format → return report_data

# Saída esperada (report_data):
report_data = {
    'title': 'Inventory Analysis Report',
    'kpis': {
        'Total SKUs': 1234,
        'Total Value': '$5,234,567',
        'Turnover Rate': '4.2x/year'
    },
    'tables': [
        {
            'title': 'Top 10 SKUs by Value',
            'columns': ['SKU', 'Qty', 'Value', 'Turnover'],
            'rows': [
                ['SKU-001', '500', '$50K', '8.2x'],
                ['SKU-002', '300', '$45K', '6.5x'],
                # ...
            ]
        }
    ],
    'charts': [
        {
            'type': 'bar',
            'title': 'SKU Distribution by Category',
            'labels': ['Category A', 'Category B', 'Category C'],
            'datasets': [
                {
                    'label': 'Quantity',
                    'data': [100, 200, 150],
                    'backgroundColor': '#10b981'
                }
            ]
        }
    ],
    'insights': [
        'Inventory turnover is 15% below industry average',
        'Top 20% of SKUs represent 80% of value',
        'Recommendation: Implement ABC analysis for optimization'
    ]
}
```

---

## ✅ Checklist de Implementação

- [ ] **ViewSets criados** (`ai_reports/views.py`)
  - [ ] ChatSessionViewSet
  - [ ] ChatMessageViewSet
  - [ ] GeneratedReportViewSet

- [ ] **URLs configuradas**
  - [ ] `ai_reports/urls.py` criado
  - [ ] Router registrado
  - [ ] Incluído em `supply_unlimited/urls.py`

- [ ] **Agent integrado**
  - [ ] `agent.py` retorna `report_data`
  - [ ] Cada stage implementado
  - [ ] Dados de exemplo testados

- [ ] **Testes**
  - [ ] Teste criar sessão
  - [ ] Teste enviar mensagem
  - [ ] Teste receber report
  - [ ] Teste erros

- [ ] **Deployment**
  - [ ] collectstatic ✓
  - [ ] Migrations ✓
  - [ ] Server restart ✓
  - [ ] Test em navegador ✓

---

## 🚀 Timeline Estimada

- **ViewSets**: 1-2 horas
- **URLs**: 15 minutos
- **Agent Integration**: 2-4 horas
- **Testing**: 1-2 horas
- **Total**: 4-9 horas de desenvolvimento

---

## 📞 Referências Rápidas

### Estrutura Esperada de report_data:
```javascript
// Em static/js/ai-reports-new.js, função addReportToPreview()
// Espera esse formato para renderizar
{
    title: string,
    kpis: { label: value },
    tables: [{ title, columns[], rows[][] }],
    charts: [{ type, labels[], datasets[] }],
    insights: [string]
}
```

### Testes com curl:
```bash
# Criar sessão
curl -X POST http://localhost:8000/api/ai-reports/chat-sessions/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -d '{"title": "Test Session"}'

# Enviar mensagem
curl -X POST http://localhost:8000/api/ai-reports/messages/send/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -d '{"session_id": 1, "text": "Analyze inventory"}'
```

---

## 💬 Próximas Conversas

Quando estiver implementando:
1. Compartilhe seu `views.py`
2. Mostre como o `agent.py` retorna dados
3. Envie erros que encontrar
4. Teste e faça debugging juntos

---

**Status**: 🟢 Pronto para implementação  
**Tempo estimado**: 4-9 horas  
**Próximo passo**: Implementar ViewSets em `ai_reports/views.py`

