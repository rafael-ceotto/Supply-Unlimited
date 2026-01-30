from django.urls import path
from . import views

urlpatterns = [
    # Autenticação
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Dashboard
    path('dashboard/', views.dashboard_view, name='dashboard'),
    
    # APIs de dados
    path('api/inventory/', views.inventory_data, name='inventory_data'),
    path('api/warehouse/<str:sku>/', views.warehouse_location_data, name='warehouse_location'),
    path('api/sales/', views.sales_data, name='sales_data'),
    
    # Gerenciamento de empresas
    path('companies/', views.company_list, name='company_list'),
    path('api/company/<str:company_id>/', views.company_details, name='company_details'),
    path('api/company/create/', views.company_create, name='company_create'),
    path('api/company/<str:company_id>/update/', views.company_update, name='company_update'),
    path('api/company/<str:company_id>/delete/', views.company_delete, name='company_delete'),
    path('api/company/merge/', views.company_merge, name='company_merge'),
    
    # Exportação
    path('export/inventory/', views.export_inventory, name='export_inventory'),
    
    # Sales Analytics
    path('sales/', views.sales_page, name='sales_page'),
    path('api/sales/', views.sales_analytics_api, name='sales_analytics_api'),
    
    # AI Reports
    path('ai-reports/', views.ai_reports_view, name='ai_reports'),
]