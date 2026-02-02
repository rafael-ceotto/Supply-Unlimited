# Supply-Unlimited

Django web platform for managing and selling supplies. Features secure login and registration, an intuitive user dashboard, and a responsive Bootstrap 5 interface. Ideal for small to medium businesses looking to efficiently manage inventory and customers.
## 🆕 AI Reports Module (LangChain + LangGraph)

**New!** AI-powered report generation with intelligent analysis pipeline.

- **5-Stage Processing Pipeline**: Interpreting → Planning → Data Collection → Analysis → Generating
- **Intelligent Report Detection**: Automatically identifies report type from natural language queries
- **Structured Insights**: Generates insights and recommendations based on supply chain data
- **Multiple Export Formats**: PDF, Excel, JSON
- **Chat Session Management**: Maintain conversation history with the AI agent

See [AI_REPORTS_AGENT_GUIDE.md](AI_REPORTS_AGENT_GUIDE.md) for complete documentation.

### Quick Test
```bash
docker-compose exec web python test_agent.py
```

### API Endpoint
```bash
POST /api/ai-reports/messages/send/
Body: { "message": "Analyze inventory", "session_id": 1 }
```