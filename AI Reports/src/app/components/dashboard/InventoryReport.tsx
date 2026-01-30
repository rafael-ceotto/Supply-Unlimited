import { useState } from 'react';
import { Package, TrendingUp, DollarSign, AlertTriangle, MapPin, Warehouse, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CriticalSKU {
  sku: string;
  name: string;
  warehouse: string;
  country: string;
  status: 'slow-moving' | 'insufficient' | 'excess';
  doh: number;
  value: number;
  turnover: number;
}

export function InventoryReport() {
  const [country, setCountry] = useState('all');
  const [warehouse, setWarehouse] = useState('all');
  const [sku, setSku] = useState('');
  const [period, setPeriod] = useState('last30days');

  // Mock data for KPIs
  const kpis = {
    daysOfInventory: 42.5,
    turnoverRate: 8.6,
    capitalImmobilized: 3450000,
    outOfSafetyStock: 18.5,
  };

  // Mock data for turnover by distribution center
  const dcTurnoverData = [
    { name: 'Milano DC', turnover: 12.5, target: 10 },
    { name: 'Roma DC', turnover: 9.8, target: 10 },
    { name: 'Berlin DC', turnover: 11.2, target: 10 },
    { name: 'Paris DC', turnover: 8.5, target: 10 },
    { name: 'Madrid DC', turnover: 7.3, target: 10 },
    { name: 'Amsterdam DC', turnover: 10.8, target: 10 },
  ];

  // Mock data for capital vs sales over time
  const capitalTrendData = [
    { month: 'Jan', capital: 3200, sales: 2800 },
    { month: 'Feb', capital: 3100, sales: 2900 },
    { month: 'Mar', capital: 3350, sales: 3100 },
    { month: 'Apr', capital: 3400, sales: 3000 },
    { month: 'May', capital: 3450, sales: 3200 },
    { month: 'Jun', capital: 3380, sales: 3400 },
  ];

  // Mock data for country inventory risk
  const countryInventoryRisk = {
    'Germany': 'good',
    'France': 'medium',
    'Italy': 'high',
    'Spain': 'high',
    'Netherlands': 'good',
    'Belgium': 'good',
    'Poland': 'medium',
    'Austria': 'medium',
    'Portugal': 'medium',
    'Czech Republic': 'medium',
  };

  // Mock data for critical SKUs
  const criticalSKUs: CriticalSKU[] = [
    { sku: 'SUP-8471', name: 'Industrial Pump', warehouse: 'Milano DC', country: 'Italy', status: 'slow-moving', doh: 125, value: 185000, turnover: 2.9 },
    { sku: 'SUP-3294', name: 'Electric Motor', warehouse: 'Roma DC', country: 'Italy', status: 'excess', doh: 98, value: 142000, turnover: 3.7 },
    { sku: 'SUP-5612', name: 'Hydraulic Valve', warehouse: 'Madrid DC', country: 'Spain', status: 'slow-moving', doh: 110, value: 128000, turnover: 3.3 },
    { sku: 'SUP-7823', name: 'Control Panel', warehouse: 'Milano DC', country: 'Italy', status: 'insufficient', doh: 8, value: 95000, turnover: 45.6 },
    { sku: 'SUP-2145', name: 'Safety Sensor', warehouse: 'Paris DC', country: 'France', status: 'insufficient', doh: 12, value: 78000, turnover: 30.4 },
    { sku: 'SUP-9456', name: 'Bearing Kit', warehouse: 'Berlin DC', country: 'Germany', status: 'excess', doh: 85, value: 72000, turnover: 4.3 },
    { sku: 'SUP-1738', name: 'Cooling Unit', warehouse: 'Roma DC', country: 'Italy', status: 'slow-moving', doh: 92, value: 68000, turnover: 4.0 },
    { sku: 'SUP-4921', name: 'Filter Assembly', warehouse: 'Amsterdam DC', country: 'Netherlands', status: 'excess', doh: 78, value: 54000, turnover: 4.7 },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'fill-red-500';
      case 'medium': return 'fill-orange-400';
      case 'good': return 'fill-green-400';
      default: return 'fill-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'slow-moving': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'excess': return 'bg-red-100 text-red-700 border-red-300';
      case 'insufficient': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'slow-moving': return 'Slow Moving';
      case 'excess': return 'Excess Stock';
      case 'insufficient': return 'Insufficient';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory & Working Capital Report</h1>
            <p className="text-gray-600">Stock Optimization & Capital Efficiency - European Operations</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              <option value="all">All Countries</option>
              <option value="Italy">Italy</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Spain">Spain</option>
              <option value="Netherlands">Netherlands</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Center</label>
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              <option value="all">All Centers</option>
              <option value="milano">Milano DC</option>
              <option value="roma">Roma DC</option>
              <option value="berlin">Berlin DC</option>
              <option value="paris">Paris DC</option>
              <option value="madrid">Madrid DC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Filter by SKU..."
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Days of Inventory */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Days of Inventory</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(kpis.daysOfInventory)}</div>
          <div className="text-sm text-blue-600">DOH average</div>
        </div>

        {/* Turnover Rate */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Turnover Rate</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(kpis.turnoverRate)}x</div>
          <div className="text-sm text-green-600">Annual turnover</div>
        </div>

        {/* Capital Immobilized */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Capital Immobilized</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(kpis.capitalImmobilized)}</div>
          <div className="text-sm text-orange-600">In inventory</div>
        </div>

        {/* Out of Safety Stock */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Out of Safety Stock</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(kpis.outOfSafetyStock)}%</div>
          <div className="text-sm text-red-600">SKUs at risk</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* EU Inventory Risk Map */}
        <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Immobilized Capital by Country</h3>
          </div>
          
          <div className="flex items-center justify-center py-8">
            {/* Simplified EU Map with emphasis on Italy */}
            <svg viewBox="0 0 600 600" className="w-full h-96">
              {/* Background */}
              <rect width="600" height="600" fill="#f9fafb" />
              
              {/* Stylized countries */}
              <g>
                {/* Germany - Center */}
                <rect x="280" y="200" width="80" height="80" className={getRiskColor(countryInventoryRisk['Germany'])} stroke="#fff" strokeWidth="2" />
                <text x="320" y="245" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">DE</text>
                
                {/* France - West */}
                <rect x="180" y="220" width="80" height="100" className={getRiskColor(countryInventoryRisk['France'])} stroke="#fff" strokeWidth="2" />
                <text x="220" y="275" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">FR</text>
                
                {/* Italy - South - HIGHLIGHTED */}
                <polygon points="340,300 380,300 420,380 360,420 320,380" className={getRiskColor(countryInventoryRisk['Italy'])} stroke="#fbbf24" strokeWidth="4" />
                <text x="360" y="360" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">IT</text>
                <circle cx="340" cy="330" r="6" fill="#fbbf24" />
                <text x="310" y="335" fontSize="10" fill="#111" fontWeight="bold">Milano</text>
                <circle cx="365" cy="380" r="6" fill="#fbbf24" />
                <text x="330" y="400" fontSize="10" fill="#111" fontWeight="bold">Roma</text>
                
                {/* Spain - Southwest */}
                <rect x="100" y="320" width="100" height="80" className={getRiskColor(countryInventoryRisk['Spain'])} stroke="#fff" strokeWidth="2" />
                <text x="150" y="365" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">ES</text>
                
                {/* Netherlands - North */}
                <rect x="260" y="140" width="60" height="50" className={getRiskColor(countryInventoryRisk['Netherlands'])} stroke="#fff" strokeWidth="2" />
                <text x="290" y="170" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">NL</text>
                
                {/* Belgium - Northwest */}
                <rect x="220" y="160" width="50" height="50" className={getRiskColor(countryInventoryRisk['Belgium'])} stroke="#fff" strokeWidth="2" />
                <text x="245" y="190" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">BE</text>
                
                {/* Poland - East */}
                <rect x="380" y="180" width="80" height="90" className={getRiskColor(countryInventoryRisk['Poland'])} stroke="#fff" strokeWidth="2" />
                <text x="420" y="230" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">PL</text>
                
                {/* Austria - Southeast */}
                <rect x="340" y="260" width="70" height="50" className={getRiskColor(countryInventoryRisk['Austria'])} stroke="#fff" strokeWidth="2" />
                <text x="375" y="290" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">AT</text>
                
                {/* Portugal - West */}
                <rect x="60" y="340" width="50" height="70" className={getRiskColor(countryInventoryRisk['Portugal'])} stroke="#fff" strokeWidth="2" />
                <text x="85" y="380" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">PT</text>
                
                {/* Czech Republic - East Center */}
                <rect x="370" y="220" width="60" height="50" className={getRiskColor(countryInventoryRisk['Czech Republic'])} stroke="#fff" strokeWidth="2" />
                <text x="400" y="250" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">CZ</text>
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-600">Good Turnover</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">High Capital Lock</span>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Warehouse className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">⚠️ Italy Critical</h4>
              <p className="text-sm text-gray-600">€1.2M immobilized in slow-moving SKUs in Italian DCs</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Capital Opportunity</h4>
              <p className="text-sm text-gray-600">Reducing DOH by 10 days could free up €810K</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Stock-out Risk</h4>
              <p className="text-sm text-gray-600">23 SKUs below safety stock threshold</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Optimization Actions</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Liquidate slow-moving inventory in Milano</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Transfer excess from Roma to high-demand DCs</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Accelerate replenishment for critical SKUs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Turnover by DC */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Inventory Turnover by Distribution Center</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dcTurnoverData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'Turnover Rate (x/year)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Bar dataKey="turnover" fill="#3b82f6" name="Actual Turnover" radius={[8, 8, 0, 0]} />
            <Bar dataKey="target" fill="#94a3b8" name="Target" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 pt-4 border-t border-gray-100 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">Best Performer:</span>
              <span className="ml-2 font-bold text-green-600">Milano DC (12.5x)</span>
            </div>
            <div>
              <span className="text-gray-600">Needs Improvement:</span>
              <span className="ml-2 font-bold text-orange-600">Madrid DC (7.3x)</span>
            </div>
            <div>
              <span className="text-gray-600">Network Average:</span>
              <span className="ml-2 font-bold text-blue-600">10.0x target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Capital vs Sales Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Immobilized Capital vs Sales Evolution</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={capitalTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'Value (K€)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="capital" 
              stroke="#f97316" 
              strokeWidth={3} 
              name="Capital Immobilized" 
              dot={{ fill: '#f97316', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#10b981" 
              strokeWidth={3} 
              name="Sales Revenue" 
              dot={{ fill: '#10b981', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Capital Efficiency Ratio</p>
            <p className="text-2xl font-bold text-orange-600">1.02</p>
            <p className="text-xs text-gray-500">Capital / Sales</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">YTD Sales Growth</p>
            <p className="text-2xl font-bold text-green-600">+21.4%</p>
            <p className="text-xs text-gray-500">vs last year</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Target Capital Ratio</p>
            <p className="text-2xl font-bold text-blue-600">0.85</p>
            <p className="text-xs text-gray-500">Optimization goal</p>
          </div>
        </div>
      </div>

      {/* Critical SKUs Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">Critical SKUs - Requires Action</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Warehouse</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">DOH</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Turnover</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Value</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {criticalSKUs.map((item, index) => (
                <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  item.country === 'Italy' ? 'bg-yellow-50/50' : ''
                }`}>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm font-semibold text-gray-900">{item.sku}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{item.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{item.warehouse}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${item.country === 'Italy' ? 'text-orange-700' : 'text-gray-900'}`}>
                        {item.country}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-semibold ${
                      item.doh > 90 ? 'text-red-600' : item.doh < 15 ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {item.doh} days
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-gray-900">{formatNumber(item.turnover)}x</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-gray-900">{formatCurrency(item.value)}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Italy Focus: High Priority</h4>
              <p className="text-sm text-gray-700 mb-2">
                4 out of 8 critical SKUs are located in Italian distribution centers (Milano and Roma). 
                Combined value of €518K immobilized in slow-moving and excess inventory.
              </p>
              <p className="text-sm font-semibold text-orange-700">
                Recommended Action: Initiate cross-dock transfer to Germany and Netherlands high-demand markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
