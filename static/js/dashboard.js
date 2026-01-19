// Dashboard JavaScript

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    loadInventory();
});

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to clicked menu item
    event.target.closest('.menu-item').classList.add('active');
    
    // Load data for specific sections
    if (sectionName === 'companies') {
        loadCompanies();
    } else if (sectionName === 'dashboard') {
        loadInventory();
    }
}

// Load inventory data
async function loadInventory() {
    try {
        const response = await fetch('/api/inventory/');
        const result = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>SKU</th><th>Product Name</th><th>Category</th>';
        html += '<th>Store</th><th>Stock</th><th>Price (€)</th><th>Status</th>';
        html += '<th>Location</th></tr></thead><tbody>';
        
        result.data.forEach(item => {
            html += `<tr>
                <td style="font-family: monospace;">${item.sku}</td>
                <td style="font-weight: 500;">${item.name}</td>
                <td>${item.category}</td>
                <td>${item.store}</td>
                <td style="font-weight: 600;">${item.stock}</td>
                <td>€${item.price.toFixed(2)}</td>
                <td><span class="status-badge ${item.status}">${item.status.replace('-', ' ')}</span></td>
                <td><button class="btn btn-primary" onclick="viewWarehouseLocation('${item.sku}', '${item.store}')">View</button></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        document.getElementById('inventory-table').innerHTML = html;
    } catch (error) {
        console.error('Error loading inventory:', error);
        document.getElementById('inventory-table').innerHTML = '<div class="loading">Error loading inventory data</div>';
    }
}

// Load companies data
async function loadCompanies() {
    try {
        const response = await fetch('/companies/', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const result = await response.json();
        
        let html = '<div class="table-container"><table><thead><tr>';
        html += '<th>Company ID</th><th>Name</th><th>Parent Company</th>';
        html += '<th>Location</th><th>Ownership %</th><th>Status</th><th>Actions</th>';
        html += '</tr></thead><tbody>';
        
        result.companies.forEach(company => {
            html += `<tr>
                <td style="font-family: monospace;">${company.id}</td>
                <td style="font-weight: 600;">${company.name}</td>
                <td>${company.parent_name || '<em style="color: #9ca3af;">Main Company</em>'}</td>
                <td>${company.city}, ${company.country}</td>
                <td>${company.ownership}%</td>
                <td><span class="status-badge in-stock">${company.status}</span></td>
                <td><button class="btn btn-primary" onclick="viewCompany('${company.id}')">Details</button></td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        document.getElementById('companies-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading companies:', error);
        document.getElementById('companies-content').innerHTML = '<div class="loading">Error loading companies data</div>';
    }
}

// View warehouse location
function viewWarehouseLocation(sku, store) {
    alert(`Viewing warehouse location for ${sku} at ${store}\n\nThis will show Aisles > Shelves > Boxes`);
    // Implementar modal com dados da API /api/warehouse/<sku>/
}

// View company details
function viewCompany(companyId) {
    alert(`Viewing details for company ${companyId}\n\nThis will show linked companies and details`);
    // Implementar modal com dados da API /api/company/<company_id>/
}
