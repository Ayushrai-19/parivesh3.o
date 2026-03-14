import { DashboardLayout } from "../components/DashboardLayout";
import { ComplaintDetailModal } from "../components/ComplaintDetailModal";
import { useState } from "react";
import { useParams } from "react-router";
import { 
  FileText, 
  Upload, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MessageSquare,
  Calendar,
  Eye,
  Filter
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  category: string;
  applicationId?: string;
  description: string;
  status: "submitted" | "under_review" | "resolved" | "closed";
  submittedDate: string;
  lastUpdated: string;
  attachments?: string[];
}

const mockComplaints: Complaint[] = [
  {
    id: "CMP-2026-001",
    title: "Payment gateway timeout issue",
    category: "Payment Issue",
    applicationId: "EC-2026-001",
    description: "Payment was deducted but application status not updated",
    status: "resolved",
    submittedDate: "2026-03-10",
    lastUpdated: "2026-03-12",
    attachments: ["payment_receipt.pdf"]
  },
  {
    id: "CMP-2026-002",
    title: "Unable to upload NOC documents",
    category: "Technical Issue",
    applicationId: "EC-2026-003",
    description: "Document upload fails with error 500",
    status: "under_review",
    submittedDate: "2026-03-12",
    lastUpdated: "2026-03-13",
  },
  {
    id: "CMP-2026-003",
    title: "Delay in scrutiny review process",
    category: "Application Issue",
    applicationId: "EC-2025-145",
    description: "Application stuck in scrutiny for more than 30 days",
    status: "submitted",
    submittedDate: "2026-03-13",
    lastUpdated: "2026-03-13",
  },
];

const categories = [
  "Application Issue",
  "Payment Issue",
  "Technical Issue",
  "Document Issue",
  "Status Update Issue",
  "Other"
];

function StatusBadge({ status }: { status: Complaint["status"] }) {
  const statusConfig = {
    submitted: {
      label: "Submitted",
      icon: Clock,
      className: "bg-blue-50 text-blue-700 border-blue-200"
    },
    under_review: {
      label: "Under Investigation",
      icon: AlertCircle,
      className: "bg-orange-50 text-orange-700 border-orange-200"
    },
    resolved: {
      label: "Resolved",
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700 border-green-200"
    },
    closed: {
      label: "Closed",
      icon: XCircle,
      className: "bg-gray-50 text-gray-700 border-gray-200"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export function ComplaintsPage() {
  const { role } = useParams();
  const [activeTab, setActiveTab] = useState<"raise" | "my-complaints">("raise");
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    applicationId: "",
    description: "",
    attachments: [] as File[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, attachments: Array.from(e.target.files) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate new complaint ID
    const complaintNumber = complaints.length + 1;
    const newComplaintId = `CMP-2026-${String(complaintNumber).padStart(3, "0")}`;
    
    const newComplaint: Complaint = {
      id: newComplaintId,
      title: formData.title,
      category: formData.category,
      applicationId: formData.applicationId || undefined,
      description: formData.description,
      status: "submitted",
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      attachments: formData.attachments.map(f => f.name)
    };

    setComplaints([newComplaint, ...complaints]);
    
    // Reset form
    setFormData({
      title: "",
      category: "",
      applicationId: "",
      description: "",
      attachments: []
    });

    // Show success message and switch to My Complaints tab
    alert(`Complaint registered successfully!\n\nComplaint ID: ${newComplaintId}\n\nYou will receive updates on your registered email.`);
    setActiveTab("my-complaints");
  };

  const filteredComplaints = filterStatus === "all" 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  return (
    <DashboardLayout role={role || "proponent"}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#2a7f3e]">
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Grievances</h1>
          <p className="text-sm text-gray-600 mt-1">Report issues and track complaint status</p>
        </div>

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
          />
        )}

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-t-lg">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("raise")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "raise"
                  ? "bg-[#2a7f3e] text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Raise Complaint
              </div>
            </button>
            <button
              onClick={() => setActiveTab("my-complaints")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "my-complaints"
                  ? "bg-[#2a7f3e] text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                My Complaints ({complaints.length})
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg p-6">
          {activeTab === "raise" && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Submit a New Complaint</h2>
                <p className="text-sm text-gray-600">
                  Please provide detailed information about your issue. Our support team will review and respond within 2-3 business days.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Complaint Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief summary of your issue"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7f3e] focus:border-transparent"
                  />
                </div>

                {/* Category & Application ID Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complaint Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7f3e] focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Application ID <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.applicationId}
                      onChange={(e) => handleInputChange("applicationId", e.target.value)}
                      placeholder="e.g., EC-2026-001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7f3e] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description of Issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7f3e] focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Supporting Documents <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2a7f3e] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</p>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 font-medium mb-2">Selected files:</p>
                      <ul className="space-y-1">
                        {formData.attachments.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: "",
                        category: "",
                        applicationId: "",
                        description: "",
                        attachments: []
                      });
                    }}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#2a7f3e] text-white rounded-lg hover:bg-[#1e5a2d] transition-colors font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Submit Complaint
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "my-complaints" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Complaints</h2>
                  <p className="text-sm text-gray-600">
                    Track the status of your submitted complaints
                  </p>
                </div>
                
                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2a7f3e]"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Investigation</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Complaints Table */}
              {filteredComplaints.length > 0 ? (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Complaint ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Submission Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredComplaints.map((complaint) => (
                        <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{complaint.id}</div>
                            {complaint.applicationId && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                App: {complaint.applicationId}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{complaint.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {complaint.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{complaint.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(complaint.submittedDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Updated: {new Date(complaint.lastUpdated).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={complaint.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button 
                              onClick={() => setSelectedComplaint(complaint)}
                              className="inline-flex items-center gap-1.5 text-[#2a7f3e] hover:text-[#1e5a2d] font-medium text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No complaints found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {filterStatus === "all" 
                      ? "You haven't submitted any complaints yet" 
                      : `No complaints with status: ${filterStatus.replace('_', ' ')}`}
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">Need Immediate Assistance?</h3>
                    <p className="text-sm text-blue-800">
                      For urgent issues, please contact our helpdesk at <strong>1800-11-3800</strong> or email <strong>support@parivesh.gov.in</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}