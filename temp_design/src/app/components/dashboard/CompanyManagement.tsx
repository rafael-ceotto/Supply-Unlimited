import { useState } from "react";
import { Building2, Search, Plus, Edit, Trash2, GitMerge } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { CompanyDetails } from "@/app/components/dashboard/CompanyDetails";
import { CompanyActions } from "@/app/components/dashboard/CompanyActions";

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

export function CompanyManagement() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [actionType, setActionType] = useState<string>("");

  const companies: Company[] = [
    {
      id: "COM-001",
      name: "TechCorp EU",
      parentId: null,
      country: "Germany",
      city: "Berlin",
      status: "active",
      linkedCompanies: ["COM-002", "COM-005"],
      ownership: 100,
    },
    {
      id: "COM-002",
      name: "TechCorp France",
      parentId: "COM-001",
      country: "France",
      city: "Paris",
      status: "active",
      linkedCompanies: [],
      ownership: 75,
    },
    {
      id: "COM-003",
      name: "Global Industries",
      parentId: null,
      country: "Italy",
      city: "Rome",
      status: "active",
      linkedCompanies: ["COM-004"],
      ownership: 100,
    },
    {
      id: "COM-004",
      name: "Global Industries España",
      parentId: "COM-003",
      country: "Spain",
      city: "Madrid",
      status: "active",
      linkedCompanies: [],
      ownership: 60,
    },
    {
      id: "COM-005",
      name: "TechCorp Netherlands",
      parentId: "COM-001",
      country: "Netherlands",
      city: "Amsterdam",
      status: "active",
      linkedCompanies: [],
      ownership: 80,
    },
  ];

  const handleAction = (type: string, company?: Company) => {
    setActionType(type);
    if (company) {
      setSelectedCompany(company);
    }
    setShowActions(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Company Management</h2>
              <p className="text-sm text-gray-600">Manage companies and their relationships</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleAction("create")}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              New Company
            </Button>
            <Button
              onClick={() => handleAction("merge")}
              variant="outline"
              className="gap-2"
            >
              <GitMerge className="w-4 h-4" />
              Merge Companies
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search companies by name, ID, or city..."
              className="pl-10"
            />
          </div>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="italy">Italy</SelectItem>
              <SelectItem value="spain">Spain</SelectItem>
              <SelectItem value="netherlands">Netherlands</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company ID</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Parent Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Ownership %</TableHead>
              <TableHead>Linked</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => {
              const parentCompany = companies.find((c) => c.id === company.parentId);
              
              return (
                <TableRow key={company.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{company.id}</TableCell>
                  <TableCell className="font-semibold">{company.name}</TableCell>
                  <TableCell>
                    {parentCompany ? (
                      <span className="text-sm text-gray-600">{parentCompany.name}</span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Main Company</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{company.city}</div>
                      <div className="text-gray-500">{company.country}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${company.ownership}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{company.ownership}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {company.linkedCompanies.length} companies
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        company.status
                      )}`}
                    >
                      {company.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCompany(company)}
                        className="p-2"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("edit", company)}
                        className="p-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("delete", company)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Company Details Sidebar */}
      {selectedCompany && !showActions && (
        <CompanyDetails
          company={selectedCompany}
          companies={companies}
          onClose={() => setSelectedCompany(null)}
          onEdit={(company) => handleAction("edit", company)}
        />
      )}

      {/* Company Actions Modal */}
      {showActions && (
        <CompanyActions
          type={actionType}
          company={selectedCompany}
          companies={companies}
          onClose={() => {
            setShowActions(false);
            setSelectedCompany(null);
            setActionType("");
          }}
        />
      )}
    </div>
  );
}
