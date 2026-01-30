"""
Script para popular dados de Sales Analytics
Execute com: python manage.py populate_sales_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
import random

from django_supply.models import (
    Company, Product, Sector, Competitor,
    SalesMetrics, ProductSales
)


class Command(BaseCommand):
    help = 'Popula dados de Sales Analytics'

    def handle(self, *args, **options):
        self.stdout.write('Populando dados de Sales Analytics...')

        # Criar setores
        sectors_data = [
            ('Technology', 'Technology and software companies'),
            ('Industrial', 'Industrial manufacturing and equipment'),
            ('Logistics', 'Logistics and supply chain services'),
        ]

        sectors = {}
        for name, description in sectors_data:
            sector, created = Sector.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
            sectors[name] = sector
            if created:
                self.stdout.write(f'  ✓ Setor criado: {name}')

        # Criar concorrentes para cada setor
        competitors_data = [
            # Technology Sector
            ('TechCorp EU', 'Technology', 'Germany', 2850000, 520000, 25.5, True),
            ('Digital Solutions AG', 'Technology', 'Germany', 3200000, 580000, 28.8, False),
            ('Innovation Tech SAS', 'Technology', 'France', 2100000, 380000, 18.9, False),
            ('Smart Systems Ltd', 'Technology', 'Netherlands', 1800000, 320000, 16.2, False),
            ('FutureTech Italia', 'Technology', 'Italy', 1200000, 210000, 10.6, False),
            
            # Industrial Sector
            ('Global Industries', 'Industrial', 'Italy', 1950000, 350000, 22.1, False),
            ('Euro Manufacturing', 'Industrial', 'Germany', 2400000, 430000, 27.2, False),
            ('Industrial Plus', 'Industrial', 'Spain', 1600000, 285000, 18.1, False),
            ('MegaFactory BV', 'Industrial', 'Netherlands', 2850000, 510000, 32.6, False),
            
            # Logistics Sector
            ('FastLog Europe', 'Logistics', 'France', 1750000, 315000, 21.5, False),
            ('SupplyChain Pro', 'Logistics', 'Germany', 2100000, 378000, 25.8, False),
            ('TransportMaster', 'Logistics', 'Spain', 1350000, 243000, 16.6, False),
        ]

        for name, sector_name, country, revenue, profit, market_share, is_ours in competitors_data:
            Competitor.objects.get_or_create(
                name=name,
                sector=sectors[sector_name],
                defaults={
                    'country': country,
                    'revenue_ytd': Decimal(str(revenue)),
                    'profit_ytd': Decimal(str(profit)),
                    'market_share': Decimal(str(market_share)),
                    'is_our_company': is_ours,
                }
            )

        self.stdout.write(f'  ✓ {len(competitors_data)} concorrentes criados')

        # Criar métricas de vendas para as empresas
        companies = Company.objects.all()
        current_year = timezone.now().year

        for company in companies:
            for month in range(1, 13):
                base_revenue = random.uniform(150000, 350000)
                profit_margin = random.uniform(0.15, 0.25)
                
                SalesMetrics.objects.get_or_create(
                    company=company,
                    year=current_year,
                    month=month,
                    defaults={
                        'revenue': Decimal(str(base_revenue)),
                        'profit': Decimal(str(base_revenue * profit_margin)),
                        'units_sold': random.randint(500, 1500),
                    }
                )

        self.stdout.write(f'  ✓ Métricas de vendas criadas para {companies.count()} empresas')

        # Criar vendas por produto
        products = Product.objects.all()
        
        for company in companies:
            for product in products[:10]:  # Top 10 produtos
                for month in range(1, 13):
                    units_sold = random.randint(50, 300)
                    
                    ProductSales.objects.get_or_create(
                        product=product,
                        company=company,
                        year=current_year,
                        month=month,
                        defaults={
                            'units_sold': units_sold,
                            'revenue': product.price * units_sold,
                        }
                    )

        self.stdout.write(self.style.SUCCESS('✓ Dados de Sales Analytics populados com sucesso!'))
        self.stdout.write(f'  - {Sector.objects.count()} setores')
        self.stdout.write(f'  - {Competitor.objects.count()} concorrentes')
        self.stdout.write(f'  - {SalesMetrics.objects.count()} métricas de vendas')
        self.stdout.write(f'  - {ProductSales.objects.count()} vendas por produto')
