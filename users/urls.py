# users/urls.py
from django.urls import path
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
]
