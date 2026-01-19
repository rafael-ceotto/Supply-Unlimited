import { useState } from "react";
import { X, Plus, Edit, Trash2, GitMerge } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

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

interface CompanyActionsProps {
  type: "create" | "edit" | "delete" | "merge";
  company?: Company | null;
  companies: Company[];
  onClose: () => void;
}

export function CompanyActions({ type, company, companies, onClose }: CompanyActionsProps) {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    country: company?.country || "",
    city: company?.city || "",
    parentId: company?.parentId || "",
    ownership: company?.ownership || 100,
    status: company?.status || "active",
  });

  const [mergeData, setMergeData] = useState({
    sourceCompanyId: "",
    targetCompanyId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${type} action:`, formData);
    // Implementar lógica de criação/edição aqui
    onClose();
  };

  const handleMerge = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Merge action:", mergeData);
    // Implementar lógica de merge aqui
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete company:", company?.id);
    // Implementar lógica de delete aqui
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "create":
        return <Plus className="w-5 h-5" />;
      case "edit":
        return <Edit className="w-5 h-5" />;
      case "delete":
        return <Trash2 className="w-5 h-5" />;
      case "merge":
        return <GitMerge className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "create":
        return "Create New Company";
      case "edit":
        return "Edit Company";
      case "delete":
        return "Delete Company";
      case "merge":
        return "Merge Companies";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">{getIcon()}</div>
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === "delete" ? (
            // Delete Confirmation
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>Warning:</strong> You are about to delete the company "
                  {company?.name}". This action cannot be undone.
                </p>
              </div>

              {company?.linkedCompanies && company.linkedCompanies.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> This company has {company.linkedCompanies.length}{" "}
                    linked subsidiaries. Please reassign them before deleting.
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Company
                </Button>
              </div>
            </div>
          ) : type === "merge" ? (
            // Merge Form
            <form onSubmit={handleMerge} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Merge two companies together. The source company will be merged into the
                  target company, and all data will be consolidated.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sourceCompany">Source Company (to be merged)</Label>
                  <Select
                    value={mergeData.sourceCompanyId}
                    onValueChange={(value) =>
                      setMergeData({ ...mergeData, sourceCompanyId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetCompany">Target Company (main company)</Label>
                  <Select
                    value={mergeData.targetCompanyId}
                    onValueChange={(value) =>
                      setMergeData({ ...mergeData, targetCompanyId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Merge Companies
                </Button>
              </div>
            </form>
          ) : (
            // Create/Edit Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="parentId">Parent Company (Optional)</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (Main Company)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Main Company)</SelectItem>
                      {companies
                        .filter((c) => c.id !== company?.id)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({c.id})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ownership">Ownership %</Label>
                  <Input
                    id="ownership"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ownership}
                    onChange={(e) =>
                      setFormData({ ...formData, ownership: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {type === "create" ? "Create Company" : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
