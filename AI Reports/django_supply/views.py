from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.db.models import Sum, Count, Q, F
from django.views.decorators.http import require_http_methods
from datetime import datetime, date
import json
import csv

from .models import (
    Company, Store, Product, Inventory, Sale, 
    WarehouseLocation, Warehouse, DashboardMetrics, Category
)


def login_view(request):
    """View para página de login"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {
                'error': 'Invalid credentials'
            })
    
    return render(request, 'login.html')


def logout_view(request):
    """View para logout"""
    logout(request)
    return redirect('login')


@login_required
def dashboard_view(request):
    """View principal do dashboard"""
    # Obter métricas do dia atual
    today = date.today()
    try:
        metrics = DashboardMetrics.objects.get(metric_date=today)
    except DashboardMetrics.DoesNotExist:
        metrics = DashboardMetrics.objects.create(
            metric_date=today,
            total_revenue=245820.50,
            total_orders=1834,
            total_products=8456,
            active_customers=342
        )
    
    context = {
        'user': request.user,
        'metrics': metrics,
    }
    return render(request, 'dashboard.html', context)


@login_required
def inventory_data(request):
    """API para obter dados de inventário com filtros"""
    # Obter parâmetros de filtro
    search_query = request.GET.get('search', '')
    store_filter = request.GET.get('store', 'all')
    category_filter = request.GET.get('category', 'all')
    stock_filter = request.GET.get('stock', 'all')
    city_filter = request.GET.get('city', 'all')
    company_filter = request.GET.get('company', 'all')
    
    # Query base
    inventory_items = Inventory.objects.select_related('product', 'store', 'store__company')
    
    # Aplicar filtros
    if search_query:
        inventory_items = inventory_items.filter(
            Q(product__name__icontains=search_query) |
            Q(product__sku__icontains=search_query) |
            Q(product__category__name__icontains=search_query)
        )
    
    if store_filter != 'all':
        inventory_items = inventory_items.filter(store__country=store_filter)
    
    if category_filter != 'all':
        inventory_items = inventory_items.filter(product__category__name=category_filter)
    
    if city_filter != 'all':
        inventory_items = inventory_items.filter(store__city=city_filter)
    
    if company_filter != 'all':
        inventory_items = inventory_items.filter(store__company__company_id=company_filter)
    
    if stock_filter != 'all':
        if stock_filter == 'in-stock':
            inventory_items = inventory_items.filter(quantity__gt=20)
        elif stock_filter == 'low-stock':
            inventory_items = inventory_items.filter(quantity__lte=20, quantity__gt=0)
        elif stock_filter == 'out-of-stock':
            inventory_items = inventory_items.filter(quantity=0)
    
    # Preparar dados para resposta
    data = []
    for item in inventory_items[:100]:  # Limitar a 100 itens
        # Determinar status
        if item.quantity > 20:
            status = 'in-stock'
        elif item.quantity > 0:
            status = 'low-stock'
        else:
            status = 'out-of-stock'
        
        data.append({
            'id': item.id,
            'sku': item.product.sku,
            'name': item.product.name,
            'category': item.product.category.name if item.product.category else 'N/A',
            'store': item.store.country,
            'stock': item.quantity,
            'price': float(item.product.price),
            'status': status,
        })
    
    return JsonResponse({'data': data})


@login_required
def warehouse_location_data(request, sku):
    """API para obter localização de produto no warehouse"""
    product = get_object_or_404(Product, sku=sku)
    store_name = request.GET.get('store', '')
    
    # Buscar localizações do produto
    locations = WarehouseLocation.objects.filter(
        product=product
    ).select_related('warehouse', 'warehouse__store')
    
    if store_name:
        locations = locations.filter(warehouse__store__country=store_name)
    
    # Organizar dados
    warehouse_data = []
    for loc in locations:
        warehouse_data.append({
            'aisle': loc.aisle,
            'shelf': loc.shelf,
            'box': loc.box,
            'quantity': loc.quantity,
            'lastUpdated': loc.last_updated.strftime('%I:%M %p'),
        })
    
    return JsonResponse({
        'productName': product.name,
        'productSku': product.sku,
        'storeName': store_name,
        'warehouseData': warehouse_data,
    })


@login_required
def sales_data(request):
    """API para dados de vendas com filtros"""
    city_filter = request.GET.get('city', 'all')
    company_filter = request.GET.get('company', 'all')
    store_filter = request.GET.get('store', 'all')
    product_filter = request.GET.get('product', 'all')
    
    # Query base - agrupar vendas por mês e país
    sales = Sale.objects.select_related('store', 'product')
    
    # Aplicar filtros
    if city_filter != 'all':
        sales = sales.filter(store__city=city_filter)
    
    if company_filter != 'all':
        sales = sales.filter(store__company__company_id=company_filter)
    
    if store_filter != 'all':
        sales = sales.filter(store__store_id=store_filter)
    
    if product_filter != 'all':
        sales = sales.filter(product__category__name=product_filter)
    
    # Agrupar por mês e país
    sales_by_month = {}
    for sale in sales:
        month = sale.month
        country = sale.store.country.lower()
        
        if month not in sales_by_month:
            sales_by_month[month] = {
                'month': month,
                'germany': 0,
                'france': 0,
                'italy': 0,
                'spain': 0,
                'netherlands': 0,
            }
        
        if country in sales_by_month[month]:
            sales_by_month[month][country] += float(sale.total_amount)
    
    data = list(sales_by_month.values())
    return JsonResponse({'data': data})


@login_required
def company_list(request):
    """View para listar empresas"""
    country_filter = request.GET.get('country', 'all')
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    
    companies = Company.objects.all()
    
    if country_filter != 'all':
        companies = companies.filter(country=country_filter)
    
    if status_filter != 'all':
        companies = companies.filter(status=status_filter)
    
    if search_query:
        companies = companies.filter(
            Q(name__icontains=search_query) |
            Q(company_id__icontains=search_query) |
            Q(city__icontains=search_query)
        )
    
    # Preparar dados
    companies_data = []
    for company in companies:
        linked_companies = company.get_linked_companies()
        parent_name = company.parent.name if company.parent else None
        
        companies_data.append({
            'id': company.company_id,
            'name': company.name,
            'parent_id': company.parent.company_id if company.parent else None,
            'parent_name': parent_name,
            'country': company.country,
            'city': company.city,
            'status': company.status,
            'ownership': company.ownership_percentage,
            'linked_count': linked_companies.count(),
        })
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'companies': companies_data})
    
    return render(request, 'companies.html', {
        'companies': companies_data,
    })


@login_required
def company_details(request, company_id):
    """API para detalhes de uma empresa"""
    company = get_object_or_404(Company, company_id=company_id)
    
    # Obter empresas vinculadas
    linked_companies = []
    for linked in company.get_linked_companies():
        linked_companies.append({
            'id': linked.company_id,
            'name': linked.name,
            'city': linked.city,
            'country': linked.country,
            'ownership': linked.ownership_percentage,
            'status': linked.status,
        })
    
    data = {
        'id': company.company_id,
        'name': company.name,
        'country': company.country,
        'city': company.city,
        'status': company.status,
        'ownership': company.ownership_percentage,
        'parent_id': company.parent.company_id if company.parent else None,
        'parent_name': company.parent.name if company.parent else None,
        'linked_companies': linked_companies,
    }
    
    return JsonResponse(data)


@login_required
@require_http_methods(["POST"])
def company_create(request):
    """Criar nova empresa"""
    data = json.loads(request.body)
    
    # Gerar ID automático
    last_company = Company.objects.order_by('-company_id').first()
    if last_company:
        last_num = int(last_company.company_id.split('-')[1])
        new_id = f"COM-{str(last_num + 1).zfill(3)}"
    else:
        new_id = "COM-001"
    
    company = Company.objects.create(
        company_id=new_id,
        name=data['name'],
        country=data['country'],
        city=data['city'],
        parent_id=data.get('parent_id') or None,
        ownership_percentage=data.get('ownership', 100),
        status=data.get('status', 'active'),
    )
    
    return JsonResponse({
        'success': True,
        'company_id': company.company_id,
        'message': 'Company created successfully'
    })


@login_required
@require_http_methods(["POST"])
def company_update(request, company_id):
    """Atualizar empresa existente"""
    company = get_object_or_404(Company, company_id=company_id)
    data = json.loads(request.body)
    
    company.name = data.get('name', company.name)
    company.country = data.get('country', company.country)
    company.city = data.get('city', company.city)
    company.parent_id = data.get('parent_id') or None
    company.ownership_percentage = data.get('ownership', company.ownership_percentage)
    company.status = data.get('status', company.status)
    company.save()
    
    return JsonResponse({
        'success': True,
        'message': 'Company updated successfully'
    })


@login_required
@require_http_methods(["POST"])
def company_delete(request, company_id):
    """Deletar empresa"""
    company = get_object_or_404(Company, company_id=company_id)
    
    # Verificar se tem subsidiárias
    if company.get_linked_companies().exists():
        return JsonResponse({
            'success': False,
            'message': 'Cannot delete company with linked subsidiaries'
        }, status=400)
    
    company.delete()
    
    return JsonResponse({
        'success': True,
        'message': 'Company deleted successfully'
    })


@login_required
@require_http_methods(["POST"])
def company_merge(request):
    """Mesclar duas empresas"""
    data = json.loads(request.body)
    source_id = data.get('source_company_id')
    target_id = data.get('target_company_id')
    
    source = get_object_or_404(Company, company_id=source_id)
    target = get_object_or_404(Company, company_id=target_id)
    
    # Transferir todas as lojas da source para target
    Store.objects.filter(company=source).update(company=target)
    
    # Transferir subsidiárias
    Company.objects.filter(parent=source).update(parent=target)
    
    # Deletar source company
    source.delete()
    
    return JsonResponse({
        'success': True,
        'message': f'Successfully merged {source.name} into {target.name}'
    })


@login_required
def export_inventory(request):
    """Exportar inventário para CSV"""
    format_type = request.GET.get('format', 'csv')
    
    inventory_items = Inventory.objects.select_related('product', 'store').all()
    
    if format_type == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inventory.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['SKU', 'Product Name', 'Category', 'Store', 'Quantity', 'Price'])
        
        for item in inventory_items:
            writer.writerow([
                item.product.sku,
                item.product.name,
                item.product.category.name if item.product.category else 'N/A',
                item.store.name,
                item.quantity,
                item.product.price,
            ])
        
        return response
    
    # Adicionar outros formatos (PDF, Excel) conforme necessário
    return JsonResponse({'error': 'Invalid format'}, status=400)


@login_required
def sales_page(request):
    """View para página de Sales Analytics"""
    return render(request, 'sales.html')


@login_required
def ai_reports_view(request):
    """View para página de AI Reports"""
    return render(request, 'ai_reports.html')


@login_required
def sales_analytics_api(request):
    """API para dados de sales analytics"""
    from django_supply.models import Competitor, Sector, ProductSales, SalesMetrics
    from decimal import Decimal
    from datetime import datetime
    
    company_name = request.GET.get('company_name', '')
    sector_filter = request.GET.get('sector', 'all')
    country_filter = request.GET.get('country', 'all')
    year = int(request.GET.get('year', datetime.now().year))
    
    if not company_name:
        return JsonResponse({'success': False, 'message': 'Company name required'}, status=400)
    
    # Buscar empresa
    try:
        company = Company.objects.get(name__icontains=company_name)
    except Company.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Company not found'}, status=404)
    
    # Determinar setor da empresa (simplificado)
    sector_name = 'Technology'  # Default
    try:
        sector = Sector.objects.get(name=sector_name)
    except Sector.DoesNotExist:
        sector = Sector.objects.create(name=sector_name, description='Technology Sector')
    
    # Calcular métricas YTD
    sales_metrics = SalesMetrics.objects.filter(company=company, year=year)
    
    revenue_ytd = sum(float(m.revenue) for m in sales_metrics)
    profit_ytd = sum(float(m.profit) for m in sales_metrics)
    
    # Cálculo de predição (15% de crescimento sobre YTD atual)
    prediction_next_ytd = revenue_ytd * 1.15
    
    # Percentuais de mudança (exemplo fixo)
    revenue_change = 12.5
    profit_change = 8.3
    prediction_growth = 15.0
    
    # Buscar concorrentes do mesmo setor
    competitors_data = []
    
    # Adicionar nossa empresa
    try:
        our_competitor = Competitor.objects.get(name=company.name, is_our_company=True)
    except Competitor.DoesNotExist:
        our_competitor = Competitor.objects.create(
            name=company.name,
            sector=sector,
            country=company.country,
            revenue_ytd=Decimal(str(revenue_ytd)),
            profit_ytd=Decimal(str(profit_ytd)),
            market_share=Decimal('25.5'),
            is_our_company=True
        )
    
    # Buscar outros concorrentes
    competitors = Competitor.objects.filter(sector=sector).order_by('-revenue_ytd')
    
    for comp in competitors:
        competitors_data.append({
            'name': comp.name,
            'country': comp.country,
            'revenue_ytd': float(comp.revenue_ytd),
            'profit_ytd': float(comp.profit_ytd),
            'market_share': float(comp.market_share),
            'is_our_company': comp.is_our_company,
        })
    
    # Top produtos mais vendidos
    product_sales = ProductSales.objects.filter(
        company=company,
        year=year
    ).select_related('product').order_by('-units_sold')[:5]
    
    top_products = []
    for ps in product_sales:
        top_products.append({
            'name': ps.product.name,
            'sku': ps.product.sku,
            'category': ps.product.category.name if ps.product.category else 'N/A',
            'units_sold': ps.units_sold,
            'revenue': float(ps.revenue),
        })
    
    # Se não houver produtos, criar dados de exemplo
    if not top_products:
        example_products = Product.objects.all()[:5]
        for i, prod in enumerate(example_products):
            top_products.append({
                'name': prod.name,
                'sku': prod.sku,
                'category': prod.category.name if prod.category else 'N/A',
                'units_sold': 1000 - (i * 150),
                'revenue': float(prod.price) * (1000 - (i * 150)),
            })
    
    return JsonResponse({
        'success': True,
        'company': {
            'name': company.name,
            'sector': sector_name,
            'country': company.country,
        },
        'metrics': {
            'revenue_ytd': revenue_ytd,
            'profit_ytd': profit_ytd,
            'prediction_next_ytd': prediction_next_ytd,
            'revenue_change': revenue_change,
            'profit_change': profit_change,
            'prediction_growth': prediction_growth,
        },
        'ranking': competitors_data,
        'top_products': top_products,
    })