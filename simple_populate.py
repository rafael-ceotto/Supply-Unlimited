#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')

django.setup()

# Import only the working models
from supply_unlimited.sales.models import Sale
from django.contrib.auth.models import User

def populate_sales_data():
    print('✅ Criando dados de exemplo...')
    
    # Limpar sales antigos
    Sale.objects.all().delete()
    
    # Create sample products and sales
    products = [
        'Wireless Headphones',
        'USB-C Cable',
        'Blue T-Shirt',
        'Black Jeans',
        'Facial Cream',
        'Shampoo',
        'Python Programming Book',
        'Web Development Guide'
    ]
    
    customers = [
        'Amazon EU',
        'TechCorp',
        'Alibaba Europe',
        'Walmart EU',
        'Local Store',
        'Online Customer'
    ]
    
    # Create 30 sample sales
    for i in range(30):
        Sale.objects.create(
            product=random.choice(products),
            customer=random.choice(customers),
            description=f'Sale transaction #{i+1}',
            amount=Decimal(str(round(random.uniform(20, 500), 2)))
        )
    
    print(f'✅ {Sale.objects.count()} sales criadas!')
    
    # List all users
    users = User.objects.all()
    print(f'✅ {users.count()} usuários no sistema:')
    for user in users:
        print(f'  - {user.username} ({user.email})')

if __name__ == '__main__':
    populate_sales_data()
