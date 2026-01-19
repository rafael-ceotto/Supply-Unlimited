import { Home, Package, TrendingUp, Users, BarChart3, FileText, ShoppingCart, Building2 } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onMenuChange?: (menuId: string) => void;
}

export function Sidebar({ onMenuChange }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "inventory", icon: Package, label: "Inventory" },
    { id: "sales", icon: TrendingUp, label: "Sales" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
    { id: "companies", icon: Building2, label: "Companies" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "reports", icon: FileText, label: "Reports" },
  ];

  const handleMenuClick = (id: string) => {
    setActiveItem(id);
    if (onMenuChange) {
      onMenuChange(id);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-br from-green-100 via-white to-green-50 border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-green-700">Menu</h2>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 text-center text-xs text-gray-500">
        <p>Supply Unlimited™</p>
        <p>European Division</p>
      </div>
    </div>
  );
}