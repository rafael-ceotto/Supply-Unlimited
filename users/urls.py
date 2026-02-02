# users/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    
    # APIs de dados
    path('api/inventory/', views.inventory_data, name='inventory_data'),
    path('api/warehouse/<str:sku>/', views.warehouse_location_data, name='warehouse_location'),
    path('api/sales/', views.sales_data, name='sales_data'),
    path('api/companies/', views.companies_api, name='companies_api'),
    
    # Gerenciamento de empresas
    path('api/companies/', views.companies_api, name='companies_api'),
    path('create-company/', views.company_create, name='company_create'),
    path('companies/', views.company_list, name='company_list'),
    path('api/company/<str:company_id>/', views.company_details, name='company_details'),
    path('api/company/<str:company_id>/update/', views.company_update, name='company_update'),
    path('api/company/<str:company_id>/delete/', views.company_delete, name='company_delete'),
    path('api/company/merge/', views.company_merge, name='company_merge'),
    
    # Exportação
    path('export/inventory/', views.export_inventory, name='export_inventory'),
    
    # User endpoints
    path('api/user/current/', views.CurrentUserViewSet.as_view({'get': 'current'}), name='user-current'),
    
    # RBAC API routes (sem include para evitar conflito com routers)
    path('api/rbac/permissions/', views.PermissionViewSet.as_view({'get': 'list'}), name='permissions-list'),
    path('api/rbac/roles/', views.RoleViewSet.as_view({'get': 'list', 'post': 'create'}), name='roles-list'),
    path('api/rbac/user-roles/', views.UserRoleViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-roles-list'),
    path('api/rbac/user-roles/my_role/', views.UserRoleViewSet.as_view({'get': 'my_role'}), name='user-role-my'),
    path('api/rbac/users/', views.UserDetailViewSet.as_view({'get': 'list'}), name='users-list'),
    path('api/rbac/users/me/', views.UserDetailViewSet.as_view({'get': 'me'}), name='user-me'),
    path('api/rbac/audit-logs/', views.AuditLogViewSet.as_view({'get': 'list'}), name='audit-logs-list'),
    path('api/rbac/audit-logs/my_logs/', views.AuditLogViewSet.as_view({'get': 'my_logs'}), name='audit-logs-my'),
    
    # Notifications API routes
    path('api/notifications/', views.NotificationViewSet.as_view({'get': 'list', 'post': 'create'}), name='notifications-list'),
    path('api/notifications/<int:pk>/', views.NotificationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='notification-detail'),
    path('api/notifications/<int:pk>/mark_as_read/', views.NotificationViewSet.as_view({'post': 'mark_as_read'}), name='notification-mark-read'),
    path('api/notifications/mark_all_read/', views.NotificationViewSet.as_view({'post': 'mark_all_read'}), name='notifications-mark-all-read'),
    path('api/notifications/unread_count/', views.NotificationViewSet.as_view({'get': 'unread_count'}), name='notifications-unread-count'),
    path('api/notifications/unread/', views.NotificationViewSet.as_view({'get': 'unread'}), name='notifications-unread'),
]
