import { X, Building2, MapPin, Link2, Edit } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface Company {
  id: string;
  name: string;
  parentId: string | null;
  country: string;
  city: string;
  status: string;
  linkedCompanies: string[];
  ownership: number;
}

interface CompanyDetailsProps {
  company: Company;
  companies: Company[];
  onClose: () => void;
  onEdit: (company: Company) => void;
}

export function CompanyDetails({ company, companies, onClose, onEdit }: CompanyDetailsProps) {
  const linkedCompanies = companies.filter((c) => company.linkedCompanies.includes(c.id));
  const parentCompany = companies.find((c) => c.id === company.parentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-600">Company ID: {company.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(company)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Company Name</label>
                <p className="text-gray-900 mt-1">{company.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Company ID</label>
                <p className="text-gray-900 mt-1 font-mono">{company.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {company.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ownership</label>
                <p className="text-gray-900 mt-1 font-semibold">{company.ownership}%</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Country</label>
                <p className="text-gray-900 mt-1">{company.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-gray-900 mt-1">{company.city}</p>
              </div>
            </div>
          </div>

          {/* Parent Company */}
          {parentCompany && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Parent Company
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{parentCompany.name}</p>
                    <p className="text-sm text-gray-600">ID: {parentCompany.id}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {company.ownership}% owned by parent
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Linked Companies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-green-600" />
              Linked Companies ({linkedCompanies.length})
            </h3>
            {linkedCompanies.length > 0 ? (
              <div className="space-y-3">
                {linkedCompanies.map((linked) => (
                  <div
                    key={linked.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{linked.name}</p>
                        <p className="text-sm text-gray-600">
                          {linked.city}, {linked.country} • ID: {linked.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {linked.ownership}% ownership
                        </p>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {linked.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No linked companies</p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This company{" "}
                {company.parentId
                  ? `is a subsidiary of ${parentCompany?.name} with ${company.ownership}% ownership stake.`
                  : `is a main company with ${linkedCompanies.length} linked subsidiaries.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
