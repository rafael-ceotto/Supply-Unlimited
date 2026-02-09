from django.db import models
from django.contrib.auth.models import User


class Company(models.Model):
    """Model for companies and their branches"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]
    
    company_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subsidiaries'
    )
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    ownership_percentage = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.company_id})"
    
    def get_linked_companies(self):
        """Returns all linked companies (subsidiaries)"""
        return self.subsidiaries.all()


class Store(models.Model):
    """Model for physical stores"""
    store_id = models.CharField(max_length=20, unique=True, primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.city}"


class Category(models.Model):
    """Model for product categories"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Model for products"""
    STATUS_CHOICES = [
        ('in-stock', 'In Stock'),
        ('low-stock', 'Low Stock'),
        ('out-of-stock', 'Out of Stock'),
    ]
    
    sku = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in-stock')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.sku})"


class Warehouse(models.Model):
    """Model for warehouse/storage facility"""
    warehouse_id = models.CharField(max_length=20, unique=True, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='warehouses')
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.name} - {self.store.name}"


class WarehouseLocation(models.Model):
    """Model for specific warehouse location (Aisle -> Shelf -> Box)"""
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='locations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    aisle = models.CharField(max_length=10)
    shelf = models.CharField(max_length=10)
    box = models.CharField(max_length=10)
    quantity = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['warehouse', 'product', 'aisle', 'shelf', 'box']
        ordering = ['aisle', 'shelf', 'box']
    
    def __str__(self):
        return f"{self.product.sku} - Aisle {self.aisle}, Shelf {self.shelf}, Box {self.box}"


class Inventory(models.Model):
    """Model for product stock in stores"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    last_restocked = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'store']
        verbose_name_plural = "Inventories"
    
    def __str__(self):
        return f"{self.product.name} at {self.store.name}: {self.quantity}"


class Sale(models.Model):
    """Model for sales"""
    sale_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateTimeField(auto_now_add=True)
    month = models.CharField(max_length=20)  # E.g.: "Jan", "Feb"
    year = models.IntegerField()
    
    def __str__(self):
        return f"Sale #{self.sale_id} - {self.product.name}"
    
    def save(self, *args, **kwargs):
        # Auto-update month and year
        if not self.month:
            self.month = self.sale_date.strftime('%b')
        if not self.year:
            self.year = self.sale_date.year
        super().save(*args, **kwargs)


class DashboardMetrics(models.Model):
    """Model for dashboard metrics"""
    metric_date = models.DateField(unique=True)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    total_products = models.IntegerField(default=0)
    active_customers = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-metric_date']
    
    def __str__(self):
        return f"Metrics for {self.metric_date}"


# ============================================
# RBAC (Role-Based Access Control) Models
# ============================================

class Permission(models.Model):
    """Model for granular permissions"""
    PERMISSION_CHOICES = [
        ('view_dashboard', 'View Dashboard'),
        ('view_companies', 'View Companies'),
        ('edit_companies', 'Edit Companies'),
        ('delete_companies', 'Delete Companies'),
        ('view_inventory', 'View Inventory'),
        ('edit_inventory', 'Edit Inventory'),
        ('delete_inventory', 'Delete Inventory'),
        ('view_sales', 'View Sales'),
        ('edit_sales', 'Edit Sales'),
        ('delete_sales', 'Delete Sales'),
        ('view_ai_reports', 'View AI Reports'),
        ('create_ai_reports', 'Create AI Reports'),
        ('use_ai_agents', 'Use AI Agents'),
        ('export_reports', 'Export Reports'),
        ('view_audit_log', 'View Audit Log'),
        ('manage_users', 'Manage Users'),
        ('manage_roles', 'Manage Roles'),
    ]
    
    code = models.CharField(max_length=50, unique=True, primary_key=True, choices=PERMISSION_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['code']
    
    def __str__(self):
        return f"{self.get_code_display()}"


class Role(models.Model):
    """Model for user roles"""
    ROLE_TYPE_CHOICES = [
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('analyst', 'Analyst'),
        ('viewer', 'Viewer'),
        ('custom', 'Custom Role'),
    ]
    
    role_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    role_type = models.CharField(max_length=20, choices=ROLE_TYPE_CHOICES, default='custom')
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(Permission, blank=True, related_name='roles')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name}"
    
    def has_permission(self, permission_code):
        """Checks if the role has a specific permission"""
        return self.permissions.filter(code=permission_code).exists()


class UserRole(models.Model):
    """Model to link users to roles (many-to-many with history)"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_role')
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='users')
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_roles'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-assigned_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.role.name}"
    
    def has_permission(self, permission_code):
        """Checks if the user (through the role) has a permission"""
        if not self.is_active:
            return False
        return self.role.has_permission(permission_code)


class Notification(models.Model):
    """Model for user notifications"""
    NOTIFICATION_TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('report_ready', 'Report Ready'),
        ('report_error', 'Report Error'),
        ('role_changed', 'Role Changed'),
        ('permission_denied', 'Permission Denied'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Referência para objeto relacionado (opcional)
    related_object_type = models.CharField(max_length=100, blank=True)  # Ex: 'ChatSession', 'Company'
    related_object_id = models.CharField(max_length=100, blank=True)
    
    # URL opcional para redirecionar ao clicar
    redirect_url = models.URLField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    def mark_as_read(self):
        """Marks notification as read"""
        self.is_read = True
        self.save()
    
    @classmethod
    def create_notification(cls, user, title, message, notification_type='info', 
                          related_object_type='', related_object_id='', redirect_url=''):
        """
        Helper method to create notification
        
        Args:
            user: User instance
            title: Notification title
            message: Detailed message
            notification_type: Type of notification
            related_object_type: Type of related object
            related_object_id: ID of related object
            redirect_url: URL to redirect when clicked
        """
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            related_object_type=related_object_type,
            related_object_id=related_object_id,
            redirect_url=redirect_url
        )


class AuditLog(models.Model):
    """Model for action tracking (audit trail)"""
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('read', 'Read'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('export', 'Export'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('permission_change', 'Permission Change'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    object_type = models.CharField(max_length=100)  # Ex: 'ChatSession', 'Company', 'Product'
    object_id = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.action} on {self.object_type}"
