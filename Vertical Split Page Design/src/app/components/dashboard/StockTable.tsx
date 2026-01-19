import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { MapPin } from "lucide-react";

interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  store: string;
  stock: number;
  price: number;
  status: string;
}

interface StockTableProps {
  onViewLocation?: (item: StockItem) => void;
}

export function StockTable({ onViewLocation }: StockTableProps) {
  const stockData: StockItem[] = [
    {
      id: "1",
      sku: "SUP-001-DE",
      name: "Industrial Drill Kit",
      category: "Industrial",
      store: "Germany",
      stock: 45,
      price: 299.99,
      status: "in-stock",
    },
    {
      id: "2",
      sku: "SUP-002-FR",
      name: "Office Chair Premium",
      category: "Furniture",
      store: "France",
      stock: 12,
      price: 189.50,
      status: "low-stock",
    },
    {
      id: "3",
      sku: "SUP-003-IT",
      name: "Laptop Stand Adjustable",
      category: "Electronics",
      store: "Italy",
      stock: 0,
      price: 79.99,
      status: "out-of-stock",
    },
    {
      id: "4",
      sku: "SUP-004-ES",
      name: "Printer Paper A4 (500 sheets)",
      category: "Office Supplies",
      store: "Spain",
      stock: 234,
      price: 12.99,
      status: "in-stock",
    },
    {
      id: "5",
      sku: "SUP-005-NL",
      name: "LED Monitor 27 inch",
      category: "Electronics",
      store: "Netherlands",
      stock: 67,
      price: 349.00,
      status: "in-stock",
    },
    {
      id: "6",
      sku: "SUP-006-DE",
      name: "Standing Desk Electric",
      category: "Furniture",
      store: "Germany",
      stock: 8,
      price: 599.99,
      status: "low-stock",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-stock":
        return "In Stock";
      case "low-stock":
        return "Low Stock";
      case "out-of-stock":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Live Stock Inventory</h3>
        <p className="text-sm text-gray-500">Real-time stock updates across European stores</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Store</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price (€)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.store}</TableCell>
                <TableCell className="text-right font-semibold">{item.stock}</TableCell>
                <TableCell className="text-right">€{item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewLocation && onViewLocation(item)}
                    className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <MapPin className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}