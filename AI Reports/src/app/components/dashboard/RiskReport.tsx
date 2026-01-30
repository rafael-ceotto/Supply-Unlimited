import { useState } from 'react';
import { AlertTriangle, TrendingDown, Truck, AlertOctagon, MapPin, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Exception {
  sku: string;
  country: string;
  problem: string;
  impact: number;
  severity: 'critical' | 'high' | 'medium';
}

export function RiskReport() {
  const [country, setCountry] = useState('all');
  const [sku, setSku] = useState('');
  const [supplier, setSupplier] = useState('all');
  const [period, setPeriod] = useState('last30days');

  // Mock data for KPIs
  const kpis = {
    skusAtRisk: 23.5,
    highLeadTime: 156,
    criticalSuppliers: 8,
    otif: 87.2,
  };

  // Mock data for delays by corridor
  const corridorData = [
    { name: 'Alpine Routes', delays: 42, onTime: 158 },
    { name: 'North Italy', delays: 38, onTime: 172 },
    { name: 'Iberian Peninsula', delays: 31, onTime: 189 },
    { name: 'Baltic Sea', delays: 28, onTime: 192 },
    { name: 'Central Europe', delays: 24, onTime: 216 },
    { name: 'Benelux', delays: 18, onTime: 242 },
  ];

  // Mock data for top exceptions
  const exceptions: Exception[] = [
    { sku: 'SUP-2847', country: 'Spain', problem: 'Stock Out Risk', impact: 45000, severity: 'critical' },
    { sku: 'SUP-1923', country: 'Italy', problem: 'Delayed Shipment', impact: 38500, severity: 'critical' },
    { sku: 'SUP-3156', country: 'France', problem: 'Supplier Issue', impact: 32000, severity: 'high' },
    { sku: 'SUP-4782', country: 'Germany', problem: 'Quality Hold', impact: 28000, severity: 'high' },
    { sku: 'SUP-5921', country: 'Poland', problem: 'Transport Delay', impact: 24500, severity: 'high' },
    { sku: 'SUP-6834', country: 'Netherlands', problem: 'Customs Hold', impact: 19000, severity: 'medium' },
    { sku: 'SUP-7245', country: 'Belgium', problem: 'Damaged Goods', impact: 17500, severity: 'medium' },
    { sku: 'SUP-8156', country: 'Austria', problem: 'Missing Documents', impact: 15000, severity: 'medium' },
    { sku: 'SUP-9023', country: 'Portugal', problem: 'Weather Delay', impact: 12000, severity: 'medium' },
    { sku: 'SUP-1047', country: 'Czech Republic', problem: 'Warehouse Full', impact: 9500, severity: 'medium' },
  ];

  // Mock data for country risk levels
  const countryRisks = {
    'Germany': 'low',
    'France': 'medium',
    'Italy': 'high',
    'Spain': 'critical',
    'Netherlands': 'low',
    'Belgium': 'low',
    'Poland': 'medium',
    'Austria': 'medium',
    'Portugal': 'high',
    'Czech Republic': 'medium',
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'fill-red-600';
      case 'high': return 'fill-orange-500';
      case 'medium': return 'fill-yellow-400';
      case 'low': return 'fill-green-400';
      default: return 'fill-gray-300';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
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

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk & Exceptions Report</h1>
            <p className="text-gray-600">Supply Chain Risk Analysis - European Operations</p>
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            >
              <option value="all">All Countries</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Netherlands">Netherlands</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Filter by SKU..."
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            >
              <option value="all">All Suppliers</option>
              <option value="supplier1">Supplier A</option>
              <option value="supplier2">Supplier B</option>
              <option value="supplier3">Supplier C</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* SKUs at Risk */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">SKUs at Risk</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.skusAtRisk}%</div>
          <div className="text-sm text-red-600">Stock out risk</div>
        </div>

        {/* High Lead Time Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">High Lead Time</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.highLeadTime}</div>
          <div className="text-sm text-orange-600">Orders above P95</div>
        </div>

        {/* Critical Suppliers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Critical Suppliers</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.criticalSuppliers}</div>
          <div className="text-sm text-yellow-600">High dependency</div>
        </div>

        {/* OTIF Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">OTIF Performance</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.otif}%</div>
          <div className="text-sm text-green-600">On-time, in-full</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* EU Risk Heatmap */}
        <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
            <MapPin className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Risk Level by Country</h3>
          </div>
          
          <div className="flex items-center justify-center py-8">
            {/* Simplified EU Map */}
            <svg viewBox="0 0 600 600" className="w-full h-96">
              {/* Background */}
              <rect width="600" height="600" fill="#f3f4f6" />
              
              {/* Stylized countries */}
              <g>
                {/* Germany - Center */}
                <rect x="280" y="200" width="80" height="80" className={getRiskColor(countryRisks['Germany'])} stroke="#fff" strokeWidth="2" />
                <text x="320" y="245" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">DE</text>
                
                {/* France - West */}
                <rect x="180" y="220" width="80" height="100" className={getRiskColor(countryRisks['France'])} stroke="#fff" strokeWidth="2" />
                <text x="220" y="275" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">FR</text>
                
                {/* Italy - South */}
                <polygon points="340,300 380,300 420,380 360,420 320,380" className={getRiskColor(countryRisks['Italy'])} stroke="#fff" strokeWidth="2" />
                <text x="360" y="360" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">IT</text>
                
                {/* Spain - Southwest */}
                <rect x="100" y="320" width="100" height="80" className={getRiskColor(countryRisks['Spain'])} stroke="#fff" strokeWidth="2" />
                <text x="150" y="365" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">ES</text>
                
                {/* Netherlands - North */}
                <rect x="260" y="140" width="60" height="50" className={getRiskColor(countryRisks['Netherlands'])} stroke="#fff" strokeWidth="2" />
                <text x="290" y="170" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">NL</text>
                
                {/* Belgium - Northwest */}
                <rect x="220" y="160" width="50" height="50" className={getRiskColor(countryRisks['Belgium'])} stroke="#fff" strokeWidth="2" />
                <text x="245" y="190" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">BE</text>
                
                {/* Poland - East */}
                <rect x="380" y="180" width="80" height="90" className={getRiskColor(countryRisks['Poland'])} stroke="#fff" strokeWidth="2" />
                <text x="420" y="230" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">PL</text>
                
                {/* Austria - Southeast */}
                <rect x="340" y="260" width="70" height="50" className={getRiskColor(countryRisks['Austria'])} stroke="#fff" strokeWidth="2" />
                <text x="375" y="290" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">AT</text>
                
                {/* Portugal - West */}
                <rect x="60" y="340" width="50" height="70" className={getRiskColor(countryRisks['Portugal'])} stroke="#fff" strokeWidth="2" />
                <text x="85" y="380" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">PT</text>
                
                {/* Czech Republic - East Center */}
                <rect x="370" y="220" width="60" height="50" className={getRiskColor(countryRisks['Czech Republic'])} stroke="#fff" strokeWidth="2" />
                <text x="400" y="250" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">CZ</text>
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-600">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-600">Critical Risk</span>
            </div>
          </div>
        </div>

        {/* Risk Insights Panel */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Critical Alert</h4>
              <p className="text-sm text-gray-600">Spain showing 23% increase in stock-out risks</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Supply Chain Issue</h4>
              <p className="text-sm text-gray-600">Alpine routes experiencing delays due to weather</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Supplier Dependency</h4>
              <p className="text-sm text-gray-600">8 suppliers exceed 40% dependency threshold</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-red-200">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Recommended Actions</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>Increase safety stock for high-risk SKUs</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>Diversify supplier base in critical categories</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>Review alternative logistics routes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delays by Corridor Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <Truck className="w-5 h-5 text-red-600" />
          <h3 className="text-xl font-semibold text-gray-900">Delays by Logistics Corridor</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={corridorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Bar dataKey="delays" fill="#ef4444" name="Delayed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="onTime" fill="#10b981" name="On Time" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 10 Exceptions Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-xl font-semibold text-gray-900">Top 10 Exceptions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Problem Type</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Financial Impact</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Severity</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.map((exception, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index < 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm font-semibold text-gray-900">{exception.sku}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{exception.country}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{exception.problem}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-600">{formatCurrency(exception.impact)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(exception.severity)}`}>
                      {exception.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
