import { Search, Filter } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
}

export function SearchFilters({ onSearch, onFilterChange }: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Search Inventory</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products, SKU, or category..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Store Filter */}
        <Select onValueChange={(value) => onFilterChange({ store: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            <SelectItem value="germany">Germany</SelectItem>
            <SelectItem value="france">France</SelectItem>
            <SelectItem value="italy">Italy</SelectItem>
            <SelectItem value="spain">Spain</SelectItem>
            <SelectItem value="netherlands">Netherlands</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select onValueChange={(value) => onFilterChange({ category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="office">Office Supplies</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Filters - Expanded */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Select onValueChange={(value) => onFilterChange({ stock: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ city: value })}>
          <SelectTrigger>
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

        <Select onValueChange={(value) => onFilterChange({ company: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="techcorp">TechCorp EU</SelectItem>
            <SelectItem value="globalind">Global Industries</SelectItem>
            <SelectItem value="eurosupply">EuroSupply GmbH</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ product: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="new">New Products</SelectItem>
            <SelectItem value="bestseller">Best Sellers</SelectItem>
            <SelectItem value="clearance">Clearance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}