import { useState } from 'react';
import { Search, TrendingUp, Euro, Sparkles, Award, Package } from 'lucide-react';

interface CompanyMetrics {
  name: string;
  sector: string;
  country: string;
  revenueYTD: number;
  profitYTD: number;
  predictionNextYTD: number;
  revenueChange: number;
  profitChange: number;
  predictionGrowth: number;
}

interface Competitor {
  name: string;
  country: string;
  revenueYTD: number;
  profitYTD: number;
  marketShare: number;
  isOurCompany: boolean;
}

interface Product {
  name: string;
  sku: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

export default function SalesAnalytics() {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('all');
  const [country, setCountry] = useState('all');
  const [year, setYear] = useState('2026');
  const [showResults, setShowResults] = useState(false);
  const [metrics, setMetrics] = useState<CompanyMetrics | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock data - simulando resposta da API
    const mockMetrics: CompanyMetrics = {
      name: companyName || 'TechCorp EU',
      sector: 'Technology',
      country: country === 'all' ? 'Germany' : country,
      revenueYTD: 2850000,
      profitYTD: 520000,
      predictionNextYTD: 3277500,
      revenueChange: 12.5,
      profitChange: 8.3,
      predictionGrowth: 15.0,
    };

    const mockCompetitors: Competitor[] = [
      {
        name: 'Digital Solutions AG',
        country: 'Germany',
        revenueYTD: 3200000,
        profitYTD: 580000,
        marketShare: 28.8,
        isOurCompany: false,
      },
      {
        name: companyName || 'TechCorp EU',
        country: 'Germany',
        revenueYTD: 2850000,
        profitYTD: 520000,
        marketShare: 25.5,
        isOurCompany: true,
      },
      {
        name: 'Innovation Tech SAS',
        country: 'France',
        revenueYTD: 2100000,
        profitYTD: 380000,
        marketShare: 18.9,
        isOurCompany: false,
      },
      {
        name: 'Smart Systems Ltd',
        country: 'Netherlands',
        revenueYTD: 1800000,
        profitYTD: 320000,
        marketShare: 16.2,
        isOurCompany: false,
      },
      {
        name: 'FutureTech Italia',
        country: 'Italy',
        revenueYTD: 1200000,
        profitYTD: 210000,
        marketShare: 10.6,
        isOurCompany: false,
      },
    ];

    const mockProducts: Product[] = [
      {
        name: 'Industrial Drill Kit',
        sku: 'SUP-001',
        category: 'Electronics',
        unitsSold: 1000,
        revenue: 299990,
      },
      {
        name: 'Office Chair Premium',
        sku: 'SUP-002',
        category: 'Furniture',
        unitsSold: 850,
        revenue: 161075,
      },
      {
        name: 'Laptop Stand Adjustable',
        sku: 'SUP-003',
        category: 'Electronics',
        unitsSold: 700,
        revenue: 55993,
      },
      {
        name: 'Printer Paper A4',
        sku: 'SUP-004',
        category: 'Office Supplies',
        unitsSold: 550,
        revenue: 7144,
      },
      {
        name: 'Cable Organizer Set',
        sku: 'SUP-005',
        category: 'Electronics',
        unitsSold: 400,
        revenue: 15996,
      },
    ];

    setMetrics(mockMetrics);
    setCompetitors(mockCompetitors);
    setTopProducts(mockProducts);
    setShowResults(true);
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
    return new Intl.NumberFormat('de-DE').format(value);
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Search Company</h3>
            <p className="text-sm text-gray-600">Find detailed sales analytics and market insights</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name..."
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            >
              <option value="all">All Sectors</option>
              <option value="technology">Technology</option>
              <option value="industrial">Industrial</option>
              <option value="logistics">Logistics</option>
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

          <button
            type="submit"
            className="mt-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>
      </div>

      {/* Results Container */}
      {showResults && metrics && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Company Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{metrics.name}</h2>
              <p className="text-green-100">{metrics.sector} • {metrics.country}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              Active
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-5">
            {/* Revenue YTD */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500 hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-gray-600">Revenue YTD</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(metrics.revenueYTD)}
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{metrics.revenueChange}%</span>
                <span className="text-gray-500">from last year</span>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Profit YTD */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500 hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-gray-600">Profit YTD</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(metrics.profitYTD)}
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{metrics.profitChange}%</span>
                <span className="text-gray-500">from last year</span>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Prediction */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500 hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-sm font-medium text-gray-600">Prediction Next Year</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(metrics.predictionNextYTD)}
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{metrics.predictionGrowth}%</span>
                <span className="text-gray-500">expected growth</span>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          {/* Ranking Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Market Position - Competitor Ranking</h3>
            </div>

            <div className="space-y-1">
              {competitors.map((competitor, index) => {
                const rank = index + 1;
                const medalColor = rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-600' : 'text-gray-400';
                
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-6 items-center gap-4 py-4 border-b border-gray-100 last:border-0 ${
                      competitor.isOurCompany ? 'bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500 pl-3' : ''
                    }`}
                  >
                    <div className={`text-2xl font-bold ${medalColor}`}>
                      #{rank}
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {competitor.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{competitor.name}</div>
                        <div className="text-sm text-gray-500">{competitor.country}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">{formatCurrency(competitor.revenueYTD)}</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(competitor.profitYTD)}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{competitor.marketShare}%</span>
                      {competitor.isOurCompany && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          YOU
                        </span>
                      )}
                      {!competitor.isOurCompany && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          Competitor
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
              <Package className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Top Selling Products</h3>
            </div>

            <div className="space-y-3">
              {topProducts.map((product, index) => {
                const rank = index + 1;
                const isTop = rank <= 3;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 hover:translate-x-1 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        isTop ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rank}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category} • SKU: {product.sku}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{formatNumber(product.unitsSold)}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showResults && (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for a Company</h3>
          <p className="text-gray-600">Enter a company name above to view detailed sales analytics and insights</p>
        </div>
      )}
    </div>
  );
}