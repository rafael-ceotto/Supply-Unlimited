# 🚀 SUPPLY UNLIMITED - Guia de Instalação Completo

## 📦 Arquivos Gerados

Foram criados os seguintes arquivos de setup:

1. **`setup_supply_unlimited.py`** - Cria a estrutura básica do projeto Django
2. **`create_templates.py`** - Cria templates HTML e comandos de gerenciamento
3. **`INSTALL_GUIDE.md`** - Este arquivo com instruções

## ⚙️ Instalação Passo a Passo

### Passo 1: Executar Scripts de Setup

```bash
# Execute o primeiro script (cria estrutura Django)
python setup_supply_unlimited.py

# Execute o segundo script (cria templates e comandos)
python create_templates.py
```

Isso criará a seguinte estrutura:

```
supply_project/
├── manage.py
├── requirements.txt
├── README.md
├── supply_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── django_supply/
    ├── __init__.py
    ├── apps.py
    ├── models.py          # 9 modelos (Company, Store, Product, etc.)
    ├── views.py           # 14 views completas
    ├── urls.py            # Todas as rotas
    ├── admin.py           # Interface admin
    ├── templates/
    │   ├── login.html     # Página de login com logo animado
    │   └── dashboard.html # Dashboard principal
    └── management/
        └── commands/
            └── populate_data.py  # Script para popular DB
```

### Passo 2: Criar Ambiente Virtual (Recomendado)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Passo 3: Instalar Dependências

```bash
pip install -r requirements.txt
```

Isso instalará:
- Django 4.2+
- Pillow 10.0+

### Passo 4: Migrar Banco de Dados

```bash
python manage.py makemigrations
python manage.py migrate
```

Isso criará todas as tabelas no banco SQLite:
- Company (empresas e filiais)
- Store (lojas)
- Category (categorias de produtos)
- Product (produtos)
- Warehouse (armazéns)
- WarehouseLocation (Aisle → Shelf → Box)
- Inventory (estoque)
- Sale (vendas)
- DashboardMetrics (métricas do dashboard)

### Passo 5: Criar Superusuário

```bash
python manage.py createsuperuser
```

Siga as instruções e crie:
- Username: admin (ou o que preferir)
- Email: seu@email.com
- Password: ******

### Passo 6: Popular Banco com Dados de Exemplo

```bash
python manage.py populate_data
```

Isso criará:
- 5 empresas (incluindo matriz e filiais)
- 5 lojas em países europeus
- 4 categorias de produtos
- 10 produtos
- Múltiplas warehouse locations
- Inventário para todas as lojas
- Vendas de exemplo
- Métricas do dashboard

### Passo 7: Executar Servidor

```bash
python manage.py runserver
```

## 🌐 Acessar a Aplicação

### Login
- URL: http://localhost:8000/
- Use as credenciais do superusuário criado

### Dashboard
- URL: http://localhost:8000/dashboard/
- Verá métricas, inventário, gráficos

### Django Admin
- URL: http://localhost:8000/admin/
- Use as credenciais do superusuário
- Gerencie todos os modelos

### Empresas
- URL: http://localhost:8000/companies/
- CRUD completo de empresas

## 📊 Funcionalidades Disponíveis

### ✅ Página de Login
- Logo animado "SU" com elipses girando
- 8 bolas nas órbitas
- Gradient verde e branco
- Formulário responsivo

### ✅ Dashboard
- **Top Bar**: Nome do usuário, logout
- **Sidebar**: Menu de navegação
- **Métricas Cards**: Receita, Pedidos, Produtos, Clientes
- **Tabela de Inventário**: Com status em tempo real
- **Filtros**: Por cidade, empresa, loja, produto, categoria

### ✅ Warehouse Location
- Organização hierárquica: Aisle → Shelf → Box
- Quantidades por localização
- Última atualização

### ✅ Gerenciamento de Empresas
- **Listagem** com filtros
- **Detalhes** com empresas vinculadas
- **Criar** nova empresa
- **Editar** informações
- **Deletar** com validação
- **Merge** de empresas
- **Relacionamento matriz-filial** com porcentagem de ownership

### ✅ APIs RESTful

```bash
# Inventário
GET /api/inventory/?search=drill&store=Germany&category=Electronics

# Warehouse Location
GET /api/warehouse/SUP-001/?store=Germany

# Vendas
GET /api/sales/?city=Berlin&company=COM-001

# Empresas
GET /companies/
GET /api/company/COM-001/
POST /api/company/create/
POST /api/company/COM-001/update/
POST /api/company/COM-001/delete/
POST /api/company/merge/

# Exportação
GET /export/inventory/?format=csv
```

## 🔧 Desenvolvimento

### Adicionar Novos Dados via Shell

```bash
python manage.py shell
```

```python
from django_supply.models import Company, Product, Store

# Criar nova empresa
company = Company.objects.create(
    company_id='COM-006',
    name='Nova Empresa Portugal',
    country='Portugal',
    city='Lisboa',
    status='active',
    ownership_percentage=100
)

# Listar empresas com filiais
for company in Company.objects.filter(parent__isnull=True):
    print(f"{company.name}:")
    for subsidiary in company.get_linked_companies():
        print(f"  - {subsidiary.name} ({subsidiary.ownership_percentage}%)")
```

### Modificar Models

1. Edite `django_supply/models.py`
2. Execute:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Adicionar Novos Views

1. Edite `django_supply/views.py`
2. Adicione rota em `django_supply/urls.py`
3. Crie template em `django_supply/templates/`

## 📁 Estrutura dos Modelos

### Company (Empresa)
```python
company_id (PK)        # Ex: "COM-001"
name                   # Ex: "TechCorp EU"
parent (FK)            # Empresa-mãe (recursivo)
country                # Ex: "Germany"
city                   # Ex: "Berlin"
status                 # active/inactive/pending
ownership_percentage   # Ex: 75 (%)
```

### WarehouseLocation
```python
warehouse (FK)
product (FK)
aisle                  # Ex: "A1"
shelf                  # Ex: "S2"
box                    # Ex: "B05"
quantity               # Ex: 45
last_updated           # Timestamp
```

### Inventory
```python
product (FK)
store (FK)
quantity
last_restocked
```

## 🔐 Segurança (Produção)

Antes de deploy em produção:

1. **Altere SECRET_KEY** em `supply_project/settings.py`:
```python
SECRET_KEY = 'seu-secret-key-super-seguro-aqui'
```

2. **Desative DEBUG**:
```python
DEBUG = False
ALLOWED_HOSTS = ['seu-dominio.com']
```

3. **Use PostgreSQL/MySQL**:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'supply_db',
        'USER': 'postgres',
        'PASSWORD': 'senha',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

4. **Configure HTTPS**
5. **Implemente rate limiting**
6. **Configure CORS** se necessário

## 📝 Notas Importantes

- **Banco de Dados**: Por padrão usa SQLite (db.sqlite3)
- **Timezone**: Configurado para Europe/Berlin
- **Idioma**: Inglês (en-us)
- **Static Files**: Configurados em `/static/`
- **Media Files**: Configurados em `/media/`

## 🆘 Troubleshooting

### Erro: "No module named 'django'"
```bash
pip install Django
```

### Erro: "Table doesn't exist"
```bash
python manage.py migrate
```

### Erro: "Static files not found"
```bash
python manage.py collectstatic
```

### Resetar Banco de Dados
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
python manage.py populate_data
```

## 📞 Suporte

Criado para Supply Unlimited - European Operations
Desenvolvido em Django/Python

---

**Supply Unlimited © 2026 - Todos os direitos reservados**
