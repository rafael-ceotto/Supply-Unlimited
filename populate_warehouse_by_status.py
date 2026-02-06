#!/usr/bin/env python
"""
Populate warehouse locations based on inventory status:
- in-stock: Full warehouse locations
- low-stock: Limited warehouse locations
- out-of-stock: No locations
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from supply_unlimited.sales.django_supply.models import Inventory, Product, WarehouseLocation, Warehouse, Store

def populate_warehouse_locations():
    """Populate warehouse locations based on inventory status"""
    
    # Get all inventories
    inventories = Inventory.objects.select_related('product', 'store').all()
    
    print(f"Processing {inventories.count()} inventory items...")
    print()
    
    in_stock_count = 0
    low_stock_count = 0
    out_of_stock_count = 0
    
    for inv in inventories:
        # Delete existing warehouse locations for this product in this store
        existing = WarehouseLocation.objects.filter(
            product=inv.product,
            warehouse__store=inv.store
        )
        existing_count = existing.count()
        existing.delete()
        
        # Determine status based on quantity (matches API calculation)
        if inv.quantity == 0:
            status = 'out-of-stock'
        elif inv.quantity < 10:
            status = 'low-stock'
        else:
            status = 'in-stock'
        
        # Get or create warehouses for this store
        warehouses = Warehouse.objects.filter(store=inv.store)
        
        if not warehouses.exists():
            print(f"  ⚠️  No warehouses found for {inv.store.name}")
            continue
        
        # Populate based on status
        if status == 'in-stock':
            # Full locations - distribute across all warehouses, aisles, shelves
            locations_to_create = []
            items_per_location = max(1, inv.quantity // 6)
            remaining = inv.quantity
            location_count = 0
            
            for warehouse in warehouses:
                for aisle_idx in range(2):  # 2 aisles per warehouse
                    for shelf_idx in range(3):  # 3 shelves per aisle
                        qty = min(items_per_location, remaining)
                        remaining -= qty
                        
                        if qty > 0:
                            locations_to_create.append(
                                WarehouseLocation(
                                    product=inv.product,
                                    warehouse=warehouse,
                                    aisle=f'A{aisle_idx + 1}',
                                    shelf=f'S{shelf_idx + 1}',
                                    box=f'B{shelf_idx + 1}',
                                    quantity=qty
                                )
                            )
                            location_count += 1
                            
                            if remaining == 0:
                                break
                    if remaining == 0:
                        break
                if remaining == 0:
                    break
            
            if locations_to_create:
                WarehouseLocation.objects.bulk_create(locations_to_create)
                print(f"✅ {inv.product.name} (qty: {inv.quantity}) - in-stock - {location_count} locations")
                in_stock_count += 1
            else:
                print(f"⚠️  {inv.product.name} (qty: {inv.quantity}) - in-stock - No locations created")
        
        elif status == 'low-stock':
            # Limited locations - use only 1 warehouse
            locations_to_create = []
            warehouse = warehouses[0]  # Use first warehouse
            
            locations_to_create.append(
                WarehouseLocation(
                    product=inv.product,
                    warehouse=warehouse,
                    aisle='A1',
                    shelf='S1',
                    box='B1',
                    quantity=inv.quantity
                )
            )
            
            WarehouseLocation.objects.bulk_create(locations_to_create)
            print(f"✅ {inv.product.name} (qty: {inv.quantity}) - low-stock - 1 location")
            low_stock_count += 1
        
        elif status == 'out-of-stock':
            # No locations for out of stock
            if existing_count > 0:
                print(f"✅ {inv.product.name} (qty: {inv.quantity}) - out-of-stock - No locations")
                out_of_stock_count += 1
            else:
                print(f"✅ {inv.product.name} (qty: {inv.quantity}) - out-of-stock - No locations")
                out_of_stock_count += 1
    
    print()
    print("✅ Warehouse population complete!")
    print()
    print(f"Summary: {in_stock_count} in-stock, {low_stock_count} low-stock, {out_of_stock_count} out-of-stock")

if __name__ == '__main__':
    populate_warehouse_locations()
