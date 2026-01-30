"""
Script para popular o banco de dados com dados de exemplo
Execute com: python manage.py populate_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
import random

from django_supply.models import (
    Company, Store, Category, Product, Warehouse,
    WarehouseLocation, Inventory, Sale, DashboardMetrics
)


class Command(BaseCommand):
    help = 'Popula o banco de dados com dados de exemplo'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando população do banco de dados...')

        # Limpar dados existentes
        self.stdout.write('Limpando dados antigos...')
        DashboardMetrics.objects.all().delete()
        Sale.objects.all().delete()
        Inventory.objects.all().delete()
        WarehouseLocation.objects.all().delete()
        Warehouse.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Store.objects.all().delete()
        Company.objects.all().delete()

        # Criar empresas
        self.stdout.write('Criando empresas...')
        techcorp = Company.objects.create(
            company_id='COM-001',
            name='TechCorp EU',
            country='Germany',
            city='Berlin',
            status='active',
            ownership_percentage=100
        )

        techcorp_france = Company.objects.create(
            company_id='COM-002',
            name='TechCorp France',
            parent=techcorp,
            country='France',
            city='Paris',
            status='active',
            ownership_percentage=75
        )

        global_industries = Company.objects.create(
            company_id='COM-003',
            name='Global Industries',
            country='Italy',
            city='Rome',
            status='active',
            ownership_percentage=100
        )

        global_spain = Company.objects.create(
            company_id='COM-004',
            name='Global Industries España',
            parent=global_industries,
            country='Spain',
            city='Madrid',
            status='active',
            ownership_percentage=60
        )

        techcorp_netherlands = Company.objects.create(
            company_id='COM-005',
            name='TechCorp Netherlands',
            parent=techcorp,
            country='Netherlands',
            city='Amsterdam',
            status='active',
            ownership_percentage=80
        )

        # Criar lojas
        self.stdout.write('Criando lojas...')
        stores_data = [
            ('STORE-001', techcorp, 'TechCorp Berlin', 'Berlin', 'Germany', 'Hauptstraße 123'),
            ('STORE-002', techcorp_france, 'TechCorp Paris', 'Paris', 'France', 'Rue de la Paix 45'),
            ('STORE-003', global_industries, 'Global Rome', 'Rome', 'Italy', 'Via Roma 78'),
            ('STORE-004', global_spain, 'Global Madrid', 'Madrid', 'Spain', 'Calle Mayor 12'),
            ('STORE-005', techcorp_netherlands, 'TechCorp Amsterdam', 'Amsterdam', 'Netherlands', 'Damrak 90'),
        ]

        stores = {}
        for store_id, company, name, city, country, address in stores_data:
            store = Store.objects.create(
                store_id=store_id,
                company=company,
                name=name,
                city=city,
                country=country,
                address=address,
                is_active=True
            )
            stores[country] = store

        # Criar categorias
        self.stdout.write('Criando categorias...')
        categories_data = [
            ('Electronics', 'Electronic devices and components'),
            ('Furniture', 'Office and home furniture'),
            ('Office Supplies', 'Stationery and office materials'),
            ('Industrial', 'Industrial equipment and tools'),
        ]

        categories = {}
        for name, description in categories_data:
            category = Category.objects.create(name=name, description=description)
            categories[name] = category

        # Criar produtos
        self.stdout.write('Criando produtos...')
        products_data = [
            ('SUP-001-DE', 'Industrial Drill Kit', 'Industrial', 299.99),
            ('SUP-002-FR', 'Office Chair Premium', 'Furniture', 189.50),
            ('SUP-003-IT', 'Laptop Stand Adjustable', 'Electronics', 79.99),
            ('SUP-004-ES', 'Printer Paper A4 (500 sheets)', 'Office Supplies', 12.99),
            ('SUP-005-NL', 'LED Monitor 27 inch', 'Electronics', 349.00),
            ('SUP-006-DE', 'Standing Desk Electric', 'Furniture', 599.99),
            ('SUP-007-FR', 'Wireless Mouse', 'Electronics', 29.99),
            ('SUP-008-IT', 'Office Desk Lamp', 'Office Supplies', 45.50),
            ('SUP-009-ES', 'Ergonomic Keyboard', 'Electronics', 89.99),
            ('SUP-010-NL', 'Filing Cabinet', 'Furniture', 199.00),
        ]

        products = {}
        for sku, name, category_name, price in products_data:
            # Determinar status baseado no estoque que criaremos depois
            stock_level = random.randint(0, 250)
            if stock_level > 20:
                status = 'in-stock'
            elif stock_level > 0:
                status = 'low-stock'
            else:
                status = 'out-of-stock'

            product = Product.objects.create(
                sku=sku,
                name=name,
                category=categories[category_name],
                price=Decimal(str(price)),
                status=status,
                description=f'High-quality {name.lower()}'
            )
            products[sku] = product

        # Criar warehouses
        self.stdout.write('Criando warehouses...')
        warehouses = {}
        for store_id, store in [('STORE-001', stores['Germany']), 
                                ('STORE-002', stores['France']),
                                ('STORE-003', stores['Italy']),
                                ('STORE-004', stores['Spain']),
                                ('STORE-005', stores['Netherlands'])]:
            warehouse = Warehouse.objects.create(
                warehouse_id=f'WH-{store_id[-3:]}',
                store=store,
                name=f'Main Warehouse - {store.city}'
            )
            warehouses[store.country] = warehouse

        # Criar warehouse locations (Aisles, Shelves, Boxes)
        self.stdout.write('Criando warehouse locations...')
        aisles = ['A1', 'A2', 'A3']
        shelves = ['S1', 'S2', 'S3']
        boxes = ['B01', 'B02', 'B03']

        for product in Product.objects.all():
            # Escolher warehouse aleatório
            warehouse = random.choice(list(warehouses.values()))
            
            # Criar múltiplas localizações para cada produto
            num_locations = random.randint(3, 8)
            for _ in range(num_locations):
                aisle = random.choice(aisles)
                shelf = random.choice(shelves)
                box = random.choice(boxes)
                quantity = random.randint(2, 50)
                
                try:
                    WarehouseLocation.objects.create(
                        warehouse=warehouse,
                        product=product,
                        aisle=aisle,
                        shelf=shelf,
                        box=box,
                        quantity=quantity
                    )
                except:
                    pass  # Ignorar duplicatas

        # Criar inventário
        self.stdout.write('Criando inventário...')
        for product in Product.objects.all():
            for store in Store.objects.all():
                quantity = random.randint(0, 250)
                Inventory.objects.create(
                    product=product,
                    store=store,
                    quantity=quantity
                )

        # Criar vendas
        self.stdout.write('Criando vendas...')
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        current_year = timezone.now().year

        for month in months:
            for store in Store.objects.all():
                for _ in range(random.randint(10, 30)):
                    product = random.choice(Product.objects.all())
                    quantity = random.randint(1, 10)
                    total = product.price * quantity

                    Sale.objects.create(
                        product=product,
                        store=store,
                        quantity=quantity,
                        total_amount=total,
                        month=month,
                        year=current_year
                    )

        # Criar métricas do dashboard
        self.stdout.write('Criando métricas do dashboard...')
        DashboardMetrics.objects.create(
            metric_date=timezone.now().date(),
            total_revenue=Decimal('245820.50'),
            total_orders=1834,
            total_products=Product.objects.count(),
            active_customers=342
        )

        self.stdout.write(self.style.SUCCESS('✓ Banco de dados populado com sucesso!'))
        self.stdout.write(f'  - {Company.objects.count()} empresas')
        self.stdout.write(f'  - {Store.objects.count()} lojas')
        self.stdout.write(f'  - {Category.objects.count()} categorias')
        self.stdout.write(f'  - {Product.objects.count()} produtos')
        self.stdout.write(f'  - {Warehouse.objects.count()} warehouses')
        self.stdout.write(f'  - {WarehouseLocation.objects.count()} warehouse locations')
        self.stdout.write(f'  - {Inventory.objects.count()} itens de inventário')
        self.stdout.write(f'  - {Sale.objects.count()} vendas')
