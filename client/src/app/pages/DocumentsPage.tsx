import { DashboardLayout } from "../components/DashboardLayout";
import { FileText, Download, Eye, Upload, Search, Filter, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

const documentsByRole = {
  proponent: [
    {
      id: "DOC-001",
      name: "Environmental Impact Assessment Report",
      type: "EIA Report",
      applicationId: "EC-2026-001",
      uploadedDate: "2026-03-09",
      size: "12.4 MB",
      status: "approved",
      format: "PDF"
    },
    {
      id: "DOC-002",
      name: "Baseline Data - Air Quality",
      type: "Baseline Study",
      applicationId: "EC-2026-001",
      uploadedDate: "2026-03-09",
      size: "5.2 MB",
      status: "approved",
      format: "PDF"
    },
    {
      id: "DOC-003",
      name: "Public Consultation Report",
      type: "Consultation",
      applicationId: "EC-2026-002",
      uploadedDate: "2026-03-10",
      size: "8.7 MB",
      status: "pending",
      format: "PDF"
    },
    {
      id: "DOC-004",
      name: "Land Ownership Documents",
      type: "Legal",
      applicationId: "EC-2026-002",
      uploadedDate: "2026-03-10",
      size: "3.1 MB",
      status: "rejected",
      format: "PDF"
    },
  ],
  scrutiny: [
    {
      id: "DOC-101",
      name: "Scrutiny Checklist - EC-2026-001",
      type: "Scrutiny Report",
      applicationId: "EC-2026-001",
      uploadedDate: "2026-03-10",
      size: "1.2 MB",
      status: "approved",
      format: "DOCX"
    },
    {
      id: "DOC-102",
      name: "EDS Request - EC-2026-002",
      type: "EDS",
      applicationId: "EC-2026-002",
      uploadedDate: "2026-03-10",
      size: "0.8 MB",
      status: "pending",
      format: "PDF"
    },
  ],
  mom: [
    {
      id: "DOC-201",
      name: "Meeting Gist - EC-2026-001",
      type: "Gist",
      applicationId: "EC-2026-001",
      uploadedDate: "2026-03-11",
      size: "2.1 MB",
      status: "approved",
      format: "DOCX"
    },
    {
      id: "DOC-202",
      name: "Minutes of Meeting - March 2026",
      type: "MoM",
      applicationId: "Multiple",
      uploadedDate: "2026-03-08",
      size: "5.5 MB",
      status: "approved",
      format: "PDF"
    },
  ],
  admin: [
    {
      id: "DOC-301",
      name: "System Audit Report - Q1 2026",
      type: "Audit",
      applicationId: "N/A",
      uploadedDate: "2026-03-01",
      size: "4.3 MB",
      status: "approved",
      format: "PDF"
    },
    {
      id: "DOC-302",
      name: "Template - MoM Format",
      type: "Template",
      applicationId: "N/A",
      uploadedDate: "2026-02-15",
      size: "0.5 MB",
      status: "approved",
      format: "DOCX"
    },
  ]
};

export function DocumentsPage() {
  const { role } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const documents = documentsByRole[role as keyof typeof documentsByRole] || [];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (doc: any) => {
    alert(`Downloading: ${doc.name}\nFormat: ${doc.format}\nSize: ${doc.size}`);
  };

  const handleView = (doc: any) => {
    alert(`Viewing: ${doc.name}\nApplication: ${doc.applicationId}`);
  };

  return (
    <DashboardLayout role={role || "proponent"}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">View and manage all your documents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{documents.length}</span>
            </div>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === "approved").length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === "pending").length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === "rejected").length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter by Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Upload Button (for proponent) */}
            {role === "proponent" && (
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
            )}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No documents found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.format}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-medium">{doc.applicationId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{doc.uploadedDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{doc.size}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doc.status === "approved" ? "bg-green-100 text-green-700" :
                          doc.status === "pending" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
