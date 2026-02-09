// Dashboard JavaScript
let allInventoryData = [];
let allCompaniesData = [];
let chartInstances = {};

// Clear localStorage on logout to prevent cached data from showing
function clearStorageOnLogout() {
    // Remove all localStorage data
    localStorage.clear();
    // Remove all sessionStorage data
    sessionStorage.clear();
    // Clear any Service Worker cache
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }
}

// Update hero date with current date/time
function updateHeroDate() {
    const heroDate = document.getElementById('heroDate');
    if (heroDate) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const now = new Date().toLocaleDateString('en-US', options);
        heroDate.textContent = now;
    }
}

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    updateHeroDate();
    initializeCharts();
    setupMobileMenu();
    
    // Ensure all modals are closed on page load
    document.getElementById('companyModal')?.classList.remove('active');
    document.getElementById('mergeModal')?.classList.remove('active');
    document.getElementById('warehouseModal')?.classList.remove('active');
    
    // Update time every minute
    setInterval(updateHeroDate, 60000);
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
    
    // Hide all submenus
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to clicked menu item and show submenu if it exists
    if (event && event.target) {
        const menuItem = event.target.closest('.menu-item');
        if (menuItem) {
            menuItem.classList.add('active');
            const submenu = menuItem.querySelector('.submenu');
            if (submenu) {
                submenu.style.display = 'block';
            }
        }
    }
    
    // Load data for specific sections
    if (sectionName === 'companies') {
        loadCompanies();
    } else if (sectionName === 'dashboard') {
        loadInventory();
    } else if (sectionName === 'inventory') {
        loadInventory();
    } else if (sectionName === 'reports') {
        showSubsection('reports', 'analytics');
    } else if (sectionName === 'settings') {
        // Initialize settings when section is shown
        if (typeof initializeSettings === 'function') {
            setTimeout(() => initializeSettings(), 100);
        }
    }
}

// Show subsections within a main section
function showSubsection(mainSection, subsectionName) {
    // Hide all subsections
    document.querySelectorAll(`[id^="subsection-"]`).forEach(subsection => {
        subsection.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#6b7280';
        btn.style.borderBottomColor = 'transparent';
    });
    
    // Show selected subsection
    const subsection = document.getElementById(`subsection-${subsectionName}`);
    if (subsection) {
        subsection.style.display = 'block';
        
        // Initialize charts for specific subsections
        setTimeout(() => {
            if (subsectionName === 'risk') {
                // Destroy existing charts first
                if (chartInstances.riskCountry) chartInstances.riskCountry.destroy();
                if (chartInstances.deliveryCalendar) chartInstances.deliveryCalendar.destroy();
                initRiskCharts();
                populateRiskExceptionsTable();
            } else if (subsectionName === 'sustainability') {
                // Destroy existing charts first
                if (chartInstances.co2Country) chartInstances.co2Country.destroy();
                if (chartInstances.emissionsMode) chartInstances.emissionsMode.destroy();
                if (chartInstances.co2Trend) chartInstances.co2Trend.destroy();
                initSustainabilityCharts();
            } else if (subsectionName === 'inventory') {
                // Destroy existing charts first
                if (chartInstances.inventoryTurnover) chartInstances.inventoryTurnover.destroy();
                if (chartInstances.inventoryCapital) chartInstances.inventoryCapital.destroy();
                initInventoryCharts();
                populateInventoryTable();
            }
        }, 200);
    }
    
    // Add active styling to clicked tab button
    if (event && event.target) {
        const btn = event.target.closest('.tab-button');
        if (btn) {
            btn.classList.add('active');
            btn.style.color = '#111827';
            btn.style.borderBottomColor = '#2563eb';
        }
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
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,
                                weight: '600'
                            },
                            padding: 20,
                            color: 'var(--text-primary)',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12
                    }
                }
            }
        });
    }
}

// Load inventory data
async function loadInventory() {
    try {
        const response = await fetch('/api/inventory/', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            redirect: 'error'  // Don't follow redirects, treat as error
        });
        
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response body:', text);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        // Map API response format to frontend format
        const rawData = result.results || result.data || [];
        allInventoryData = rawData.map(item => ({
            id: item.id || null,
            sku: item.product_sku || 'N/A',
            name: item.product_name || 'N/A',
            category: item.category || 'General',
            store: item.store_name || 'N/A',
            stock: item.quantity || 0,
            price: item.price || 0,
            status: item.stock_status || 'in-stock'
        }));
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
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const stock = document.getElementById('stockFilter')?.value || 'all';
    const priceRange = document.getElementById('priceFilter')?.value || 'all';

    let filtered = allInventoryData.filter(item => {
        const matchSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchCategory = category === 'all' || item.category === category;
        const matchStock = stock === 'all' || item.status === stock;
        
        let matchPrice = true;
        if (priceRange !== 'all') {
            const price = item.price || 0;
            if (priceRange === '0-100') matchPrice = price >= 0 && price <= 100;
            else if (priceRange === '100-500') matchPrice = price > 100 && price <= 500;
            else if (priceRange === '500-1000') matchPrice = price > 500 && price <= 1000;
            else if (priceRange === '1000+') matchPrice = price > 1000;
        }

        return matchSearch && matchCategory && matchStock && matchPrice;
    });

    renderInventoryTable(filtered);
}

function renderInventoryTable(data) {
    let html = '<table><thead><tr>';
    html += '<th>SKU</th><th>Product Name</th><th>Category</th>';
    html += '<th>Store</th><th>Stock</th><th>Price</th><th>Status</th>';
    html += '<th>Action</th></tr></thead><tbody>';
    
    if (data.length === 0) {
        html += '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #6b7280;">No products found</td></tr>';
    } else {
        data.forEach((item, index) => {
            const inventoryId = item.id || null;
            const skuSafe = (item.sku || 'N/A').replace(/'/g, "\\'");
            const nameSafe = (item.name || 'N/A').replace(/'/g, "\\'");
            
            console.log(`Rendering inventory item ${index}:`, { id: inventoryId, sku: item.sku, name: item.name });
            
            html += `<tr data-inventory-id="${inventoryId}">
                <td style="font-family: monospace; font-size: 12px;">${item.sku}</td>
                <td style="font-weight: 500;">${item.name}</td>
                <td>${item.category}</td>
                <td>${item.store}</td>
                <td style="font-weight: 600;">${item.stock}</td>
                <td style="white-space: nowrap;">€${item.price.toFixed(2)}</td>
                <td><span class="status-badge ${item.status}">${item.status.replace('-', ' ')}</span></td>
                <td><button class="btn btn-primary inventory-view-btn" data-inventory-id="${inventoryId}" data-inventory-sku="${skuSafe}" data-inventory-name="${nameSafe}" style="padding: 6px 12px; font-size: 12px;">View</button></td>
            </tr>`;
        });
    }
    
    html += '</tbody></table>';
    document.getElementById('inventory-table').innerHTML = html;
    
    // Attach event listeners to inventory view buttons
    setTimeout(() => {
        attachInventoryViewListeners();
    }, 100);
}

// Attach event listeners to inventory view buttons
function attachInventoryViewListeners() {
    console.log('Attaching inventory view button listeners...');
    document.querySelectorAll('.inventory-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const inventoryId = this.getAttribute('data-inventory-id');
            const sku = this.getAttribute('data-inventory-sku');
            const name = this.getAttribute('data-inventory-name');
            console.log('Inventory View button clicked:', { inventoryId, sku, name });
            openWarehouseModal(inventoryId, sku, name);
        });
    });
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
        console.log('Loading companies from /api/companies/');
        const response = await fetch('/api/companies/', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            redirect: 'error'  // Don't follow redirects, treat as error
        });
        
        console.log('Companies response status:', response.status, response.statusText);
        
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response body:', text);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Companies data received (full):', result);
        console.log('Result type:', typeof result);
        console.log('Is array:', Array.isArray(result));
        
        allCompaniesData = Array.isArray(result) ? result : (result.results || result.companies || []);
        console.log('Companies data processed, total:', allCompaniesData.length);
        console.log('First company:', allCompaniesData[0]);
        
        if (allCompaniesData.length === 0) {
            console.warn('No companies data available');
        }
        
        renderCompaniesTable(allCompaniesData);
        
        // Attach event listeners to View buttons
        setTimeout(() => {
            attachCompanyViewListeners();
        }, 100);
    } catch (error) {
        console.error('Error loading companies:', error);
        console.error('Error stack:', error.stack);
        document.getElementById('companies-content').innerHTML = '<div class="loading" style="color: #dc2626;">Error loading companies data</div>';
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
    
    data.forEach((company, index) => {
        html += `<tr>
            <td style="font-family: monospace; font-size: 12px;">${company.company_id || 'N/A'}</td>
            <td style="font-weight: 600;">${company.name}</td>
            <td>${company.parent_name || '<em style="color: #9ca3af;">Main Company</em>'}</td>
            <td>${company.city || 'N/A'}, ${company.country || 'N/A'}</td>
            <td class="no-wrap">${company.ownership_percentage || 'N/A'}%</td>
            <td><span class="status-badge ${company.status}">${company.status || 'N/A'}</span></td>
            <td style="display: flex; gap: 8px;">
                <button class="btn btn-primary company-view-btn" data-company-id="${company.company_id}" data-company-index="${index}" style="padding: 6px 12px; font-size: 12px;">View</button>
                <button class="btn btn-outline company-edit-btn" data-company-id="${company.company_id}" data-company-index="${index}" style="padding: 6px 12px; font-size: 12px;">Edit</button>
                <button class="btn btn-outline company-delete-btn" data-company-id="${company.company_id}" data-company-index="${index}" style="padding: 6px 12px; font-size: 12px;">Delete</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    document.getElementById('companies-content').innerHTML = html;
}

// Attach event listeners to company buttons
function attachCompanyViewListeners() {
    console.log('Attaching company button listeners...');
    
    // View button listeners
    document.querySelectorAll('.company-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const companyId = this.getAttribute('data-company-id');
            const companyIndex = this.getAttribute('data-company-index');
            console.log('View button clicked:', { companyId, companyIndex });
            viewCompany(companyId);
        });
    });
    
    // Edit button listeners
    document.querySelectorAll('.company-edit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const companyId = this.getAttribute('data-company-id');
            const companyIndex = this.getAttribute('data-company-index');
            console.log('Edit button clicked:', { companyId, companyIndex });
            editCompany(companyId);
        });
    });
    
    // Delete button listeners
    document.querySelectorAll('.company-delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const companyId = this.getAttribute('data-company-id');
            console.log('Delete button clicked:', { companyId });
            deleteCompany(companyId);
        });
    });
}

// Load sales data
async function loadSalesData() {
    // Show empty state
    document.getElementById('sales-results-container').style.display = 'none';
    document.getElementById('sales-empty-state').style.display = 'block';
}

function searchSalesCompany() {
    const companyName = document.getElementById('sales-company-name').value.trim();
    if (!companyName) {
        alert('Please enter a company name');
        return;
    }
    
    // Mock data - in real app would call API
    const mockCompanyData = {
        name: companyName,
        sector: 'Technology',
        country: 'Germany',
        revenueYTD: 2850000,
        profitYTD: 520000,
        predictionYTD: 3277500,
        revenueChange: '↑ 12.5% from last month',
        profitChange: '↑ 8.3% from last month',
        predictionGrowth: '↑ 15.0% expected growth',
        competitors: [
            { rank: 1, name: 'Digital Solutions AG', country: 'Germany', revenue: 3200000, profit: 580000, market: 28.8 },
            { rank: 2, name: companyName, country: 'Germany', revenue: 2850000, profit: 520000, market: 25.5 },
            { rank: 3, name: 'Innovation Tech SAS', country: 'France', revenue: 2100000, profit: 380000, market: 18.9 },
            { rank: 4, name: 'Smart Systems Ltd', country: 'Netherlands', revenue: 1800000, profit: 320000, market: 16.2 },
            { rank: 5, name: 'FutureTech Italia', country: 'Italy', revenue: 1200000, profit: 210000, market: 10.6 },
        ],
        topProducts: [
            { name: 'Industrial Drill Kit', sku: 'SUP-001', category: 'Electronics', units: 1000 },
            { name: 'Office Chair Premium', sku: 'SUP-002', category: 'Furniture', units: 850 },
            { name: 'Laptop Stand Adjustable', sku: 'SUP-003', category: 'Electronics', units: 700 },
            { name: 'Printer Paper A4', sku: 'SUP-004', category: 'Office Supplies', units: 550 },
            { name: 'Cable Organizer Set', sku: 'SUP-005', category: 'Electronics', units: 400 },
        ]
    };
    
    renderSalesCompanyData(mockCompanyData);
}

function renderSalesCompanyData(data) {
    // Show results, hide empty state
    document.getElementById('sales-empty-state').style.display = 'none';
    document.getElementById('sales-results-container').style.display = 'block';
    
    // Update header
    document.getElementById('sales-company-name-display').textContent = data.name;
    document.getElementById('sales-company-sector-display').textContent = `${data.sector} • ${data.country}`;
    
    // Update KPI cards
    document.getElementById('sales-revenue-ytd').textContent = '€' + (data.revenueYTD / 1000000).toFixed(2) + 'M';
    document.getElementById('sales-revenue-change').textContent = data.revenueChange;
    
    document.getElementById('sales-profit-ytd').textContent = '€' + (data.profitYTD / 1000).toFixed(0) + 'K';
    document.getElementById('sales-profit-change').textContent = data.profitChange;
    
    document.getElementById('sales-prediction-ytd').textContent = '€' + (data.predictionYTD / 1000000).toFixed(2) + 'M';
    document.getElementById('sales-prediction-growth').textContent = data.predictionGrowth;
    
    // Render competitors table
    renderCompetitorsTable(data.competitors);
    
    // Render top products
    renderTopProducts(data.topProducts);
}

function renderCompetitorsTable(competitors) {
    let html = '<table style="width: 100%; border-collapse: collapse;"><thead style="background: #f9fafb;"><tr><th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151;"></th><th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151;">Company</th><th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151;">Country</th><th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151;">Revenue YTD</th><th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151;">Profit YTD</th><th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151;">Market Share</th></tr></thead><tbody>';
    
    for (const comp of competitors) {
        const rankColor = comp.rank === 1 ? '#fbbf24' : comp.rank === 2 ? '#d1d5db' : '#f97316';
        html += `<tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; text-align: center;"><span style="display: inline-block; width: 24px; height: 24px; background: ${rankColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;">#${comp.rank}</span></td>
            <td style="padding: 12px; color: #111827; font-weight: 500;">${comp.name}</td>
            <td style="padding: 12px; color: #6b7280;">${comp.country}</td>
            <td style="padding: 12px; text-align: right; color: #111827;">€${(comp.revenue / 1000000).toFixed(1)}M</td>
            <td style="padding: 12px; text-align: right; color: #111827;">€${(comp.profit / 1000).toFixed(0)}K</td>
            <td style="padding: 12px; text-align: right; color: #111827; font-weight: 600;">${comp.market}%</td>
        </tr>`;
    }
    
    html += '</tbody></table>';
    document.getElementById('sales-competitors-table').innerHTML = html;
}

function renderTopProducts(products) {
    let html = '';
    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        const icons = ['🏭', '🪑', '📐', '📄', '🔌'];
        html += `<div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <div style="font-size: 24px; margin-right: 16px;">${icons[i]}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #111827;">${prod.name}</div>
                <div style="font-size: 12px; color: #6b7280;">${prod.category} • SKU: ${prod.sku}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 18px; font-weight: 700; color: #111827;">${prod.units.toLocaleString()}</div>
                <div style="font-size: 12px; color: #6b7280;">units sold</div>
            </div>
        </div>`;
    }
    document.getElementById('sales-products-list').innerHTML = html;
}

// Export inventory - NEW VERSION WITH ACTUAL DATA
async function exportInventory(format = 'csv') {
    try {
        console.log(`Starting export in ${format} format...`);
        
        // Chamar o novo endpoint de exportação
        const response = await fetch(`/api/inventory/export/${format}/`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Export error:', errorText);
            alert('Erro na exportação');
            return;
        }
        
        // Processar resposta baseado no formato
        const contentType = response.headers.get('content-type');
        
        if (format === 'csv') {
            // CSV retorna text/csv direto
            const csvText = await response.text();
            const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
            downloadFile(blob, `inventory_${new Date().toISOString().split('T')[0]}.csv`);
        } else if (format === 'json') {
            // JSON retorna text direto
            const jsonText = await response.text();
            const blob = new Blob([jsonText], { type: 'application/json' });
            downloadFile(blob, `inventory_${new Date().toISOString().split('T')[0]}.json`);
        } else if (format === 'parquet') {
            // Parquet retorna JSON com base64
            const data = await response.json();
            if (data.parquet_file) {
                const binaryString = atob(data.parquet_file);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'application/octet-stream' });
                downloadFile(blob, `inventory_${new Date().toISOString().split('T')[0]}.parquet`);
            } else {
                alert('Erro: arquivo parquet não encontrado na resposta');
            }
        }
        
        console.log(`Export em ${format} completado!`);
    } catch (error) {
        console.error('Erro ao exportar inventário:', error);
        alert('Erro ao exportar dados');
    }
}

// Helper function to download file
function downloadFile(blob, filename) {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
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
            
            const companies = data.results || data;
            companies.forEach(company => {
                const option1 = document.createElement('option');
                option1.value = company.company_id;
                option1.textContent = company.name + ' (' + (company.country || 'N/A') + ')';
                sourceSelect.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = company.company_id;
                option2.textContent = company.name + ' (' + (company.country || 'N/A') + ')';
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
function openWarehouseModal(inventoryId, sku, productName) {
    console.log('openWarehouseModal called with:', { inventoryId, sku, productName });
    const modal = document.getElementById('warehouseModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('warehouseTitle').textContent = productName;
        document.getElementById('warehouseSKU').textContent = `SKU: ${sku}`;
        
        if (inventoryId) {
            loadWarehouseData(inventoryId);
        } else {
            console.error('Inventory ID is missing:', inventoryId);
            document.getElementById('warehouseContent').innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">Erro: ID do produto não encontrado</div>';
        }
    }
}

function closeWarehouseModal() {
    const modal = document.getElementById('warehouseModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function loadWarehouseData(inventoryId) {
    const content = document.getElementById('warehouseContent');
    
    // Show loading
    content.innerHTML = '<div style="padding: 40px; text-align: center;"><p style="color: #6b7280;">Loading...</p></div>';
    
    console.log('Loading warehouse data for inventory ID:', inventoryId);
    
    fetch(`/api/inventory/${inventoryId}/warehouse/`)
        .then(response => {
            console.log('Warehouse API response status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Warehouse data received:', data);
            
            // Check if we have locations
            if (!data.locations) {
                console.warn('No locations key in response:', data);
                content.innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">Error: Location data unavailable</div>';
                return;
            }
            
            if (data.locations && data.locations.length > 0) {
                let html = '<div style="padding: 20px;">';
                
                // Check if locations contains error message
                if (data.locations[0].message) {
                    console.log('No warehouse locations found');
                    html += `<div style="padding: 40px 20px; text-align: center;">
                        <div style="width: 80px; height: 80px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <span style="font-size: 40px;">📦</span>
                        </div>
                        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px;">No Location Data</h3>
                        <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">This product has no warehouse location information yet.</p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">Warehouse data will be displayed once registered in the system.</p>
                    </div>`;
                    content.innerHTML = html;
                    return;
                }
                
                // Agrupar por warehouse, aisle, shelf
                const groupedData = {};
                data.locations.forEach(loc => {
                    if (!groupedData[loc.warehouse_name]) {
                        groupedData[loc.warehouse_name] = {};
                    }
                    if (!groupedData[loc.warehouse_name][loc.aisle]) {
                        groupedData[loc.warehouse_name][loc.aisle] = {};
                    }
                    if (!groupedData[loc.warehouse_name][loc.aisle][loc.shelf]) {
                        groupedData[loc.warehouse_name][loc.aisle][loc.shelf] = [];
                    }
                    groupedData[loc.warehouse_name][loc.aisle][loc.shelf].push(loc);
                });
                
                // Calcular total
                const totalQty = data.locations.reduce((sum, item) => sum + (item.quantity || 0), 0);
                
                html += `<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="font-size: 14px; opacity: 0.9;">Total Stock</p>
                            <p style="font-size: 28px; font-weight: bold;">${parseInt(totalQty) || 0}</p>
                            <p style="font-size: 12px; opacity: 0.9;">unidades</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 12px; opacity: 0.9;">Atualizado: ${new Date().toLocaleTimeString('pt-BR')}</p>
                        </div>
                    </div>
                </div>`;
                
                // Renderizar warehouses
                Object.entries(groupedData).forEach(([warehouse, aisles]) => {
                    // Calcular total do warehouse corretamente
                    let warehouseTotal = 0;
                    Object.values(aisles).forEach(shelves => {
                        Object.values(shelves).forEach(items => {
                            items.forEach(item => {
                                warehouseTotal += parseInt(item.quantity) || 0;
                            });
                        });
                    });
                    
                    html += `<div style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px; overflow: hidden;">`;
                    html += `<div style="background: #f3f4f6; padding: 12px; border-bottom: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="font-weight: 600; color: #1f2937;">🏭 ${warehouse}</p>
                            </div>
                            <p style="font-size: 13px; color: #6b7280; font-weight: 600;">${parseInt(warehouseTotal) || 0} unidades</p>
                        </div>
                    </div>`;
                    
                    // Renderizar aisles
                    Object.entries(aisles).forEach(([aisle, shelves]) => {
                        // Calcular total do aisle corretamente
                        let aisleTotal = 0;
                        Object.values(shelves).forEach(items => {
                            items.forEach(item => {
                                aisleTotal += parseInt(item.quantity) || 0;
                            });
                        });
                        
                        html += `<div style="padding: 12px; border-bottom: 1px solid #f3f4f6; background: #fafafa;">`;
                        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <p style="font-size: 13px; font-weight: 500; color: #374151;">📍 Aisle ${aisle}</p>
                            <p style="font-size: 13px; color: #6b7280;">${parseInt(aisleTotal) || 0} unidades</p>
                        </div>`;
                        
                        // Renderizar shelves
                        Object.entries(shelves).forEach(([shelf, items]) => {
                            const shelfTotal = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                            
                            html += `<div style="padding: 8px 0; margin-left: 16px;">`;
                            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <p style="font-size: 12px; font-weight: 500; color: #555;">Shelf ${shelf}</p>
                                <p style="font-size: 12px; color: #999;">${parseInt(shelfTotal) || 0} unidades</p>
                            </div>`;
                            
                            // Renderizar boxes
                            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 6px;">`;
                            items.forEach(item => {
                                const qty = parseInt(item.quantity) || 0;
                                html += `<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 6px; padding: 8px; color: white; text-align: center;">
                                    <p style="font-size: 11px; opacity: 0.9;">Box ${item.box}</p>
                                    <p style="font-size: 16px; font-weight: bold;">${qty}</p>
                                    <p style="font-size: 10px; opacity: 0.8;">units</p>
                                </div>`;
                            });
                            html += `</div></div>`;
                        });
                        
                        html += `</div>`;
                    });
                    
                    html += `</div>`;
                });
                
                html += '</div>';
                content.innerHTML = html;
            } else {
                content.innerHTML = '<div style="padding: 40px; text-align: center; color: #6b7280;">Nenhuma localização encontrada para este produto</div>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar warehouse data:', error);
            content.innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">Erro ao carregar dados: ' + error.message + '</div>';
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

// Company View Function
function viewCompany(companyId) {
    console.log('=== viewCompany called ===');
    console.log('Company ID:', companyId);
    console.log('All Companies Data:', allCompaniesData);
    
    const company = allCompaniesData.find(c => c.company_id === companyId);
    
    if (!company) {
        console.error('Company not found with ID:', companyId);
        console.error('Available company IDs:', allCompaniesData.map(c => c.company_id));
        alert('Empresa não encontrada');
        return;
    }
    
    console.log('Found company:', company);
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'companyViewModal';
    modal.style.cssText = `
        display: flex !important;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;
        visibility: visible;
        opacity: 1;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        z-index: 10000;
        position: relative;
    `;
    
    const parentInfo = company.parent_name ? 
        `<p style="margin: 12px 0;"><strong>Empresa Mãe:</strong> ${company.parent_name}</p>` : 
        '';
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #1f2937;">Detalhes da Empresa</h2>
            <button style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 0; width: 30px; height: 30px;">×</button>
        </div>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="margin: 12px 0;"><strong>ID da Empresa:</strong> ${company.company_id}</p>
            <p style="margin: 12px 0;"><strong>Nome:</strong> ${company.name}</p>
            <p style="margin: 12px 0;"><strong>Localização:</strong> ${company.city || 'N/A'}, ${company.country || 'N/A'}</p>
            <p style="margin: 12px 0;"><strong>Propriedade:</strong> ${company.ownership_percentage || 'N/A'}%</p>
            ${parentInfo}
            <p style="margin: 12px 0;"><strong>Status:</strong> <span class="status-badge ${company.status}">${company.status || 'N/A'}</span></p>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    console.log('Modal created and appended');
    
    // Adicionar event listener ao botão de fechar
    const closeBtn = content.querySelector('button');
    closeBtn.onclick = function(e) {
        e.stopPropagation();
        console.log('Close button clicked');
        modal.remove();
    };
    
    // Fechar ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            console.log('Background clicked, closing modal');
            modal.remove();
        }
    };
}

// Company Edit Function
function editCompany(companyId) {
    console.log('=== editCompany called ===');
    console.log('Company ID:', companyId);
    
    const company = allCompaniesData.find(c => c.company_id === companyId);
    
    if (!company) {
        console.error('Company not found with ID:', companyId);
        alert('Empresa não encontrada');
        return;
    }
    
    console.log('Found company for edit:', company);
    
    // Criar modal de edição
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'companyEditModal';
    modal.style.cssText = `
        display: flex !important;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;
        visibility: visible;
        opacity: 1;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        z-index: 10000;
        position: relative;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #1f2937;">Editar Empresa</h2>
            <button class="close-edit-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 0; width: 30px; height: 30px;">×</button>
        </div>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px;">Nome da Empresa</label>
                <input type="text" id="editCompanyName" value="${company.name}" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; box-sizing: border-box;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px;">País</label>
                    <input type="text" id="editCompanyCountry" value="${company.country || ''}" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px;">Cidade</label>
                    <input type="text" id="editCompanyCity" value="${company.city || ''}" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; box-sizing: border-box;">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px;">Propriedade (%)</label>
                    <input type="number" id="editCompanyOwnership" value="${company.ownership_percentage || 100}" min="0" max="100" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px;\">Status</label>\n                    <select id="editCompanyStatus" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; box-sizing: border-box;">
                        <option value="active" ${company.status === 'active' ? 'selected' : ''}>Ativo</option>
                        <option value="inactive" ${company.status === 'inactive' ? 'selected' : ''}>Inativo</option>
                        <option value="archived" ${company.status === 'archived' ? 'selected' : ''}>Arquivado</option>
                    </select>
                </div>
            </div>
            <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                <button class="close-edit-modal" style="padding: 10px 20px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #374151;">Cancelar</button>
                <button id="savEditCompanyBtn" style="padding: 10px 20px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Salvar Mudanças</button>
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    console.log('Edit modal created and appended');
    
    // Adicionar event listeners aos botões de fechar
    const closeButtons = content.querySelectorAll('.close-edit-modal');
    closeButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            console.log('Close edit modal button clicked');
            modal.remove();
        };
    });
    
    // Fechar ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            console.log('Edit modal background clicked, closing');
            modal.remove();
        }
    };
    
    // Adicionar listener para salvar
    const savBtn = document.getElementById('savEditCompanyBtn');
    if (savBtn) {
        savBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const updatedCompany = {
                name: document.getElementById('editCompanyName').value,
                country: document.getElementById('editCompanyCountry').value,
                city: document.getElementById('editCompanyCity').value,
                ownership_percentage: parseInt(document.getElementById('editCompanyOwnership').value),
                status: document.getElementById('editCompanyStatus').value
            };
            
            console.log('Saving company with data:', updatedCompany);
            
            // Fazer requisição PUT/PATCH (você precisa implementar isso no backend)
            fetch(`/api/companies/${companyId}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(updatedCompany)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Company updated successfully:', data);
                alert('Empresa atualizada com sucesso!');
                modal.remove();
                loadCompanies();
            })
            .catch(error => {
                console.error('Error updating company:', error);
                alert('Erro ao atualizar empresa: ' + error.message);
            });
        };
    }
}

// Company Delete Function with Custom Modal
function deleteCompany(companyId) {
    const company = allCompaniesData.find(c => c.company_id === companyId);
    if (!company) {
        alert('Empresa não encontrada');
        return;
    }
    
    // Criar modal de confirmação customizada
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'deleteConfirmModal';
    modal.style.cssText = `
        display: flex !important;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;
        visibility: visible;
        opacity: 1;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        z-index: 10000;
        position: relative;
    `;
    
    content.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 40px; height: 40px; background: #fee2e2; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="trash-2" style="width: 24px; height: 24px; color: #dc2626;"></i>
            </div>
            <h2 style="margin: 0; color: #1f2937; font-size: 20px;">Deletar Empresa</h2>
        </div>
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 0; color: #991b1b; font-weight: 500;">Aviso</p>
            <p style="margin: 8px 0 0 0; color: #7f1d1d; font-size: 14px;">Tem certeza que deseja deletar a empresa "${company.name}"? Esta ação não pode ser desfeita.</p>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="cancelDeleteBtn" style="padding: 10px 20px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #374151;">
                Cancelar
            </button>
            <button id="confirmDeleteBtn" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                Sim, Deletar
            </button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Re-initialize Lucide icons para a nova modal
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Event listeners
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    cancelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        modal.remove();
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    confirmBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Deletando...';
        
        // Fazer requisição DELETE
        fetch(`/api/companies/${companyId}/delete/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.status === 404) {
                alert('Empresa não encontrada');
                return Promise.reject('not-found');
            }
            if (response.status === 405) {
                alert('Método não permitido');
                return Promise.reject('method-not-allowed');
            }
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Erro desconhecido');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                modal.remove();
                // Mostrar sucesso
                const successModal = document.createElement('div');
                successModal.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 16px 24px;
                    border-radius: 8px;
                    z-index: 99999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    max-width: 400px;
                `;
                successModal.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: 600;">&#10003;</span>
                        <span>Empresa "${company.name}" deletada com sucesso!</span>
                    </div>
                `;
                document.body.appendChild(successModal);
                setTimeout(() => successModal.remove(), 3000);
                
                // Remover da lista
                allCompaniesData = allCompaniesData.filter(c => c.company_id !== companyId);
                renderCompaniesTable(allCompaniesData);
            } else {
                alert('Erro ao deletar: ' + (data.error || 'Erro desconhecido'));
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Sim, Deletar';
            }
        })
        .catch(error => {
            if (error !== 'not-found' && error !== 'method-not-allowed') {
                console.error('Erro ao deletar empresa:', error);
                alert('Erro ao deletar empresa: ' + error);
            }
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Sim, Deletar';
        });
    });
}

// ===== REPORTS CHARTS & DATA =====

// Initialize all charts for Reports section
function initializeReportsCharts() {
    // Risk Report Charts
    initRiskCharts();
    // Sustainability Charts
    initSustainabilityCharts();
    // Inventory Charts
    initInventoryCharts();
    
    // Populate tables
    populateRiskExceptionsTable();
    populateInventoryTable();
}

// Risk Report Charts
function initRiskCharts(period = '30', country = 'all') {
    // Destroy existing instances
    if (chartInstances.riskCountry) chartInstances.riskCountry.destroy();
    if (chartInstances.deliveryCalendar) chartInstances.deliveryCalendar.destroy();
    
    // Calculate multipliers
    const periodMult = {7: 0.6, 30: 1.0, 90: 1.3, 365: 1.5}[period] || 1.0;
    const countryMult = {all: 1.0, Germany: 0.8, France: 1.0, Italy: 1.2, Spain: 1.1}[country] || 1.0;
    const totalMult = periodMult * countryMult;
    
    // Generate varied risk data
    const baseRiskData = [23.5, 18.2, 15.8, 22.1, 12.4];
    const riskData = baseRiskData.map(val => Math.min(Math.max(val * totalMult, 5), 40));
    
    // SKUs at Risk by Country
    const riskCountryCtx = document.getElementById('riskCountryChart');
    if (riskCountryCtx) {
        chartInstances.riskCountry = new Chart(riskCountryCtx, {
            type: 'bar',
            data: {
                labels: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
                datasets: [{
                    label: 'SKUs at Risk %',
                    data: riskData,
                    backgroundColor: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fee2e2'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'x',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50
                    }
                }
            }
        });
    }
    
    // Delivery by Logistics Calendar with varied data
    const baseOnTime = [85, 88, 86, 89, 87, 89];
    const onTimeData = baseOnTime.map(val => Math.max(Math.round(val - (periodMult * 3)), 75));
    const delayedData = [100, 100, 100, 100, 100, 100].map((val, idx) => val - onTimeData[idx]);
    
    const deliveryCalendarCtx = document.getElementById('deliveryCalendarChart');
    if (deliveryCalendarCtx) {
        chartInstances.deliveryCalendar = new Chart(deliveryCalendarCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'On-Time',
                        data: onTimeData,
                        backgroundColor: '#10b981',
                        borderRadius: 8,
                        borderSkipped: false
                    },
                    {
                        label: 'Delayed',
                        data: delayedData,
                        backgroundColor: '#dc2626',
                        borderRadius: 8,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'x',
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true, max: 100 }
                },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Sustainability Report Charts
function initSustainabilityCharts(period = '30', country = 'all', mode = 'all') {
    // Destroy existing instances
    if (chartInstances.co2Country) chartInstances.co2Country.destroy();
    if (chartInstances.emissionsMode) chartInstances.emissionsMode.destroy();
    if (chartInstances.co2Trend) chartInstances.co2Trend.destroy();
    
    // Calculate multipliers
    const periodMult = {7: 0.25, 30: 1.0, 90: 2.8, 365: 10.5}[period] || 1.0;
    const countryMult = {all: 1.0, Germany: 0.85, France: 0.82, Italy: 1.15, Spain: 1.0}[country] || 1.0;
    const modeMult = {all: 1.0, Road: 1.2, Rail: 0.3, Sea: 0.15, Air: 3.5}[mode] || 1.0;
    const totalMult = Math.min(periodMult * countryMult * modeMult, 3.5);
    
    // Generate varied CO2 data by country
    const baseCo2Data = [52.3, 38.5, 45.2, 41.8, 35.2];
    const co2Data = baseCo2Data.map(val => Math.round(val * totalMult));
    
    // CO2 Intensity by Country
    const co2CountryCtx = document.getElementById('co2CountryChart');
    if (co2CountryCtx) {
        chartInstances.co2Country = new Chart(co2CountryCtx, {
            type: 'bar',
            data: {
                labels: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
                datasets: [{
                    label: 'kg CO₂e per shipment',
                    data: co2Data,
                    backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'x',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Emissions by Transport Mode - vary distribution
    const modeData = mode === 'all' 
        ? [45, 25, 22, 8]
        : mode === 'Road' ? [70, 15, 10, 5]
        : mode === 'Rail' ? [10, 75, 12, 3]
        : mode === 'Sea' ? [8, 12, 75, 5]
        : [15, 10, 15, 60];
    
    const emissionsModeCtx = document.getElementById('emissionsModeChart');
    if (emissionsModeCtx) {
        chartInstances.emissionsMode = new Chart(emissionsModeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Road', 'Rail', 'Sea', 'Air'],
                datasets: [{
                    data: modeData,
                    backgroundColor: ['#f87171', '#4ade80', '#60a5fa', '#fbbf24'],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
    
    // CO2 Emissions Trend vs Target
    const baseTrendData = [45000, 42000, 44000, 41000, 38000, 36000];
    const trendData = baseTrendData.map(val => Math.round(val * totalMult));
    const targetData = trendData.map(val => Math.round(val * 1.15));
    
    const co2TrendCtx = document.getElementById('co2TrendChart');
    if (co2TrendCtx) {
        chartInstances.co2Trend = new Chart(co2TrendCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [
                    {
                        label: 'Actual Emissions',
                        data: trendData,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Target',
                        data: targetData,
                        borderColor: '#dc2626',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// Inventory Report Charts
function initInventoryCharts(period = '30', country = 'all', breakdown = 'warehouse') {
    // Destroy existing instances
    if (chartInstances.inventoryTurnover) chartInstances.inventoryTurnover.destroy();
    if (chartInstances.inventoryCapital) chartInstances.inventoryCapital.destroy();
    
    // Calculate multipliers
    const periodMult = {7: 0.3, 30: 1.0, 90: 2.2, 365: 8.0}[period] || 1.0;
    const countryMult = {all: 1.0, Germany: 1.1, France: 0.95, Italy: 1.05, Spain: 0.9}[country] || 1.0;
    const breakdownMult = {warehouse: 1.0, product: 0.8, region: 1.15}[breakdown] || 1.0;
    const totalMult = periodMult * countryMult * breakdownMult;
    
    // Generate varied inventory turnover data
    const baseTurnoverData = [8.2, 6.5, 7.8, 5.9, 6.2];
    const turnoverData = baseTurnoverData.map(val => (val * totalMult).toFixed(1));
    
    // Inventory Turnover by Warehouse
    const inventoryTurnoverCtx = document.getElementById('inventoryTurnoverChart');
    if (inventoryTurnoverCtx) {
        chartInstances.inventoryTurnover = new Chart(inventoryTurnoverCtx, {
            type: 'bar',
            data: {
                labels: ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Cologne'],
                datasets: [{
                    label: 'Turnover Rate',
                    data: turnoverData.map(v => parseFloat(v)),
                    backgroundColor: '#3b82f6',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'x',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Inventory Capital vs Sales Evolution
    const baseCapitalData = [2.1, 2.15, 2.25, 2.3, 2.35, 2.456];
    const capitalData = baseCapitalData.map(val => parseFloat((val * totalMult).toFixed(3)));
    const baseSalesData = [8.5, 9.2, 9.8, 10.5, 11.2, 12.1];
    const salesData = baseSalesData.map(val => parseFloat((val * totalMult * 0.8).toFixed(2)));
    
    const inventoryCapitalCtx = document.getElementById('inventoryCapitalChart');
    if (inventoryCapitalCtx) {
        chartInstances.inventoryCapital = new Chart(inventoryCapitalCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Inventory Capital (€M)',
                        data: capitalData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Sales (€M)',
                        data: salesData,
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Inventory Capital' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Sales' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }
}

// Populate Risk Exceptions Table
function populateRiskExceptionsTable() {
    const exceptions = [
        { sku: 'SUP-2847', country: 'Spain', product: 'Industrial Drill Kit', problem: 'Stock Out Risk', impact: 45000, severity: 'Critical' },
        { sku: 'SUP-1923', country: 'Italy', product: 'Office Chair Premium', problem: 'Delayed Shipment', impact: 38500, severity: 'Critical' },
        { sku: 'SUP-3421', country: 'Germany', product: 'Laptop Stand', problem: 'High Lead Time', impact: 22800, severity: 'Warning' },
        { sku: 'SUP-4156', country: 'France', product: 'Cable Organizer Set', problem: 'Supplier Risk', impact: 18200, severity: 'Warning' },
        { sku: 'SUP-2891', country: 'Netherlands', product: 'Printer Paper A4', problem: 'Quality Issue', impact: 12500, severity: 'Info' },
        { sku: 'SUP-5623', country: 'Spain', product: 'Monitor Stand', problem: 'Stock Out Risk', impact: 8900, severity: 'Warning' },
        { sku: 'SUP-1856', country: 'Germany', product: 'USB Hub', problem: 'Delayed Shipment', impact: 6200, severity: 'Info' },
        { sku: 'SUP-4332', country: 'France', product: 'Keyboard Mechanical', problem: 'High Lead Time', impact: 5100, severity: 'Info' },
        { sku: 'SUP-2905', country: 'Italy', product: 'Mouse Pad Large', problem: 'Low Demand', impact: 3200, severity: 'Low' },
        { sku: 'SUP-6142', country: 'Spain', product: 'Cable HDMI', problem: 'Overstock', impact: 2100, severity: 'Low' }
    ];
    
    const tbody = document.getElementById('risk-exceptions-table');
    if (!tbody) return;
    
    tbody.innerHTML = exceptions.map(exc => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-weight: 600; color: #111827; font-family: monospace; font-size: 13px;">${exc.sku}</td>
            <td style="padding: 12px; color: #6b7280;">${exc.country}</td>
            <td style="padding: 12px; color: #6b7280;">${exc.product}</td>
            <td style="padding: 12px; color: #6b7280;">${exc.problem}</td>
            <td style="padding: 12px; color: #111827; font-weight: 600;">€${exc.impact.toLocaleString()}</td>
            <td style="padding: 12px; text-align: center;">
                <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;
                ${exc.severity === 'Critical' ? 'background: #fee2e2; color: #dc2626;' : ''}
                ${exc.severity === 'Warning' ? 'background: #fef3c7; color: #d97706;' : ''}
                ${exc.severity === 'Info' ? 'background: #dbeafe; color: #0284c7;' : ''}
                ${exc.severity === 'Low' ? 'background: #dcfce7; color: #059669;' : ''}
                ">${exc.severity}</span>
            </td>
        </tr>
    `).join('');
}

// Populate Inventory Table
function populateInventoryTable() {
    const inventoryData = [
        { sku: 'SUP-001', warehouse: 'Berlin', status: 'In Stock', netDays: 45, turnover: 8.2, trend: 'up' },
        { sku: 'SUP-002', warehouse: 'Frankfurt', status: 'In Stock', netDays: 38, turnover: 6.5, trend: 'up' },
        { sku: 'SUP-003', warehouse: 'Munich', status: 'Low Stock', netDays: 12, turnover: 7.8, trend: 'down' },
        { sku: 'SUP-004', warehouse: 'Hamburg', status: 'In Stock', netDays: 52, turnover: 5.9, trend: 'flat' },
        { sku: 'SUP-005', warehouse: 'Cologne', status: 'Critical', netDays: 3, turnover: 6.2, trend: 'down' },
        { sku: 'SUP-006', warehouse: 'Berlin', status: 'In Stock', netDays: 41, turnover: 7.1, trend: 'up' },
        { sku: 'SUP-007', warehouse: 'Frankfurt', status: 'In Stock', netDays: 35, turnover: 5.8, trend: 'flat' },
        { sku: 'SUP-008', warehouse: 'Munich', status: 'In Stock', netDays: 48, turnover: 8.5, trend: 'up' }
    ];
    
    const tbody = document.getElementById('inventory-table');
    if (!tbody) return;
    
    tbody.innerHTML = inventoryData.map(inv => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-weight: 600; color: #111827; font-family: monospace; font-size: 13px;">${inv.sku}</td>
            <td style="padding: 12px; color: #6b7280;">${inv.warehouse}</td>
            <td style="padding: 12px;">
                <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;
                ${inv.status === 'In Stock' ? 'background: #dcfce7; color: #059669;' : ''}
                ${inv.status === 'Low Stock' ? 'background: #fef3c7; color: #d97706;' : ''}
                ${inv.status === 'Critical' ? 'background: #fee2e2; color: #dc2626;' : ''}
                ">${inv.status}</span>
            </td>
            <td style="padding: 12px; color: #111827; font-weight: 600;">${inv.netDays}</td>
            <td style="padding: 12px; color: #111827; font-weight: 600;">${inv.turnover.toFixed(1)}</td>
            <td style="padding: 12px; text-align: center;">
                ${inv.trend === 'up' ? '<i data-lucide="trending-up" style="width: 16px; height: 16px; color: #10b981; display: inline;"></i>' : ''}
                ${inv.trend === 'down' ? '<i data-lucide="trending-down" style="width: 16px; height: 16px; color: #dc2626; display: inline;"></i>' : ''}
                ${inv.trend === 'flat' ? '<i data-lucide="minus" style="width: 16px; height: 16px; color: #6b7280; display: inline;"></i>' : ''}
            </td>
        </tr>
    `).join('');
    
    // Re-render Lucide icons for the new trend icons
    lucide.createIcons();
}

// Update Risk Data based on selected filters
function updateRiskData() {
    const period = document.getElementById('risk-period-filter').value;
    const country = document.getElementById('risk-country-filter').value;
    const sku = document.getElementById('risk-sku-filter').value;
    const supplier = document.getElementById('risk-supplier-filter').value;
    
    // Define base values
    const baseValues = {
        skusAtRisk: 23.5,        // %
        highLeadTime: 156,        // count
        criticalSuppliers: 8,     // count
        otifPerformance: 87.2     // %
    };
    
    // Period multipliers (effect on risk level)
    const periodMult = {
        '7': 0.6,   // Less data = lower visibility
        '30': 1.0,  // Base period
        '90': 1.3,  // More patterns visible
        '365': 1.5  // Full year = higher risks
    };
    
    // Country risk factors
    const countryMult = {
        'all': 1.0,
        'Germany': 0.8,   // Stable supply
        'France': 1.0,
        'Italy': 1.2,     // Higher risk
        'Spain': 1.1
    };
    
    // Calculate multipliers
    const period_val = periodMult[period] || 1.0;
    const country_val = countryMult[country] || 1.0;
    const totalMult = period_val * country_val;
    
    // Calculate new values
    const newKpi1 = Math.min(Math.max((baseValues.skusAtRisk * totalMult).toFixed(1), 5), 95);
    const newKpi2 = Math.round(baseValues.highLeadTime * totalMult);
    const newKpi3 = Math.round(baseValues.criticalSuppliers * totalMult);
    const newKpi4 = Math.max((baseValues.otifPerformance / totalMult).toFixed(1), 60);
    
    // Update KPI cards
    document.getElementById('risk-kpi-1').textContent = newKpi1 + '%';
    document.getElementById('risk-kpi-2').textContent = newKpi2;
    document.getElementById('risk-kpi-3').textContent = newKpi3;
    document.getElementById('risk-kpi-4').textContent = newKpi4 + '%';
    
    // Reinitialize Risk charts with new data
    setTimeout(() => {
        initRiskCharts(period, country);
    }, 100);
}

// Update Sustainability Data based on selected filters
function updateSustainabilityData() {
    const period = document.getElementById('sust-period-filter').value;
    const country = document.getElementById('sust-country-filter').value;
    const mode = document.getElementById('sust-mode-filter').value;
    
    // Define base values for 30-day period
    const baseValues = {
        totalCo2: 284500,        // kg
        co2PerShipment: 42.3,    // kg per shipment
        renewableEnergy: 0.18,   // %
        loadReduction: 34.5      // %
    };
    
    // Period multipliers
    const periodMult = {
        '7': 0.25,
        '30': 1.0,
        '90': 2.8,
        '365': 10.5
    };
    
    // Country sustainability factors
    const countryMult = {
        'all': 1.0,
        'Germany': 0.85,    // More sustainable practices
        'France': 0.82,
        'Italy': 1.15,
        'Spain': 1.0
    };
    
    // Transport mode impact
    const modeMult = {
        'all': 1.0,
        'Road': 1.2,        // Higher emissions
        'Rail': 0.3,        // Lower emissions
        'Sea': 0.15,        // Lowest emissions
        'Air': 3.5          // Highest emissions
    };
    
    // Calculate multipliers
    const period_val = periodMult[period] || 1.0;
    const country_val = countryMult[country] || 1.0;
    const mode_val = modeMult[mode] || 1.0;
    const totalMult = period_val * country_val * mode_val;
    
    // Calculate new values
    const newKpi1 = Math.round(baseValues.totalCo2 * totalMult);
    const newKpi2 = (baseValues.co2PerShipment * totalMult).toFixed(1);
    const newKpi3 = Math.max(Math.min((baseValues.renewableEnergy * (country_val / mode_val)).toFixed(2), 0.95), 0.05);
    const newKpi4 = Math.max((baseValues.loadReduction / mode_val).toFixed(1), 5);
    
    // Update KPI cards
    document.getElementById('sust-kpi-1').textContent = newKpi1.toLocaleString();
    document.getElementById('sust-kpi-2').textContent = newKpi2;
    document.getElementById('sust-kpi-3').textContent = newKpi3;
    document.getElementById('sust-kpi-4').textContent = newKpi4 + '%';
    
    // Reinitialize Sustainability charts
    setTimeout(() => {
        initSustainabilityCharts(period, country, mode);
    }, 100);
}

// Update Inventory Data based on selected filters
function updateInventoryData() {
    const period = document.getElementById('inv-period-filter').value;
    const country = document.getElementById('inv-country-filter').value;
    const breakdown = document.getElementById('inv-breakdown-filter').value;
    
    // Define base values
    const baseValues = {
        totalInventory: 42.3,     // Million units
        stockoutRisk: 8.6,        // k SKUs
        workingCapital: 2.456,    // Million €
        stockHealth: 18.5         // %
    };
    
    // Period multipliers
    const periodMult = {
        '7': 0.3,
        '30': 1.0,
        '90': 2.2,
        '365': 8.0
    };
    
    // Country inventory factors
    const countryMult = {
        'all': 1.0,
        'Germany': 1.1,    // Higher inventory
        'France': 0.95,
        'Italy': 1.05,
        'Spain': 0.9
    };
    
    // Breakdown impact
    const breakdownMult = {
        'warehouse': 1.0,
        'product': 0.8,   // Less inventory visible by product
        'region': 1.15    // More inventory visible by region
    };
    
    // Calculate multipliers
    const period_val = periodMult[period] || 1.0;
    const country_val = countryMult[country] || 1.0;
    const breakdown_val = breakdownMult[breakdown] || 1.0;
    const totalMult = period_val * country_val * breakdown_val;
    
    // Calculate new values
    const newKpi1 = (baseValues.totalInventory * totalMult).toFixed(1);
    const newKpi2 = (baseValues.stockoutRisk * totalMult).toFixed(1);
    const newKpi3 = (baseValues.workingCapital * totalMult).toFixed(3);
    const newKpi4 = Math.min((baseValues.stockHealth + (period_val * 5)).toFixed(1), 45);
    
    // Update KPI cards
    document.getElementById('inv-kpi-1').textContent = newKpi1;
    document.getElementById('inv-kpi-2').textContent = newKpi2 + 'k';
    document.getElementById('inv-kpi-3').textContent = newKpi3 + 'M €';
    document.getElementById('inv-kpi-4').textContent = newKpi4 + '%';
    
    // Reinitialize Inventory charts
    setTimeout(() => {
        initInventoryCharts(period, country, breakdown);
    }, 100);
}

// ============================================
// Mobile Menu Setup
// ============================================

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    
    if (!hamburger || !sidebar) return;
    
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-open');
    });
    
    // Close menu when clicking on a menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close sidebar on mobile after selecting menu item
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });
}
