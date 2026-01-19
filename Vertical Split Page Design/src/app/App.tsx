import { useState } from "react";
import { TopBar } from "@/app/components/dashboard/TopBar";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { DashboardCards } from "@/app/components/dashboard/DashboardCards";
import { SearchFilters } from "@/app/components/dashboard/SearchFilters";
import { StockTable } from "@/app/components/dashboard/StockTable";
import { ComparisonCharts } from "@/app/components/dashboard/ComparisonCharts";
import { ExportSection } from "@/app/components/dashboard/ExportSection";
import { CompanyManagement } from "@/app/components/dashboard/CompanyManagement";
import { WarehouseLocation } from "@/app/components/dashboard/WarehouseLocation";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
    // Implementar busca em tempo real aqui
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    console.log("Filters updated:", newFilters);
    // Implementar filtros aqui
  };

  const handleMenuChange = (menuId: string) => {
    setActiveMenu(menuId);
  };

  const handleViewLocation = (item: any) => {
    // Dados mockados de localização do warehouse
    const warehouseData = [
      { aisle: "A1", shelf: "S1", box: "B01", quantity: 15, lastUpdated: "10:30 AM" },
      { aisle: "A1", shelf: "S1", box: "B02", quantity: 12, lastUpdated: "10:25 AM" },
      { aisle: "A1", shelf: "S2", box: "B01", quantity: 8, lastUpdated: "09:45 AM" },
      { aisle: "A2", shelf: "S1", box: "B01", quantity: 5, lastUpdated: "11:15 AM" },
      { aisle: "A2", shelf: "S1", box: "B02", quantity: 3, lastUpdated: "11:10 AM" },
      { aisle: "A2", shelf: "S3", box: "B01", quantity: 2, lastUpdated: "08:30 AM" },
    ];

    setSelectedProduct({
      ...item,
      warehouseData,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <TopBar userName="João Silva" />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onMenuChange={handleMenuChange} />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeMenu === "companies" ? (
              <>
                <CompanyManagement />
              </>
            ) : (
              <>
                {/* Page Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Supply Unlimited - European Operations</p>
                </div>

                {/* Dashboard Cards */}
                <DashboardCards />

                {/* Search and Filters */}
                <SearchFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

                {/* Warehouse Location Details - Shown when product is selected */}
                {selectedProduct && (
                  <WarehouseLocation
                    productName={selectedProduct.name}
                    productSku={selectedProduct.sku}
                    storeName={selectedProduct.store}
                    warehouseData={selectedProduct.warehouseData}
                    onClose={() => setSelectedProduct(null)}
                  />
                )}

                {/* Stock Table */}
                <StockTable onViewLocation={handleViewLocation} />

                {/* Comparison Charts */}
                <ComparisonCharts />

                {/* Export Section */}
                <ExportSection />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}