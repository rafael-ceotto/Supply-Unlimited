# Supply Unlimited - Django Application

Sistema de gerenciamento de suprimentos para operações europeias.

## 🚀 Instalação e Configuração

### 1. Criar ambiente virtual

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install django
```

### 3. Configurar o projeto Django

```bash
# Criar projeto Django (se ainda não existir)
django-admin startproject supply_project .

# Copiar os arquivos fornecidos para a estrutura:
# - models.py → django_supply/models.py
# - views.py → django_supply/views.py
# - urls.py → django_supply/urls.py
# - admin.py → django_supply/admin.py
# - templates/ → django_supply/templates/
```

### 4. Configurar URLs principais

Edite `supply_project/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('django_supply.urls')),
]
```

### 5. Executar migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Criar superusuário

```bash
python manage.py createsuperuser
```

### 7. Popular banco de dados com dados de exemplo

```bash
python manage.py populate_data
```

### 8. Executar servidor

```bash
python manage.py runserver
```

Acesse: http://localhost:8000

## 📁 Estrutura do Projeto

```
supply_project/
├── django_supply/
│   ├── models.py              # Modelos do banco de dados
│   ├── views.py               # Views e lógica de negócio
│   ├── urls.py                # Rotas da aplicação
│   ├── admin.py               # Configuração do Django Admin
│   ├── templates/
│   │   ├── login.html         # Página de login
│   │   └── dashboard.html     # Dashboard principal
│   └── management/
│       └── commands/
│           └── populate_data.py  # Script para popular DB
├── supply_project/
│   ├── settings.py            # Configurações do Django
│   ├── urls.py                # URLs principais
│   └── wsgi.py
├── db.sqlite3                 # Banco de dados SQLite
└── manage.py
```

## 🗄️ Modelos do Banco de Dados

### Company
- **company_id** (PK): ID único da empresa
- **name**: Nome da empresa
- **parent**: Empresa-mãe (relacionamento recursivo)
- **country**: País
- **city**: Cidade
- **status**: Status (active, inactive, pending)
- **ownership_percentage**: Porcentagem de propriedade

### Store
- **store_id** (PK): ID da loja
- **company** (FK): Empresa proprietária
- **name**: Nome da loja
- **city**: Cidade
- **country**: País
- **address**: Endereço

### Product
- **sku** (PK): Código do produto
- **name**: Nome do produto
- **category** (FK): Categoria
- **price**: Preço
- **status**: Status do estoque

### WarehouseLocation
- **warehouse** (FK): Warehouse
- **product** (FK): Produto
- **aisle**: Corredor
- **shelf**: Prateleira
- **box**: Caixa
- **quantity**: Quantidade
- **last_updated**: Última atualização

### Inventory
- **product** (FK): Produto
- **store** (FK): Loja
- **quantity**: Quantidade em estoque

### Sale
- **product** (FK): Produto vendido
- **store** (FK): Loja
- **quantity**: Quantidade vendida
- **total_amount**: Valor total
- **sale_date**: Data da venda

## 🔌 APIs Disponíveis

### Autenticação
- `POST /login/` - Login de usuário
- `GET /logout/` - Logout

### Dashboard
- `GET /dashboard/` - Dashboard principal

### Inventário
- `GET /api/inventory/` - Lista de inventário com filtros
  - Parâmetros: search, store, category, stock, city, company

### Warehouse
- `GET /api/warehouse/<sku>/` - Localização do produto no warehouse
  - Retorna: aisles, shelves, boxes com quantidades

### Vendas
- `GET /api/sales/` - Dados de vendas com filtros
  - Parâmetros: city, company, store, product

### Empresas
- `GET /companies/` - Lista de empresas
- `GET /api/company/<company_id>/` - Detalhes da empresa
- `POST /api/company/create/` - Criar nova empresa
- `POST /api/company/<company_id>/update/` - Atualizar empresa
- `POST /api/company/<company_id>/delete/` - Deletar empresa
- `POST /api/company/merge/` - Mesclar empresas

### Exportação
- `GET /export/inventory/` - Exportar inventário para CSV

## 🎯 Funcionalidades Principais

### 1. Dashboard
- Cards de métricas (receita, pedidos, produtos, clientes)
- Tabela de inventário em tempo real
- Gráficos de vendas por país
- Filtros avançados

### 2. Warehouse Location
- Visualização hierárquica: Aisle → Shelf → Box
- Quantidades em tempo real
- Última atualização de cada localização

### 3. Gerenciamento de Empresas
- Relacionamento matriz-filial
- Porcentagem de propriedade
- Empresas vinculadas
- Ações CRUD completas
- Merge de empresas

### 4. Filtros Avançados
- Por cidade, empresa, loja, produto
- Status de estoque
- Categoria de produto
- Busca em tempo real

## 👤 Usuários Padrão (após popular dados)

Use o superusuário criado no passo 6.

## 🛠️ Desenvolvimento

### Adicionar novos dados

```bash
python manage.py shell
```

```python
from django_supply.models import Company, Product, Store

# Criar nova empresa
company = Company.objects.create(
    company_id='COM-006',
    name='Nova Empresa',
    country='Portugal',
    city='Lisboa',
    status='active'
)
```

### Django Admin

Acesse: http://localhost:8000/admin

Use as credenciais do superusuário para gerenciar todos os modelos.

## 📊 Relatórios e Exportação

- Exportar inventário em CSV
- Dados de vendas por período
- Análise por empresa/loja

## 🔐 Segurança

Em produção, certifique-se de:
1. Alterar `SECRET_KEY` em `settings.py`
2. Definir `DEBUG = False`
3. Configurar `ALLOWED_HOSTS`
4. Usar banco de dados PostgreSQL/MySQL
5. Configurar HTTPS
6. Implementar rate limiting

## 📝 Licença

Supply Unlimited © 2026 - Todos os direitos reservados
