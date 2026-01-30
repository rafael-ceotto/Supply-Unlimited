from django.db import models
from django.contrib.auth.models import User


class Company(models.Model):
    """Modelo para empresas e suas filiais"""
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
        """Retorna todas as empresas vinculadas (subsidiárias)"""
        return self.subsidiaries.all()


class Store(models.Model):
    """Modelo para lojas físicas"""
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
    """Modelo para categorias de produtos"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Modelo para produtos"""
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
    """Modelo para warehouse/armazém"""
    warehouse_id = models.CharField(max_length=20, unique=True, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='warehouses')
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.name} - {self.store.name}"


class WarehouseLocation(models.Model):
    """Modelo para localização específica no warehouse (Aisle -> Shelf -> Box)"""
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
    """Modelo para estoque de produtos nas lojas"""
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
    """Modelo para vendas"""
    sale_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateTimeField(auto_now_add=True)
    month = models.CharField(max_length=20)  # Ex: "Jan", "Feb"
    year = models.IntegerField()
    
    def __str__(self):
        return f"Sale #{self.sale_id} - {self.product.name}"
    
    def save(self, *args, **kwargs):
        # Atualizar mês e ano automaticamente
        if not self.month:
            self.month = self.sale_date.strftime('%b')
        if not self.year:
            self.year = self.sale_date.year
        super().save(*args, **kwargs)


class DashboardMetrics(models.Model):
    """Modelo para métricas do dashboard"""
    metric_date = models.DateField(unique=True)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    total_products = models.IntegerField(default=0)
    active_customers = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-metric_date']
    
    def __str__(self):
        return f"Metrics for {self.metric_date}"


class Sector(models.Model):
    """Modelo para setores de mercado"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name


class Competitor(models.Model):
    """Modelo para empresas concorrentes"""
    name = models.CharField(max_length=200)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name='competitors')
    country = models.CharField(max_length=100)
    revenue_ytd = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    profit_ytd = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    market_share = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # Percentage
    is_our_company = models.BooleanField(default=False)  # Marca nossa empresa
    
    class Meta:
        ordering = ['-revenue_ytd']
    
    def __str__(self):
        return f"{self.name} - {self.sector.name}"


class SalesMetrics(models.Model):
    """Modelo para métricas de vendas por empresa"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='sales_metrics')
    year = models.IntegerField()
    month = models.IntegerField()
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    profit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    units_sold = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['company', 'year', 'month']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.company.name} - {self.year}/{self.month}"


class ProductSales(models.Model):
    """Modelo para vendas por produto"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    year = models.IntegerField()
    month = models.IntegerField()
    units_sold = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ['product', 'company', 'year', 'month']
        ordering = ['-units_sold']
    
    def __str__(self):
        return f"{self.product.name} - {self.company.name}"