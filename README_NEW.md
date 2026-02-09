# Supply Unlimited - Sistema de Gerenciamento de Inventário e Vendas

Um sistema completo de gerenciamento de inventário, empresas, lojas e vendas desenvolvido com Django e PostgreSQL. Inclui dashboard interativo, relatórios inteligentes com IA, analytics de vendas e controle de usuários.

## 🎯 Funcionalidades Principais

- **Dashboard Interativo**: Visualização em tempo real de métricas de vendas, inventário e perf ormance
- **Gerenciamento de Empresas & Lojas**: Criar, editar e monitorar múltiplas empresas e unidades
- **Controle de Inventário**: Gestão de produtos, estoque, armazéns e locações
- **Vendas & Analytics**: Registro de vendas com análises detalhadas de tendências
- **Relatórios com IA**: Geração automática de relatórios usando inteligência artificial
- **Sistema de Usuários**: Controle de acesso e permissões com RBAC
- **Banco de Dados Integrado**: PostgreSQL para dados robustos e confiáveis

## 🛠️ Stack Tecnológico

- **Backend**: Django 6.0.1
- **Banco de Dados**: PostgreSQL 15
- **Frontend**: HTML5, CSS3, JavaScript Vanilla, Lucide Icons
- **Charts**: Chart.js
- **Container**: Docker & Docker Compose
- **APIs**: Django REST Framework
- **IA**: LangChain + OpenAI (opcional)

## 📋 Requisitos

- Docker & Docker Compose
- Conta OpenAI (opcional, para features de IA)

Ou sem Docker:
- Python 3.13+
- PostgreSQL 15+
- Node.js (para assets/frontend)

## 🚀 Instalação e Setup

### Opção 1: Com Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
   cd supply_unlimited
   ```

2. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais
   ```

3. **Inicie os containers**
   ```bash
   docker compose up -d
   ```

4. **Execute migrações do banco**
   ```bash
   docker exec supply_unlimited_web python manage.py migrate
   ```

5. **Crie um superuser**
   ```bash
   docker exec -it supply_unlimited_web python manage.py createsuperuser
   ```

6. **Carregue dados de exemplo (opcional)**
   ```bash
   docker exec supply_unlimited_web python populate_data.py
   ```

7. **Acesse a aplicação**
   - URL: http://localhost:8000
   - Admin: http://localhost:8000/admin

### Opção 2: Sem Docker (Desenvolvimento Local)

1. **Clone e entre no repositório**
   ```bash
   git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
   cd supply_unlimited
   ```

2. **Crie ambiente virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # ou
   venv\Scripts\activate  # Windows
   ```

3. **Instale dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure arquivo .env**
   ```bash
   cp .env.example .env
   # Edite com suas variáveis
   ```

5. **Configure PostgreSQL**
   - Crie um banco de dados
   - Atualize DATABASE_URL no .env

6. **Execute migrações**
   ```bash
   python manage.py migrate
   ```

7. **Crie superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Inicie servidor de desenvolvimento**
   ```bash
   python manage.py runserver
   ```

9. **Acesse**
   - http://localhost:8000

## ⚙️ Configuração de Variáveis Ambientais

Crie um arquivo `.env` na raiz do projeto:

```env
# Django
DEBUG=False
SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,seu-dominio.com

# PostgreSQL
DATABASE_URL=postgresql://usuario:senha@db:5432/supply_unlimited_db
DB_NAME=supply_unlimited_db
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=db
DB_PORT=5432

# OpenAI (para IA Reports - opcional)
OPENAI_API_KEY=sua-chave-openai-aqui

# Redis (opcional, para Channels)
REDIS_URL=redis://redis:6379

# Django Secret Key (gere uma nova)
DJANGO_SECRET_KEY=seu-secret-key-aqui
```

## 📁 Estrutura do Projeto

```
supply_unlimited/
├── supply_unlimited/        # Configurações Django
│   ├── settings.py         # Configurações do projeto
│   ├── urls.py             # URLs principais
│   ├── wsgi.py
│   └── asgi.py
├── users/                   # App de usuários e autenticação
│   ├── models.py           # Modelos (Company, Store, Product, etc)
│   ├── views.py            # Lógica de views
│   ├── forms.py            # Formulários
│   └── migrations/
├── ai_reports/             # App de relatórios com IA
│   ├── models.py
│   ├── views.py
│   └── agent.py            # Integração com LangChain
├── sales/                  # App de vendas
│   ├── models.py
│   └── views.py
├── templates/              # Templates HTML
│   ├── base.html           # Template base
│   ├── login.html
│   ├── dashboard.html      # Dashboard principal
│   ├── inventory.html
│   ├── companies.html
│   ├── reports.html
│   └── sales.html
├── static/                 # Assets estáticos
│   ├── css/
│   │   ├── dashboard.css
│   │   ├── ai-reports.css
│   │   └── ...
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── ai-reports-new.js
│   │   └── ...
│   └── ...
├── docker-compose.yml      # Orquestração de containers
├── Dockerfile              # Imagem Docker
├── manage.py               # CLI Django
├── requirements.txt        # Dependências Python
├── .env.example            # Exemplo de variáveis
└── .gitignore
```

## 🔐 Autenticação e Autorização

- **Autenticação**: Username/Password padrão do Django
- **Autorização**: RBAC (Role-Based Access Control)
  - Admin: Acesso total ao sistema
  - Staff: Acesso a gerenciamento de usuários
  - Usuários Normais: Acesso limitado a funcionalidades

## 🗄️ Gerenciamento do Banco de Dados

### Criar Nova Migração
```bash
python manage.py makemigrations
python manage.py migrate
```

### Backup do Banco (Docker)
```bash
docker exec supply_unlimited_db pg_dump -U postgres supply_unlimited_db > backup.sql
```

### Restaurar Banco (Docker)
```bash
docker exec -i supply_unlimited_db psql -U postgres supply_unlimited_db < backup.sql
```

## 📊 Modelos Principais

### Company
Representa uma empresa com múltiplas lojas e unidades.

### Store
Unidade de venda/operação pertencente a uma empresa.

### Product
Produtos vendidos/armazenados no sistema.

### Inventory
Controle de estoque por loja e produto.

### Warehouse & WarehouseLocation
Localização física de produtos nos armazéns.

### Sale
Registro de vendas com detalhes de cliente, produto, quantidade e preço.

### DashboardMetrics
Métricas agregadas para o dashboard.

## 🤖 Recursos de IA

O sistema inclui integração com OpenAI para gerar relatórios inteligentes de vendas e análises. Para usar:

1. Defina `OPENAI_API_KEY` no `.env`
2. Navegue até a seção "AI Reports"
3. Selecione período e tipo de relatório
4. A IA analisará os dados e gerará insights

## 🧪 Testes

```bash
# Executar todos os testes
python manage.py test

# Testes específicos de um app
python manage.py test users

# Com verbosidade
python manage.py test -v 2
```

## 🐛 Troubleshooting

### Erro: "No such module named 'daphne'"
```bash
pip install -r requirements.txt
```

### Erro de conexão com PostgreSQL
- Verifique se PostgreSQL está rodando
- Verifique credenciais no `.env`
- Com Docker: `docker logs supply_unlimited_db`

### Erro ao fazer collectstatic
```bash
python manage.py collectstatic --noinput
```

### Resetar banco de dados (CUIDADO!)
```bash
# Com Docker
docker exec supply_unlimited_web python manage.py flush

# Ou remova o volume:
docker compose down -v
docker compose up -d
```

## 📝 Logs

### Com Docker
```bash
# Ver logs da web
docker logs -f supply_unlimited_web

# Ver logs do banco
docker logs -f supply_unlimited_db
```

### Localmente
```bash
# Logs do Django
tail -f *.log
```

## 🤝 Contribuindo

Este é um projeto de portfolio. Para sugestões de melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 👤 Autor

Rafael Ceotto - [@rafael-ceotto](https://github.com/rafael-ceotto)

## 📞 Suporte

Para reportar bugs ou pedir features:
- Abra uma [Issue](https://github.com/rafael-ceotto/Supply-Unlimited/issues)
- Envie um email

## 🙏 Agradecimentos

- Django e comunidade Python
- PostgreSQL
- Chart.js para visualizações
- Lucide para ícones
- OpenAI pela API de IA

---

**Desenvolvido com ❤️ como projeto de portfolio**
