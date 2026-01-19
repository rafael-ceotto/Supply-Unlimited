#!/usr/bin/env python
import os
import django
import pandas as pd
from datetime import datetime
from decimal import Decimal
from django.db.models import Sum, Count

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.models import Company, Store, Category, Product, Warehouse, WarehouseLocation, Inventory, Sale, DashboardMetrics

def analyze_data():
    """Analisar dados com pandas"""
    print("\n" + "="*60)
    print("📊 ANÁLISE DE DADOS COM PANDAS")
    print("="*60)
    
    # ========== VENDAS ==========
    print("\n🛍️  ANÁLISE DE VENDAS")
    print("-" * 60)
    
    sales_data = list(Sale.objects.values('sale_id', 'product__name', 'store__name', 'quantity', 'total_amount', 'sale_date'))
    sales_df = pd.DataFrame(sales_data)
    
    if not sales_df.empty:
        sales_df['total_amount'] = pd.to_numeric(sales_df['total_amount'])
        
        print(f"\nTotal de Vendas: {len(sales_df)}")
        print(f"Valor Total: R$ {sales_df['total_amount'].sum():,.2f}")
        print(f"Ticket Médio: R$ {sales_df['total_amount'].mean():,.2f}")
        print(f"Maior Venda: R$ {sales_df['total_amount'].max():,.2f}")
        print(f"Menor Venda: R$ {sales_df['total_amount'].min():,.2f}")
        
        print("\n📈 TOP 5 PRODUTOS MAIS VENDIDOS:")
        top_products = sales_df.groupby('product__name')['quantity'].sum().sort_values(ascending=False).head(5)
        for idx, (product, qty) in enumerate(top_products.items(), 1):
            print(f"  {idx}. {product}: {qty} unidades")
        
        print("\n🏪 TOP 5 LOJAS COM MAIOR FATURAMENTO:")
        top_stores = sales_df.groupby('store__name')['total_amount'].sum().sort_values(ascending=False).head(5)
        for idx, (store, value) in enumerate(top_stores.items(), 1):
            print(f"  {idx}. {store}: R$ {value:,.2f}")
    
    # ========== INVENTÁRIO ==========
    print("\n\n📦 ANÁLISE DE INVENTÁRIO")
    print("-" * 60)
    
    inventory_data = list(Inventory.objects.select_related('product', 'store').values('product__name', 'store__name', 'quantity'))
    inventory_df = pd.DataFrame(inventory_data)
    
    if not inventory_df.empty:
        print(f"\nTotal de SKUs em Estoque: {inventory_df['product__name'].nunique()}")
        print(f"Quantidade Total em Estoque: {inventory_df['quantity'].sum():,} unidades")
        print(f"Estoque Médio por SKU: {inventory_df['quantity'].mean():,.0f} unidades")
        print(f"Maior Estoque: {inventory_df['quantity'].max():,} unidades")
        print(f"Menor Estoque: {inventory_df['quantity'].min()} unidades")
        
        print("\n⚠️  TOP 5 SKUs COM MENOR ESTOQUE:")
        low_stock = inventory_df.nsmallest(5, 'quantity')[['product__name', 'store__name', 'quantity']]
        for idx, row in low_stock.iterrows():
            print(f"  • {row['product__name']} ({row['store__name']}): {row['quantity']} unidades")
    
    # ========== EMPRESAS E LOJAS ==========
    print("\n\n🏢 ANÁLISE DE EMPRESAS E LOJAS")
    print("-" * 60)
    
    companies = Company.objects.all()
    print(f"\nTotal de Empresas: {companies.count()}")
    print(f"Empresas Ativas: {companies.filter(status='active').count()}")
    print(f"Empresas Inativas: {companies.filter(status='inactive').count()}")
    print(f"Empresas Pendentes: {companies.filter(status='pending').count()}")
    
    print(f"\nTotal de Lojas: {Store.objects.count()}")
    print(f"Lojas Ativas: {Store.objects.filter(is_active=True).count()}")
    print(f"Lojas Inativas: {Store.objects.filter(is_active=False).count()}")
    
    print("\n📊 LOJAS POR EMPRESA:")
    for company in companies:
        store_count = company.stores.count()
        if store_count > 0:
            print(f"  • {company.name}: {store_count} loja(s)")
    
    # ========== CATEGORIAS ==========
    print("\n\n🏷️  ANÁLISE DE CATEGORIAS")
    print("-" * 60)
    
    print(f"\nTotal de Categorias: {Category.objects.count()}")
    
    print("\n📊 PRODUTOS POR CATEGORIA:")
    for category in Category.objects.all():
        product_count = category.product_set.count()
        print(f"  • {category.name}: {product_count} produtos")
    
    # ========== ARMAZÉNS ==========
    print("\n\n🏭 ANÁLISE DE ARMAZÉNS")
    print("-" * 60)
    
    warehouse_data = list(WarehouseLocation.objects.values('warehouse__name').annotate())
    print(f"\nTotal de Armazéns: {Warehouse.objects.count()}")
    print(f"Total de Localizações (Aisle-Shelf-Box): {WarehouseLocation.objects.count()}")
    
    location_quantities = WarehouseLocation.objects.values('warehouse__name').annotate(
        total_qty=Sum('quantity')
    )
    
    print("\n📊 CAPACIDADE POR ARMAZÉM:")
    for warehouse in Warehouse.objects.all():
        locations = warehouse.locations.count()
        total_qty = warehouse.locations.aggregate(total=Sum('quantity'))['total'] or 0
        print(f"  • {warehouse.name}: {locations} localizações, {total_qty:,} unidades")
    
    # ========== MÉTRICAS DO DASHBOARD ==========
    print("\n\n📈 ANÁLISE DE MÉTRICAS DO DASHBOARD")
    print("-" * 60)
    
    metrics_data = list(DashboardMetrics.objects.values())
    if metrics_data:
        metrics_df = pd.DataFrame(metrics_data)
        
        print(f"\nPeríodo de Dados: {len(metrics_df)} dias")
        print(f"\nRecreita Total (30 dias): R$ {metrics_df['total_revenue'].sum():,.2f}")
        print(f"Receita Média/dia: R$ {metrics_df['total_revenue'].mean():,.2f}")
        print(f"Melhor dia: R$ {metrics_df['total_revenue'].max():,.2f}")
        print(f"Pior dia: R$ {metrics_df['total_revenue'].min():,.2f}")
        
        print(f"\nTotal de Pedidos (30 dias): {metrics_df['total_orders'].sum():,}")
        print(f"Média de Pedidos/dia: {metrics_df['total_orders'].mean():.0f}")
        
        print(f"\nTotal de Clientes Ativos: {metrics_df['active_customers'].sum():,}")
        print(f"Média de Clientes/dia: {metrics_df['active_customers'].mean():.0f}")
    
    # ========== RESUMO FINAL ==========
    print("\n\n" + "="*60)
    print("✨ RESUMO FINAL")
    print("="*60)
    
    print(f"\n📊 Estatísticas Gerais:")
    print(f"  • Empresas: {Company.objects.count()}")
    print(f"  • Lojas: {Store.objects.count()}")
    print(f"  • Produtos: {Product.objects.count()}")
    print(f"  • Vendas: {Sale.objects.count()}")
    print(f"  • Itens em Estoque: {Inventory.objects.count()}")
    print(f"  • Localizações de Armazém: {WarehouseLocation.objects.count()}")
    print(f"  • Armazéns: {Warehouse.objects.count()}")
    
    print("\n💡 Insights:")
    if sales_df is not None and not sales_df.empty:
        print(f"  • Receita Total do Período: R$ {sales_df['total_amount'].sum():,.2f}")
        print(f"  • Número de Transações: {len(sales_df)}")
    
    if inventory_df is not None and not inventory_df.empty:
        print(f"  • Quantidade Total em Estoque: {inventory_df['quantity'].sum():,} unidades")
    
    print("\n" + "="*60 + "\n")

if __name__ == '__main__':
    analyze_data()
