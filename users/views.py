# users/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.db.models import Sum, Count, Q, F
from django.views.decorators.http import require_http_methods
from datetime import datetime, date
import json
import csv
import io
import pandas as pd

from .forms import CustomUserCreationForm
from .models import (
    Company, Store, Product, Inventory, Sale, 
    WarehouseLocation, Warehouse, DashboardMetrics, Category
)

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            
            if request.POST.get('remember'):                
                request.session.set_expiry(1209600)  # 2 semanas
            else:                
                request.session.set_expiry(0)

            return redirect('dashboard')
        else:
            messages.error(request, "Usuário ou senha inválidos.")
    else:
        form = AuthenticationForm()
    
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)  # Função do Django para fazer logout
    return HttpResponseRedirect('/login/')

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

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Conta criada com sucesso! Você já pode fazer login.')
            return redirect('login')
        else:
            messages.error(request, "Erro ao criar a conta. Verifique os dados.")
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


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
        elif stock_filter == 'Low':
            inventory_items = inventory_items.filter(quantity__lt=50)
        elif stock_filter == 'Medium':
            inventory_items = inventory_items.filter(quantity__gte=50, quantity__lt=200)
        elif stock_filter == 'High':
            inventory_items = inventory_items.filter(quantity__gte=200)
    
    # Preparar dados para resposta
    data = []
    for item in inventory_items[:100]:  # Limitar a 100 itens
        # Determinar status
        if item.quantity >= 200:
            status = 'High'
        elif item.quantity >= 50:
            status = 'Medium'
        else:
            status = 'Low'
        
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
def companies_api(request):
    """API para listar empresas em JSON"""
    companies = Company.objects.all().select_related('parent')
    companies_list = []
    for company in companies:
        companies_list.append({
            'id': str(company.company_id),
            'name': company.name,
            'parent_name': company.parent.name if company.parent else None,
            'city': company.city,
            'country': company.country,
            'ownership': 100 if not company.parent else 50,  # Mock ownership %
            'status': company.status
        })
    return JsonResponse(companies_list, safe=False)


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
    """Exportar inventário em diferentes formatos (CSV, JSON, Parquet)"""
    format_type = request.GET.get('format', 'csv').lower()
    
    # Aplicar filtros
    filters = Q()
    search = request.GET.get('search', '').strip()
    store_filter = request.GET.get('store', '').strip()
    category_filter = request.GET.get('category', '').strip()
    stock_filter = request.GET.get('stock', '').strip()
    city_filter = request.GET.get('city', '').strip()
    company_filter = request.GET.get('company', '').strip()
    
    if search:
        filters &= Q(product__name__icontains=search) | Q(product__sku__icontains=search)
    if store_filter:
        filters &= Q(store__country=store_filter)
    if category_filter:
        filters &= Q(product__category__name=category_filter)
    if city_filter:
        filters &= Q(store__city=city_filter)
    if company_filter:
        filters &= Q(store__company__name=company_filter)
    
    if stock_filter:
        if stock_filter == 'Low':
            filters &= Q(quantity__lt=50)
        elif stock_filter == 'Medium':
            filters &= Q(quantity__gte=50, quantity__lt=200)
        elif stock_filter == 'High':
            filters &= Q(quantity__gte=200)
    
    inventory_items = Inventory.objects.select_related('product', 'store').filter(filters).all()
    
    # Preparar dados
    data = []
    for item in inventory_items:
        data.append({
            'SKU': item.product.sku,
            'Product Name': item.product.name,
            'Category': item.product.category.name if item.product.category else 'N/A',
            'Store': item.store.name,
            'Country': item.store.country,
            'City': item.store.city,
            'Quantity': item.quantity,
            'Price': float(item.product.price),
        })
    
    if format_type == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inventory.csv"'
        
        writer = csv.DictWriter(response, fieldnames=['SKU', 'Product Name', 'Category', 'Store', 'Country', 'City', 'Quantity', 'Price'])
        writer.writeheader()
        writer.writerows(data)
        
        return response
    
    elif format_type == 'json':
        response = HttpResponse(content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="inventory.json"'
        response.write(json.dumps(data, indent=2, default=str))
        return response
    
    return JsonResponse({'error': 'Invalid format. Use: csv or json'}, status=400)

@login_required
def inventory_page(request):
    """View para renderizar a página de Inventory"""
    context = {
        'user': request.user,
    }
    return render(request, 'inventory.html', context)

@login_required
def companies_page(request):
    """View para renderizar a página de Companies"""
    context = {
        'user': request.user,
    }
    return render(request, 'companies.html', context)

@login_required
def reports_page(request):
    """View para renderizar a página de Reports"""
    context = {
        'user': request.user,
    }
    return render(request, 'reports.html', context)

@login_required
def sales_page(request):
    """View para renderizar a página de Sales"""
    context = {
        'user': request.user,
    }
    return render(request, 'sales.html', context)

# ============================================
# RBAC API ViewSets
# ============================================

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import (
    PermissionSerializer, RoleSerializer, UserRoleSerializer,
    UserDetailSerializer, AuditLogSerializer, NotificationSerializer
)
from .models import Permission, Role, UserRole, AuditLog, Notification
from .rbac_utils import require_permission, user_has_permission, log_audit


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para visualizar permissions (read-only)"""
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoleViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar Roles"""
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        """List all roles - anyone can see roles"""
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a specific role"""
        return super().retrieve(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        """Create a new role - requires manage_roles permission"""
        if not user_has_permission(request.user, 'manage_roles'):
            return Response(
                {'error': 'You do not have permission to create roles'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """Update a role - requires manage_roles permission"""
        if not user_has_permission(request.user, 'manage_roles'):
            return Response(
                {'error': 'You do not have permission to edit roles'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a role - requires manage_roles permission"""
        if not user_has_permission(request.user, 'manage_roles'):
            return Response(
                {'error': 'You do not have permission to delete roles'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class UserRoleViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar User Roles (atribuição de roles a usuários)"""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List all user roles - requires manage_users permission"""
        if not user_has_permission(request.user, 'manage_users'):
            return Response(
                {'error': 'You do not have permission to view user roles'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request)
    
    def create(self, request):
        """Assign a role to a user - requires manage_users permission"""
        if not user_has_permission(request.user, 'manage_users'):
            return Response(
                {'error': 'You do not have permission to assign roles'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Log the action
        log_audit(
            request.user,
            'permission_change',
            'UserRole',
            description=f'Assigned role to user {request.data.get("user")}'
        )
        
        return super().create(request)
    
    def update(self, request, *args, **kwargs):
        """Update a user's role - requires manage_users permission"""
        if not user_has_permission(request.user, 'manage_users'):
            return Response(
                {'error': 'You do not have permission to modify roles'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def my_role(self, request):
        """Get current user's role"""
        try:
            user_role = request.user.user_role
            serializer = self.get_serializer(user_role)
            return Response(serializer.data)
        except UserRole.DoesNotExist:
            return Response(
                {'error': 'User does not have a role assigned'},
                status=status.HTTP_404_NOT_FOUND
            )


class UserDetailViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para visualizar detalhes de usuários"""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List users - requires manage_users permission"""
        if not user_has_permission(request.user, 'manage_users'):
            return Response(
                {'error': 'You do not have permission to view users'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user details"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para visualizar Audit Logs"""
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List audit logs - requires view_audit_log permission"""
        if not user_has_permission(request.user, 'view_audit_log'):
            return Response(
                {'error': 'You do not have permission to view audit logs'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request)
    
    @action(detail=False, methods=['get'])
    def my_logs(self, request):
        """Get current user's audit logs"""
        logs = AuditLog.objects.filter(user=request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)


# ============================================
# Notifications ViewSet
# ============================================

class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar notificações do usuário"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retornar apenas notificações do usuário autenticado"""
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marcar notificação como lida"""
        notification = self.get_object()
        notification.mark_as_read()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Marcar todas as notificações como lidas"""
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'marked_as_read': count})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Obter contagem de notificações não lidas"""
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Obter todas as notificações não lidas"""
        notifications = Notification.objects.filter(
            user=request.user,
            is_read=False
        )
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)


class CurrentUserViewSet(viewsets.ViewSet):
    """ViewSet para obter informações do usuário atual"""
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Obter informações do usuário autenticado atual"""
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)