#!/usr/bin/env python
"""
Script para corrigir a visualização de inventário
Transforma dados da API no formato esperado pelo frontend
"""

print("""
// Fix renderInventoryTable function to handle API response format
// Original data from /api/inventory/: 
// { product_name, product_sku, store_name, store_id, quantity }
// 
// Frontend expects: 
// { sku, name, category, store, stock, price, status }
// 
// Solution: Transform data in loadInventory()

// Add this after: allInventoryData = result.results || result.data || [];

allInventoryData = (result.results || result.data || []).map(item => ({
    sku: item.product_sku || 'N/A',
    name: item.product_name || 'N/A',
    category: 'General',  // API doesn't return category
    store: item.store_name || 'N/A',
    stock: item.quantity || 0,
    price: 0,  // API doesn't return price
    status: item.quantity > 0 ? 'in-stock' : 'out-of-stock'
}));
""")
