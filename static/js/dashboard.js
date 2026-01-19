// Dashboard JavaScript
let allInventoryData = [];
let allCompaniesData = [];
let chartInstances = {};

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    loadInventory();
    initializeCharts();
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
    if (event && event.target) {
        event.target.closest('.menu-item')?.classList.add('active');
    }
    
    // Load data for specific sections
    if (sectionName === 'companies') {
        loadCompanies();
    } else if (sectionName === 'dashboard') {
        loadInventory();
    } else if (sectionName === 'sales') {
        loadSalesData();
    }
}

// Initialize Charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        chartInstances.sales = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [
                    {
                        label: 'Germany',
                        data: [45000, 52000, 48000, 61000, 55000, 67000],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'France',
                        data: [38000, 42000, 45000, 48000, 52000, 58000],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Spain',
                        data: [25000, 28000, 32000, 35000, 38000, 42000],
                        borderColor: '#ea580c',
                        backgroundColor: 'rgba(234, 88, 12, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Stock Distribution Chart
    const stockCtx = document.getElementById('stockChart');
    if (stockCtx) {
        chartInstances.stock = new Chart(stockCtx, {
            type: 'doughnut',
            data: {
                labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Load inventory data
async function loadInventory() {
    try {
        const response = await fetch('/api/inventory/');
        const result = await response.json();
        allInventoryData = result.data;
        renderInventoryTable(allInventoryData);
        populateFilters();
    } catch (error) {
        console.error('Error loading inventory:', error);
        document.getElementById('inventory-table').innerHTML = '<div class="loading">Error loading inventory data</div>';
    }
}

// Refresh inventory
function refreshInventory() {
    loadInventory();
}

// Filter inventory
function filterInventory() {
    const searchQuery = document.getElementById('searchInput')?.value || '';
    const country = document.getElementById('storeFilter')?.value || 'all';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const stock = document.getElementById('stockFilter')?.value || 'all';

    let filtered = allInventoryData.filter(item => {
        const matchSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchCountry = country === 'all' || item.store === country;
        const matchCategory = category === 'all' || item.category === category;
        const matchStock = stock === 'all' || item.status === stock;

        return matchSearch && matchCountry && matchCategory && matchStock;
    });

    renderInventoryTable(filtered);
}

// Render inventory table
function renderInventoryTable(data) {
    let html = '<table><thead><tr>';
    html += '<th>SKU</th><th>Product Name</th><th>Category</th>';
    html += '<th>Store</th><th>Stock</th><th>Price (€)</th><th>Status</th>';
    html += '<th>Action</th></tr></thead><tbody>';
    
    if (data.length === 0) {
        html += '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #6b7280;">No products found</td></tr>';
    } else {
        data.forEach(item => {
            html += `<tr>
                <td style="font-family: monospace; font-size: 12px;">${item.sku}</td>
                <td style="font-weight: 500;">${item.name}</td>
                <td>${item.category}</td>
                <td>${item.store}</td>
                <td style="font-weight: 600;">${item.stock}</td>
                <td>€${item.price.toFixed(2)}</td>
                <td><span class="status-badge ${item.status}">${item.status.replace('-', ' ')}</span></td>
                <td><button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="openWarehouseModal('${item.sku}', '${item.name}')">View</button></td>
            </tr>`;
        });
    }
    
    html += '</tbody></table>';
    document.getElementById('inventory-table').innerHTML = html;
}

// Populate filter options
function populateFilters() {
    const categories = [...new Set(allInventoryData.map(item => item.category))];
    const categorySelect = document.getElementById('categoryFilter');
    
    if (categorySelect) {
        categories.forEach(cat => {
            if (!categorySelect.querySelector(`option[value="${cat}"]`)) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            }
        });
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
        allCompaniesData = result.companies;
        renderCompaniesTable(allCompaniesData);
    } catch (error) {
        console.error('Error loading companies:', error);
        document.getElementById('companies-content').innerHTML = '<div class="loading">Error loading companies data</div>';
    }
}

// Filter companies
function filterCompanies() {
    const searchQuery = document.getElementById('companySearch')?.value || '';
    const filtered = allCompaniesData.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    renderCompaniesTable(filtered);
}

// Render companies table
function renderCompaniesTable(data) {
    let html = '<div class="table-container"><table><thead><tr>';
    html += '<th>Company ID</th><th>Name</th><th>Parent Company</th>';
    html += '<th>Location</th><th>Ownership %</th><th>Status</th><th>Actions</th>';
    html += '</tr></thead><tbody>';
    
    data.forEach(company => {
        html += `<tr>
            <td style="font-family: monospace; font-size: 12px;">${company.id}</td>
            <td style="font-weight: 600;">${company.name}</td>
            <td>${company.parent_name || '<em style="color: #9ca3af;">Main Company</em>'}</td>
            <td>${company.city}, ${company.country}</td>
            <td>${company.ownership}%</td>
            <td><span class="status-badge ${company.status}">${company.status}</span></td>
            <td style="display: flex; gap: 8px;">
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="viewCompany('${company.id}')">View</button>
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="deleteCompany('${company.id}')">Delete</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    document.getElementById('companies-content').innerHTML = html;
}

// Load sales data
async function loadSalesData() {
    try {
        const response = await fetch('/api/sales/');
        const result = await response.json();
        console.log('Sales data:', result);
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

// Export inventory
async function exportInventory(format = 'csv') {
    try {
        // Obter filtros atuais para aplicar na exportação
        const search = document.getElementById('searchInput')?.value || '';
        const store = document.getElementById('storeFilter')?.value || 'all';
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const stock = document.getElementById('stockFilter')?.value || 'all';
        const city = document.getElementById('cityFilter')?.value || 'all';
        const company = document.getElementById('companyFilter')?.value || 'all';
        
        let url = `/export/inventory/?format=${format}`;
        if (search && search !== 'all') url += `&search=${encodeURIComponent(search)}`;
        if (store && store !== 'all') url += `&store=${encodeURIComponent(store)}`;
        if (category && category !== 'all') url += `&category=${encodeURIComponent(category)}`;
        if (stock && stock !== 'all') url += `&stock=${encodeURIComponent(stock)}`;
        if (city && city !== 'all') url += `&city=${encodeURIComponent(city)}`;
        if (company && company !== 'all') url += `&company=${encodeURIComponent(company)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const error = await response.json();
            alert('Error: ' + error.error);
            return;
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        
        // Define o nome do arquivo com data
        const date = new Date().toISOString().split('T')[0];
        a.download = `inventory_${date}.${format}`;
        
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error exporting inventory:', error);
        alert('Error exporting data');
    }
}

// Company management
function openCompanyModal() {
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeCompanyModal() {
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function viewCompany(companyId) {
    alert(`Viewing details for company ${companyId}`);
}

function deleteCompany(companyId) {
    if (confirm('Are you sure you want to delete this company?')) {
        fetch(`/api/company/${companyId}/delete/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Company deleted successfully');
                loadCompanies();
            }
        })
        .catch(error => console.error('Error deleting company:', error));
    }
}

// View warehouse location
function viewWarehouseLocation(sku, store) {
    alert(`Viewing warehouse location for ${sku} at ${store}\n\nAisle > Shelf > Box location`);
}

// Utility: Get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Company Modal Functions
function openCompanyModal() {
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('companyForm').reset();
    }
}

function closeCompanyModal() {
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveCompany(event) {
    event.preventDefault();
    
    const name = document.getElementById('companyName').value;
    const country = document.getElementById('companyCountry').value;
    const city = document.getElementById('companyCity').value;
    const status = document.getElementById('companyStatus').value;
    
    const data = {
        name: name,
        country: country,
        city: city,
        status: status
    };
    
    fetch('/create-company/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeCompanyModal();
            loadCompanies();
        } else {
            alert('Error creating company: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating company');
    });
}

// Merge Modal Functions
function openMergeModal() {
    const modal = document.getElementById('mergeModal');
    if (modal) {
        modal.classList.add('active');
        loadCompaniesForMerge();
    }
}

function closeMergeModal() {
    const modal = document.getElementById('mergeModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function loadCompaniesForMerge() {
    fetch('/api/companies/')
        .then(response => response.json())
        .then(data => {
            const sourceSelect = document.getElementById('sourceCompany');
            const targetSelect = document.getElementById('targetCompany');
            
            sourceSelect.innerHTML = '<option value="">Select a company...</option>';
            targetSelect.innerHTML = '<option value="">Select a company...</option>';
            
            data.forEach(company => {
                const option1 = document.createElement('option');
                option1.value = company.id;
                option1.textContent = company.name + ' (' + company.country + ')';
                sourceSelect.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = company.id;
                option2.textContent = company.name + ' (' + company.country + ')';
                targetSelect.appendChild(option2);
            });
        })
        .catch(error => console.error('Error loading companies for merge:', error));
}

function mergeCompanies(event) {
    event.preventDefault();
    
    const sourceId = document.getElementById('sourceCompany').value;
    const targetId = document.getElementById('targetCompany').value;
    
    if (!sourceId || !targetId) {
        alert('Please select both source and target companies');
        return;
    }
    
    if (sourceId === targetId) {
        alert('Source and target companies must be different');
        return;
    }
    
    if (confirm('Are you sure you want to merge these companies? This action cannot be undone.')) {
        fetch('/api/company/merge/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                source_company_id: sourceId,
                target_company_id: targetId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Companies merged successfully!');
                closeMergeModal();
                loadCompanies();
            } else {
                alert('Error merging companies: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error merging companies');
        });
    }
}

// Warehouse Location Modal Functions
function openWarehouseModal(sku, productName) {
    const modal = document.getElementById('warehouseModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('warehouseTitle').textContent = productName;
        document.getElementById('warehouseSKU').textContent = `SKU: ${sku}`;
        
        // Carregar dados do warehouse
        loadWarehouseData(sku);
    }
}

function closeWarehouseModal() {
    const modal = document.getElementById('warehouseModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function loadWarehouseData(sku) {
    const content = document.getElementById('warehouseContent');
    
    fetch(`/api/warehouse/${sku}/`)
        .then(response => response.json())
        .then(data => {
            if (data.warehouseData && data.warehouseData.length > 0) {
                let html = '<div style="padding: 20px;">';
                
                // Agrupar por aisle
                const groupedByAisle = {};
                data.warehouseData.forEach(item => {
                    if (!groupedByAisle[item.aisle]) {
                        groupedByAisle[item.aisle] = {};
                    }
                    if (!groupedByAisle[item.aisle][item.shelf]) {
                        groupedByAisle[item.aisle][item.shelf] = [];
                    }
                    groupedByAisle[item.aisle][item.shelf].push(item);
                });
                
                // Calcular total
                const totalQty = data.warehouseData.reduce((sum, item) => sum + item.quantity, 0);
                
                html += `<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="font-size: 14px; opacity: 0.9;">Total Stock</p>
                            <p style="font-size: 28px; font-weight: bold;">${totalQty}</p>
                            <p style="font-size: 12px; opacity: 0.9;">units</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 14px; opacity: 0.9;">Store: ${data.storeName}</p>
                            <p style="font-size: 12px; opacity: 0.9;">Updated: ${new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>`;
                
                // Renderizar aisles
                Object.entries(groupedByAisle).forEach(([aisle, shelves]) => {
                    const aisleTotal = Object.values(shelves).flat().reduce((sum, item) => sum + item.quantity, 0);
                    
                    html += `<div style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px; overflow: hidden;">`;
                    html += `<div style="background: #f3f4f6; padding: 12px; border-bottom: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="font-weight: 600; color: #1f2937;">Aisle ${aisle}</p>
                            </div>
                            <p style="font-size: 13px; color: #6b7280;">${aisleTotal} units</p>
                        </div>
                    </div>`;
                    
                    // Renderizar shelves
                    Object.entries(shelves).forEach(([shelf, items]) => {
                        const shelfTotal = items.reduce((sum, item) => sum + item.quantity, 0);
                        
                        html += `<div style="padding: 12px; border-bottom: 1px solid #f3f4f6;">`;
                        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <p style="font-size: 13px; font-weight: 500; color: #374151;">Shelf ${shelf}</p>
                            <p style="font-size: 13px; color: #6b7280;">${shelfTotal} units</p>
                        </div>`;
                        
                        // Renderizar boxes
                        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;">`;
                        items.forEach(item => {
                            html += `<div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px;">
                                <p style="font-size: 12px; font-weight: 500; color: #1f2937;">Box ${item.box}</p>
                                <p style="font-size: 18px; font-weight: bold; color: #10b981;">${item.quantity}</p>
                                <p style="font-size: 11px; color: #6b7280;">units</p>
                            </div>`;
                        });
                        html += `</div></div>`;
                    });
                    
                    html += `</div>`;
                });
                
                html += '</div>';
                content.innerHTML = html;
            } else {
                content.innerHTML = '<div style="padding: 40px; text-align: center; color: #6b7280;">Nenhuma localização encontrada</div>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar warehouse data:', error);
            content.innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">Erro ao carregar dados</div>';
        });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const companyModal = document.getElementById('companyModal');
    const mergeModal = document.getElementById('mergeModal');
    const warehouseModal = document.getElementById('warehouseModal');
    
    if (event.target === companyModal) {
        closeCompanyModal();
    }
    if (event.target === mergeModal) {
        closeMergeModal();
    }
    if (event.target === warehouseModal) {
        closeWarehouseModal();
    }
}

