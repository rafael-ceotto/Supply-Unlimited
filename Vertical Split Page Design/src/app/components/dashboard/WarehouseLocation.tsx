import { Package, MapPin, Box, Layers, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";

interface WarehouseItem {
  aisle: string;
  shelf: string;
  box: string;
  quantity: number;
  lastUpdated: string;
}

interface WarehouseLocationProps {
  productName: string;
  productSku: string;
  storeName: string;
  warehouseData: WarehouseItem[];
  onClose?: () => void;
}

export function WarehouseLocation({
  productName,
  productSku,
  storeName,
  warehouseData,
  onClose,
}: WarehouseLocationProps) {
  // Organizar dados por aisle
  const organizedData = warehouseData.reduce((acc, item) => {
    if (!acc[item.aisle]) {
      acc[item.aisle] = {};
    }
    if (!acc[item.aisle][item.shelf]) {
      acc[item.aisle][item.shelf] = [];
    }
    acc[item.aisle][item.shelf].push(item);
    return acc;
  }, {} as Record<string, Record<string, WarehouseItem[]>>);

  const totalQuantity = warehouseData.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg border-2 border-green-500 overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{productName}</h3>
              <p className="text-green-100">SKU: {productSku} • Store: {storeName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-sm">Total Stock</p>
            <p className="text-3xl font-bold">{totalQuantity}</p>
            <p className="text-green-100 text-sm">units</p>
          </div>
        </div>
      </div>

      {/* Warehouse Layout */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-green-600" />
          <h4 className="text-lg font-semibold text-gray-800">Warehouse Location Details</h4>
          <span className="ml-auto text-sm text-gray-500">
            Live Update • {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="space-y-6">
          {Object.entries(organizedData).map(([aisle, shelves]) => {
            const aisleTotal = Object.values(shelves)
              .flat()
              .reduce((sum, item) => sum + item.quantity, 0);

            return (
              <motion.div
                key={aisle}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Aisle Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 text-white rounded-md">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-900 text-lg">
                          Aisle {aisle}
                        </h5>
                        <p className="text-sm text-blue-700">
                          {Object.keys(shelves).length} shelves
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">{aisleTotal}</p>
                      <p className="text-sm text-blue-700">units</p>
                    </div>
                  </div>
                </div>

                {/* Shelves */}
                <div className="p-4 space-y-4">
                  {Object.entries(shelves).map(([shelf, boxes]) => {
                    const shelfTotal = boxes.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <div key={shelf} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Shelf Header */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 border-b border-purple-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-purple-600 text-white rounded">
                                <Package className="w-4 h-4" />
                              </div>
                              <div>
                                <h6 className="font-semibold text-purple-900">
                                  Shelf {shelf}
                                </h6>
                                <p className="text-xs text-purple-700">
                                  {boxes.length} boxes
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-purple-900">{shelfTotal}</p>
                              <p className="text-xs text-purple-700">units</p>
                            </div>
                          </div>
                        </div>

                        {/* Boxes */}
                        <div className="p-3 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {boxes.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Box className="w-4 h-4 text-orange-600" />
                                  <span className="font-semibold text-gray-900 text-sm">
                                    Box {item.box}
                                  </span>
                                </div>
                                <div className="flex items-baseline justify-between">
                                  <div>
                                    <p className="text-2xl font-bold text-orange-600">
                                      {item.quantity}
                                    </p>
                                    <p className="text-xs text-gray-600">units</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">Updated</p>
                                    <p className="text-xs font-medium text-gray-700">
                                      {item.lastUpdated}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Total Aisles</p>
            <p className="text-2xl font-bold text-gray-900">
              {Object.keys(organizedData).length}
            </p>
          </div>
          <div className="text-center border-x border-gray-300">
            <p className="text-gray-600 text-sm mb-1">Total Shelves</p>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(organizedData).reduce(
                (sum, shelves) => sum + Object.keys(shelves).length,
                0
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Total Boxes</p>
            <p className="text-2xl font-bold text-gray-900">{warehouseData.length}</p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="absolute top-4 right-4">
          <Button
            variant="destructive"
            size="icon"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}