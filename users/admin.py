from django.contrib import admin
from .models import (
    Company, Store, Category, Product, Warehouse, WarehouseLocation,
    Inventory, Sale, DashboardMetrics, Permission, Role, UserRole, AuditLog, Notification
)

# Register existing models
admin.site.register(Company)
admin.site.register(Store)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Warehouse)
admin.site.register(WarehouseLocation)
admin.site.register(Inventory)
admin.site.register(Sale)
admin.site.register(DashboardMetrics)

# Register RBAC models with custom admin classes
@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('code', 'description')
    readonly_fields = ('created_at',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'role_type', 'is_active', 'created_at')
    list_filter = ('role_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('permissions',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'is_active', 'assigned_at', 'assigned_by')
    list_filter = ('role', 'is_active', 'assigned_at')
    search_fields = ('user__username', 'role__name')
    readonly_fields = ('assigned_at',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'object_type', 'timestamp', 'ip_address')
    list_filter = ('action', 'object_type', 'timestamp')
    search_fields = ('user__username', 'description', 'object_id')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
