import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Filter } from "lucide-react";
import { useState } from "react";

export function ComparisonCharts() {
  const [chartFilters, setChartFilters] = useState({
    city: "all",
    company: "all",
    store: "all",
    product: "all",
  });

  const salesData = [
    { month: "Jan", germany: 45000, france: 38000, italy: 32000, spain: 28000, netherlands: 25000 },
    { month: "Feb", germany: 52000, france: 42000, italy: 35000, spain: 31000, netherlands: 28000 },
    { month: "Mar", germany: 48000, france: 45000, italy: 38000, spain: 33000, netherlands: 30000 },
    { month: "Apr", germany: 61000, france: 48000, italy: 42000, spain: 36000, netherlands: 33000 },
    { month: "May", germany: 55000, france: 51000, italy: 45000, spain: 39000, netherlands: 35000 },
    { month: "Jun", germany: 67000, france: 54000, italy: 48000, spain: 42000, netherlands: 38000 },
  ];

  const inventoryData = [
    { store: "Germany", items: 8456, value: 245000 },
    { store: "France", items: 6234, value: 198000 },
    { store: "Italy", items: 5123, value: 167000 },
    { store: "Spain", items: 4567, value: 145000 },
    { store: "Netherlands", items: 3890, value: 128000 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Sales Comparison Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Sales Comparison by Country
          </h3>
          <Filter className="w-5 h-5 text-gray-500" />
        </div>

        {/* Chart Filters */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Select
            value={chartFilters.city}
            onValueChange={(value) => setChartFilters({ ...chartFilters, city: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="berlin">Berlin</SelectItem>
              <SelectItem value="paris">Paris</SelectItem>
              <SelectItem value="rome">Rome</SelectItem>
              <SelectItem value="madrid">Madrid</SelectItem>
              <SelectItem value="amsterdam">Amsterdam</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={chartFilters.company}
            onValueChange={(value) => setChartFilters({ ...chartFilters, company: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="techcorp">TechCorp EU</SelectItem>
              <SelectItem value="globalind">Global Industries</SelectItem>
              <SelectItem value="eurosupply">EuroSupply GmbH</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={chartFilters.store}
            onValueChange={(value) => setChartFilters({ ...chartFilters, store: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="store-001">Store #001 - Berlin</SelectItem>
              <SelectItem value="store-002">Store #002 - Paris</SelectItem>
              <SelectItem value="store-003">Store #003 - Rome</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={chartFilters.product}
            onValueChange={(value) => setChartFilters({ ...chartFilters, product: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="germany" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="france" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="italy" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="spain" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="netherlands" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Value Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Inventory Value by Store
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="store" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="items" fill="#22c55e" name="Total Items" />
            <Bar dataKey="value" fill="#3b82f6" name="Value (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}