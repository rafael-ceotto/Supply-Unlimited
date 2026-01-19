import { Download, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function ExportSection() {
  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}...`);
    // Lógica de exportação aqui
  };

  const exportOptions = [
    {
      format: "CSV",
      icon: FileSpreadsheet,
      description: "Export as Comma-Separated Values",
      color: "text-green-600",
    },
    {
      format: "Excel",
      icon: FileSpreadsheet,
      description: "Export as Microsoft Excel",
      color: "text-blue-600",
    },
    {
      format: "PDF",
      icon: FileText,
      description: "Export as PDF Document",
      color: "text-red-600",
    },
    {
      format: "JSON",
      icon: FileJson,
      description: "Export as JSON Data",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Export Data</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Download your inventory and sales data in various formats
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.format}
              variant="outline"
              className="h-auto flex flex-col items-start p-4 hover:shadow-md transition-shadow"
              onClick={() => handleExport(option.format)}
            >
              <Icon className={`w-8 h-8 mb-2 ${option.color}`} />
              <span className="font-semibold text-gray-900">{option.format}</span>
              <span className="text-xs text-gray-500 text-left mt-1">
                {option.description}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Exported files will include all filtered data based on your
          current search and filter settings.
        </p>
      </div>
    </div>
  );
}
