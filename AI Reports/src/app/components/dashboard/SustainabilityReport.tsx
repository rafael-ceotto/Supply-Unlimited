import { useState } from 'react';
import { Leaf, TrendingDown, Ship, Truck, Train, MapPin, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function SustainabilityReport() {
  const [country, setCountry] = useState('all');
  const [modal, setModal] = useState('all');
  const [period, setPeriod] = useState('last30days');

  // Mock data for KPIs
  const kpis = {
    totalCO2: 284500,
    co2PerShipment: 42.3,
    co2PerEuro: 0.18,
    lowEmissionPercent: 34.5,
  };

  // Mock data for emissions by transport mode
  const modalData = [
    { name: 'Jan', road: 8500, rail: 2400, sea: 1800 },
    { name: 'Feb', road: 8200, rail: 2600, sea: 1900 },
    { name: 'Mar', road: 9100, rail: 2800, sea: 2100 },
    { name: 'Apr', road: 8800, rail: 3000, sea: 2200 },
    { name: 'May', road: 8500, rail: 3200, sea: 2400 },
    { name: 'Jun', road: 8000, rail: 3400, sea: 2600 },
  ];

  // Mock data for emissions trend
  const trendData = [
    { month: 'Jan', emissions: 12700, target: 13000 },
    { month: 'Feb', emissions: 12700, target: 12800 },
    { month: 'Mar', emissions: 14000, target: 12600 },
    { month: 'Apr', emissions: 14000, target: 12400 },
    { month: 'May', emissions: 14100, target: 12200 },
    { month: 'Jun', emissions: 14000, target: 12000 },
  ];

  // Mock data for country emissions
  const countryEmissions = {
    'Germany': 'medium',
    'France': 'low',
    'Italy': 'medium',
    'Spain': 'high',
    'Netherlands': 'low',
    'Belgium': 'low',
    'Poland': 'high',
    'Austria': 'medium',
    'Portugal': 'medium',
    'Czech Republic': 'medium',
  };

  const getEmissionColor = (level: string) => {
    switch (level) {
      case 'high': return 'fill-red-400';
      case 'medium': return 'fill-yellow-400';
      case 'low': return 'fill-green-400';
      default: return 'fill-gray-300';
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CO₂ & Sustainability Report</h1>
            <p className="text-gray-600">Environmental Impact Analysis - European Operations</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
            <select
              value={modal}
              onChange={(e) => setModal(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            >
              <option value="all">All Modes</option>
              <option value="road">Road</option>
              <option value="rail">Rail</option>
              <option value="sea">Sea</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Total CO2 Emissions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Total CO₂</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(kpis.totalCO2)}</div>
          <div className="text-sm text-green-600">kg emissions</div>
        </div>

        {/* CO2 per Shipment */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ship className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">CO₂ per Shipment</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.co2PerShipment}</div>
          <div className="text-sm text-blue-600">kg / shipment</div>
        </div>

        {/* CO2 per Euro */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">CO₂ per € Revenue</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.co2PerEuro}</div>
          <div className="text-sm text-purple-600">kg / €</div>
        </div>

        {/* Low Emission Transport */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Train className="w-6 h-6 text-teal-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">Low Emission</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.lowEmissionPercent}%</div>
          <div className="text-sm text-teal-600">of total shipments</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* EU Emissions Map */}
        <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">CO₂ Intensity by Country</h3>
          </div>
          
          <div className="flex items-center justify-center py-8">
            {/* Simplified EU Map */}
            <svg viewBox="0 0 600 600" className="w-full h-96">
              {/* Background */}
              <rect width="600" height="600" fill="#f9fafb" />
              
              {/* Stylized countries */}
              <g>
                {/* Germany - Center */}
                <rect x="280" y="200" width="80" height="80" className={getEmissionColor(countryEmissions['Germany'])} stroke="#fff" strokeWidth="2" />
                <text x="320" y="245" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">DE</text>
                
                {/* France - West */}
                <rect x="180" y="220" width="80" height="100" className={getEmissionColor(countryEmissions['France'])} stroke="#fff" strokeWidth="2" />
                <text x="220" y="275" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">FR</text>
                
                {/* Italy - South */}
                <polygon points="340,300 380,300 420,380 360,420 320,380" className={getEmissionColor(countryEmissions['Italy'])} stroke="#fff" strokeWidth="2" />
                <text x="360" y="360" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">IT</text>
                
                {/* Spain - Southwest */}
                <rect x="100" y="320" width="100" height="80" className={getEmissionColor(countryEmissions['Spain'])} stroke="#fff" strokeWidth="2" />
                <text x="150" y="365" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">ES</text>
                
                {/* Netherlands - North */}
                <rect x="260" y="140" width="60" height="50" className={getEmissionColor(countryEmissions['Netherlands'])} stroke="#fff" strokeWidth="2" />
                <text x="290" y="170" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">NL</text>
                
                {/* Belgium - Northwest */}
                <rect x="220" y="160" width="50" height="50" className={getEmissionColor(countryEmissions['Belgium'])} stroke="#fff" strokeWidth="2" />
                <text x="245" y="190" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">BE</text>
                
                {/* Poland - East */}
                <rect x="380" y="180" width="80" height="90" className={getEmissionColor(countryEmissions['Poland'])} stroke="#fff" strokeWidth="2" />
                <text x="420" y="230" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">PL</text>
                
                {/* Austria - Southeast */}
                <rect x="340" y="260" width="70" height="50" className={getEmissionColor(countryEmissions['Austria'])} stroke="#fff" strokeWidth="2" />
                <text x="375" y="290" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">AT</text>
                
                {/* Portugal - West */}
                <rect x="60" y="340" width="50" height="70" className={getEmissionColor(countryEmissions['Portugal'])} stroke="#fff" strokeWidth="2" />
                <text x="85" y="380" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">PT</text>
                
                {/* Czech Republic - East Center */}
                <rect x="370" y="220" width="60" height="50" className={getEmissionColor(countryEmissions['Czech Republic'])} stroke="#fff" strokeWidth="2" />
                <text x="400" y="250" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">CZ</text>
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-600">Low Intensity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm text-gray-600">Medium Intensity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm text-gray-600">High Intensity</span>
            </div>
          </div>
        </div>

        {/* Sustainability Insights Panel */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">ESG Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Great Progress</h4>
              <p className="text-sm text-gray-600">15% reduction in CO₂ per shipment compared to last quarter</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Modal Shift Success</h4>
              <p className="text-sm text-gray-600">34.5% of shipments now use low-emission transport</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-teal-500">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">EU Compliance</h4>
              <p className="text-sm text-gray-600">Aligned with EU Green Deal targets for 2026</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Improvement Actions</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>Increase rail transport in Central Europe</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>Partner with electric fleet providers</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>Optimize route planning for efficiency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emissions by Transport Mode */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <Truck className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Emissions by Transport Mode</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Bar dataKey="road" stackId="a" fill="#ef4444" name="Road" radius={[0, 0, 0, 0]} />
            <Bar dataKey="rail" stackId="a" fill="#10b981" name="Rail" radius={[0, 0, 0, 0]} />
            <Bar dataKey="sea" stackId="a" fill="#3b82f6" name="Sea" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <Truck className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-sm text-gray-600">Road Transport</div>
              <div className="text-xl font-bold text-gray-900">52,100 kg</div>
              <div className="text-xs text-red-600">Highest emissions</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Train className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Rail Transport</div>
              <div className="text-xl font-bold text-gray-900">17,400 kg</div>
              <div className="text-xs text-green-600">Most efficient</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Ship className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Sea Transport</div>
              <div className="text-xl font-bold text-gray-900">12,800 kg</div>
              <div className="text-xs text-blue-600">Long distance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Emissions Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">CO₂ Emissions Trend vs Target</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft' }} />
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
              dataKey="emissions" 
              stroke="#10b981" 
              strokeWidth={3} 
              name="Actual Emissions" 
              dot={{ fill: '#10b981', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#6b7280" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              name="Target" 
              dot={{ fill: '#6b7280', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 pt-4 border-t border-gray-100 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Performance vs Target</p>
              <p className="text-2xl font-bold text-green-600">-8.3%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">YTD Progress</p>
              <p className="text-2xl font-bold text-gray-900">82,300 kg</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Target for 2026</p>
              <p className="text-2xl font-bold text-gray-900">144,000 kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
