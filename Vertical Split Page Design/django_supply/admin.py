from django.contrib import admin
from .models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, Sale, DashboardMetrics
)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['company_id', 'name', 'parent', 'country', 'city', 'status', 'ownership_percentage']
    list_filter = ['status', 'country']
    search_fields = ['company_id', 'name', 'city']


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ['store_id', 'name', 'company', 'city', 'country', 'is_active']
    list_filter = ['is_active', 'country']
    search_fields = ['store_id', 'name', 'city']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['sku', 'name', 'category', 'price', 'status']
    list_filter = ['status', 'category']
    search_fields = ['sku', 'name']


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ['warehouse_id', 'name', 'store']
    search_fields = ['warehouse_id', 'name']


@admin.register(WarehouseLocation)
class WarehouseLocationAdmin(admin.ModelAdmin):
    list_display = ['warehouse', 'product', 'aisle', 'shelf', 'box', 'quantity', 'last_updated']
    list_filter = ['warehouse', 'aisle']
    search_fields = ['product__sku', 'product__name']


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'store', 'quantity', 'last_restocked']
    list_filter = ['store']
    search_fields = ['product__sku', 'product__name']


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['sale_id', 'product', 'store', 'quantity', 'total_amount', 'sale_date']
    list_filter = ['sale_date', 'store']
    search_fields = ['product__name', 'store__name']


@admin.register(DashboardMetrics)
class DashboardMetricsAdmin(admin.ModelAdmin):
    list_display = ['metric_date', 'total_revenue', 'total_orders', 'total_products', 'active_customers']
    list_filter = ['metric_date']
