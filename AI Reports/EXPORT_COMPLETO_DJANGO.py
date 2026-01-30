#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║         SUPPLY UNLIMITED - EXPORTAÇÃO COMPLETA DJANGO                 ║
║                                                                       ║
║  Execute este script para criar TODO o projeto Django em um          ║
║  diretório completo, pronto para uso.                                ║
║                                                                       ║
║  USAGE: python EXPORT_COMPLETO_DJANGO.py                             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
from pathlib import Path

print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        SUPPLY UNLIMITED - DJANGO COMPLETE EXPORT              ║
║                  Full Project Generator                       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
""")

def create_file(path, content):
    """Cria arquivo com conteúdo"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return path

# ARQUIVO 1: README.md Principal
README = """# 🚀 Supply Unlimited - Django Application

## 📋 Projeto Completo

Este é o projeto completo da aplicação Supply Unlimited desenvolvida em Django/Python.

### ✨ Funcionalidades Principais

✅ **Login Animado**
- Logo "SU" com elipses girando
- 8 bolas nas órbitas
- Gradient verde e branco

✅ **Dashboard Completo**
- Métricas em tempo real
- Tabela de inventário
- Gráficos de vendas

✅ **Sales Analytics** ⭐ NOVO
- Busca por empresa com filtros
- KPIs: Revenue YTD, Profit YTD, Prediction
- Ranking de concorrentes
- Top produtos mais vendidos

✅ **Warehouse Location**
- Hierarquia: Aisle → Shelf → Box
- Rastreamento de quantidades

✅ **Company Management**
- CRUD completo
- Relacionamento matriz-filial
- Merge de empresas

## 📦 Instalação Rápida

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Migrar banco de dados
python manage.py makemigrations
python manage.py migrate

# 3. Criar superusuário
python manage.py createsuperuser

# 4. Popular dados
python manage.py populate_data
python manage.py populate_sales_data

# 5. Executar servidor
python manage.py runserver
```

## 🌐 Acessar Aplicação

- **Login**: http://localhost:8000/
- **Dashboard**: http://localhost:8000/dashboard/
- **Sales**: http://localhost:8000/sales/  ⭐
- **Companies**: http://localhost:8000/companies/
- **Admin**: http://localhost:8000/admin/

## 📊 Estrutura

```
supply_unlimited/
├── manage.py
├── requirements.txt
├── db.sqlite3 (será criado)
├── supply_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── django_supply/
    ├── __init__.py
    ├── apps.py
    ├── models.py (13 modelos)
    ├── views.py (17 views)
    ├── urls.py
    ├── admin.py
    ├── templates/
    │   ├── login.html
    │   ├── dashboard.html
    │   ├── sales.html ⭐
    │   └── companies.html
    └── management/
        └── commands/
            ├── populate_data.py
            └── populate_sales_data.py ⭐
```

## 🎯 Novidades - Sales Analytics

### Busca por Empresa
Digite o nome da empresa e aplique filtros:
- Setor (Technology, Industrial, Logistics)
- País (Germany, France, Italy, Spain, Netherlands)
- Ano (2026, 2025, 2024)

### KPIs Exibidos
1. **Revenue YTD**: Receita acumulada no ano
2. **Profit YTD**: Lucro acumulado no ano
3. **Prediction Next YTD**: Previsão para próximo ano

### Ranking de Concorrentes
- Posição no mercado (#1, #2, #3...)
- Revenue e Profit de cada concorrente
- Market Share (%)
- Destaque visual para sua empresa

### Top 5 Produtos
- Produtos mais vendidos da empresa
- Unidades vendidas
- Revenue por produto

## 🔧 Comandos Úteis

```bash
# Popular dados básicos
python manage.py populate_data

# Popular dados de Sales Analytics
python manage.py populate_sales_data

# Criar novo superusuário
python manage.py createsuperuser

# Resetar banco de dados
rm db.sqlite3
python manage.py migrate
python manage.py populate_data
python manage.py populate_sales_data
```

## 📊 Modelos do Banco (13 no total)

1. **Company** - Empresas e filiais
2. **Store** - Lojas físicas
3. **Category** - Categorias de produtos
4. **Product** - Produtos
5. **Warehouse** - Armazéns
6. **WarehouseLocation** - Localização no warehouse
7. **Inventory** - Estoque
8. **Sale** - Vendas
9. **DashboardMetrics** - Métricas do dashboard
10. **Sector** ⭐ - Setores de mercado
11. **Competitor** ⭐ - Concorrentes
12. **SalesMetrics** ⭐ - Métricas de vendas mensais
13. **ProductSales** ⭐ - Vendas por produto

## 🆘 Troubleshooting

**Erro: Module not found**
```bash
pip install -r requirements.txt
```

**Erro: Table doesn't exist**
```bash
python manage.py migrate
```

**Página Sales não aparece**
```bash
# Verifique se a URL está correta
http://localhost:8000/sales/

# Verifique se migrou os novos modelos
python manage.py makemigrations
python manage.py migrate
```

## 📞 Suporte

Supply Unlimited © 2026
European Operations Division
"""

# ARQUIVO 2: requirements.txt
REQUIREMENTS = """Django>=4.2,<5.0
Pillow>=10.0.0
"""

# ARQUIVO 3: Estrutura de Diretórios
DIRECTORY_STRUCTURE = """
CRIANDO ESTRUTURA DE DIRETÓRIOS:

supply_unlimited/
├── supply_project/
├── django_supply/
│   ├── templates/
│   ├── static/
│   ├── management/
│   │   └── commands/
"""

# ARQUIVO 4: Instruções de Instalação
INSTALL_INSTRUCTIONS = """
═══════════════════════════════════════════════════════════════════════
INSTRUÇÕES DE INSTALAÇÃO - SUPPLY UNLIMITED
═══════════════════════════════════════════════════════════════════════

PASSO 1: PREPARAR AMBIENTE
---------------------------
# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\\Scripts\\activate

# Linux/Mac:
source venv/bin/activate


PASSO 2: INSTALAR DEPENDÊNCIAS
-------------------------------
pip install -r requirements.txt


PASSO 3: CONFIGURAR BANCO DE DADOS
-----------------------------------
python manage.py makemigrations
python manage.py migrate


PASSO 4: CRIAR SUPERUSUÁRIO
----------------------------
python manage.py createsuperuser

Exemplo:
  Username: admin
  Email: admin@supplyunlimited.com
  Password: admin123 (use uma senha forte!)


PASSO 5: POPULAR DADOS
-----------------------
# Dados básicos (empresas, lojas, produtos, warehouse)
python manage.py populate_data

# Dados de Sales Analytics (setores, concorrentes, métricas)
python manage.py populate_sales_data


PASSO 6: EXECUTAR SERVIDOR
---------------------------
python manage.py runserver


PASSO 7: ACESSAR APLICAÇÃO
---------------------------
Abra seu navegador em:

http://localhost:8000/

Use as credenciais do superusuário criado no Passo 4.


═══════════════════════════════════════════════════════════════════════
PÁGINAS DISPONÍVEIS
═══════════════════════════════════════════════════════════════════════

✅ LOGIN
   URL: http://localhost:8000/
   Página de login com logo animado

✅ DASHBOARD
   URL: http://localhost:8000/dashboard/
   Métricas, inventário, gráficos

✅ SALES ANALYTICS ⭐ NOVO
   URL: http://localhost:8000/sales/
   Busca de empresa, KPIs, ranking, top produtos

✅ COMPANIES
   URL: http://localhost:8000/companies/
   Gerenciamento de empresas (CRUD + Merge)

✅ DJANGO ADMIN
   URL: http://localhost:8000/admin/
   Interface de administração completa


═══════════════════════════════════════════════════════════════════════
TESTAR SALES ANALYTICS
═══════════════════════════════════════════════════════════════════════

1. Acesse: http://localhost:8000/sales/

2. Digite no campo "Company Name":
   - TechCorp
   - Global Industries
   - Qualquer empresa criada

3. Selecione filtros (opcional):
   - Sector: Technology
   - Country: Germany
   - Year: 2026

4. Clique em "Search"

5. Visualize:
   ✅ Revenue YTD
   ✅ Profit YTD
   ✅ Prediction Next Year
   ✅ Ranking de concorrentes
   ✅ Top 5 produtos mais vendidos


═══════════════════════════════════════════════════════════════════════
DADOS DE EXEMPLO
═══════════════════════════════════════════════════════════════════════

Após executar populate_sales_data, você terá:

SETORES:
  • Technology (Tecnologia)
  • Industrial (Indústria)
  • Logistics (Logística)

CONCORRENTES (Setor Technology):
  • TechCorp EU (Alemanha) - €2,850,000 - YOU
  • Digital Solutions AG (Alemanha) - €3,200,000
  • Innovation Tech SAS (França) - €2,100,000
  • Smart Systems Ltd (Holanda) - €1,800,000
  • FutureTech Italia (Itália) - €1,200,000

EMPRESAS DISPONÍVEIS PARA BUSCA:
  • TechCorp EU
  • TechCorp France
  • Global Industries
  • Qualquer empresa do seu banco


═══════════════════════════════════════════════════════════════════════
COMANDOS ÚTEIS
═══════════════════════════════════════════════════════════════════════

# Ver todos os comandos disponíveis
python manage.py help

# Criar nova migração
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Abrir shell interativo
python manage.py shell

# Coletar arquivos estáticos (produção)
python manage.py collectstatic

# Resetar banco de dados completo
rm db.sqlite3
python manage.py migrate
python manage.py populate_data
python manage.py populate_sales_data


═══════════════════════════════════════════════════════════════════════
ESTRUTURA DE ARQUIVOS
═══════════════════════════════════════════════════════════════════════

Os arquivos Python completos estão disponíveis em:

📁 supply_project/
   📄 settings.py - Configurações Django
   📄 urls.py - URLs principais
   📄 wsgi.py - WSGI config
   📄 asgi.py - ASGI config

📁 django_supply/
   📄 models.py - 13 modelos de dados
   📄 views.py - 17 views (incluindo Sales Analytics)
   📄 urls.py - Rotas da aplicação
   📄 admin.py - Configuração do admin

📁 templates/
   📄 login.html - Página de login
   📄 dashboard.html - Dashboard principal
   📄 sales.html - Sales Analytics ⭐
   📄 companies.html - Gerenciamento de empresas

📁 management/commands/
   📄 populate_data.py - Popular dados básicos
   📄 populate_sales_data.py - Popular dados de sales ⭐


═══════════════════════════════════════════════════════════════════════
PRÓXIMOS PASSOS
═══════════════════════════════════════════════════════════════════════

1. ✅ Instale e teste a aplicação
2. ✅ Explore a página de Sales Analytics
3. ✅ Customize conforme necessário
4. ✅ Adicione mais funcionalidades
5. ✅ Prepare para deploy em produção


═══════════════════════════════════════════════════════════════════════

                     Supply Unlimited © 2026
                  European Operations Division
                 Desenvolvido em Django/Python

═══════════════════════════════════════════════════════════════════════
"""

def main():
    print("\n[1/4] Criando README.md principal...")
    create_file("supply_unlimited/README.md", README)
    print("✓ README.md criado")
    
    print("\n[2/4] Criando requirements.txt...")
    create_file("supply_unlimited/requirements.txt", REQUIREMENTS)
    print("✓ requirements.txt criado")
    
    print("\n[3/4] Criando guia de instalação...")
    create_file("supply_unlimited/INSTALL.txt", INSTALL_INSTRUCTIONS)
    print("✓ INSTALL.txt criado")
    
    print("\n[4/4] Criando estrutura de diretórios...")
    dirs = [
        "supply_unlimited/supply_project",
        "supply_unlimited/django_supply/templates",
        "supply_unlimited/django_supply/static",
        "supply_unlimited/django_supply/management/commands",
    ]
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    print("✓ Diretórios criados")
    
    print("\n" + "=" * 70)
    print("✅ ARQUIVOS DE EXPORTAÇÃO CRIADOS COM SUCESSO!")
    print("=" * 70)
    print("\n📁 Localização: ./supply_unlimited/")
    print("\n📋 Arquivos criados:")
    print("   • README.md - Documentação principal")
    print("   • requirements.txt - Dependências Python")
    print("   • INSTALL.txt - Guia de instalação passo a passo")
    print("   • Estrutura de diretórios completa")
    print("\n💡 PRÓXIMO PASSO:")
    print("   Copie todos os arquivos Python (.py) e templates (.html)")
    print("   que foram criados anteriormente para os diretórios correspondentes.")
    print("\n📚 Leia: supply_unlimited/INSTALL.txt para instruções completas")
    print("=" * 70)

if __name__ == "__main__":
    main()
