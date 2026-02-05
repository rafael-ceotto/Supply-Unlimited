#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

from supply_unlimited.sales.django_supply.models import Product, Category

# Product names by category - more realistic
PRODUCT_NAMES = {
    'Electronics': [
        'Laptop Pro 15"',
        'Wireless Bluetooth Headphones',
        'USB-C Hub Adapter',
        'Smart Watch Series 5',
        'Portable Power Bank 20000mAh',
    ],
    'Clothing': [
        'Cotton T-Shirt Premium',
        'Denim Jeans Blue',
        'Winter Jacket Wool',
        'Sports Running Shoes',
        'Casual Polo Shirt',
    ],
    'Home & Garden': [
        'LED Ceiling Light 60W',
        'Stainless Steel Cookware Set',
        'Bamboo Cutting Board Set',
        'Modern Floor Lamp',
        'Ceramic Plant Pot Large',
    ],
    'Sports & Outdoors': [
        'Mountain Bike 21-Speed',
        'Yoga Mat Premium',
        'Tennis Racket Graphite',
        'Camping Tent 4-Person',
        'Hiking Backpack 50L',
    ],
    'Tools & Hardware': [
        'Cordless Drill Driver',
        'Stainless Steel Tool Set',
        'Power Circular Saw',
        'Heavy Duty Workbench',
        'Digital Multimeter Pro',
    ],
    'Beauty & Personal Care': [
        'Professional Hair Dryer',
        'Facial Cleansing Kit',
        'Organic Moisturizer Cream',
        'Electric Toothbrush Smart',
        'Shaving Razor Blade Set',
    ],
    'Food & Beverages': [
        'Organic Espresso Coffee Beans',
        'Green Tea Premium Selection',
        'Almond Butter Natural',
        'Dark Chocolate 85% Cocoa',
        'Granola Energy Mix',
    ],
    'Books & Media': [
        'Business Strategy Guide',
        'Python Programming Book',
        'Science Fiction Novel',
        'Historical Documentary DVD',
        'Self-Help Audiobook Pack',
    ],
}

print('\n' + '='*70)
print('🏷️  Atualizando nomes de produtos...')
print('='*70 + '\n')

updated_count = 0
for category_name, product_names in PRODUCT_NAMES.items():
    try:
        category = Category.objects.get(name=category_name)
        products = Product.objects.filter(category=category)
        
        for idx, product in enumerate(products):
            if idx < len(product_names):
                product.name = product_names[idx]
                product.save()
                updated_count += 1
        
        print(f'✓ {category_name}: {len(product_names)} produtos renomeados')
    except Category.DoesNotExist:
        print(f'✗ Categoria {category_name} não encontrada')

print(f'\n✓ Total de produtos atualizados: {updated_count}')
print('='*70 + '\n')
