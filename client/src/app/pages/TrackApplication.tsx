import { useState } from "react";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { Search, CheckCircle, Clock, AlertCircle, FileText, Calendar, User, Building2, MapPin, TrendingUp, Download, Eye, X, Upload } from "lucide-react";

interface ApplicationStatus {
  id: string;
  projectName: string;
  applicantName: string;
  sector: string;
  location: string;
  submittedDate: string;
  lastUpdated: string;
  status: "submitted" | "under-review" | "pending-info" | "approved" | "rejected";
  currentStage: string;
  progress: number;
  timeline: {
    stage: string;
    status: "completed" | "current" | "pending";
    date?: string;
    description: string;
  }[];
}

// Mock data for demonstration
const mockApplications: ApplicationStatus[] = [
  {
    id: "EC/2026/MUM/12345",
    projectName: "Solar Power Plant Development",
    applicantName: "Green Energy Solutions Pvt. Ltd.",
    sector: "Renewable Energy",
    location: "Mumbai, Maharashtra",
    submittedDate: "2026-01-15",
    lastUpdated: "2026-03-10",
    status: "under-review",
    currentStage: "Environmental Impact Assessment",
    progress: 65,
    timeline: [
      {
        stage: "Application Submitted",
        status: "completed",
        date: "2026-01-15",
        description: "Application successfully submitted with all required documents"
      },
      {
        stage: "Initial Screening",
        status: "completed",
        date: "2026-01-20",
        description: "Application passed initial screening and validation"
      },
      {
        stage: "Document Verification",
        status: "completed",
        date: "2026-02-05",
        description: "All submitted documents have been verified"
      },
      {
        stage: "Environmental Impact Assessment",
        status: "current",
        date: "2026-03-10",
        description: "EIA report is being reviewed by the scrutiny team"
      },
      {
        stage: "Public Consultation",
        status: "pending",
        description: "Scheduled after EIA approval"
      },
      {
        stage: "Expert Committee Review",
        status: "pending",
        description: "Review by environmental experts"
      },
      {
        stage: "Final Decision",
        status: "pending",
        description: "Final clearance decision"
      }
    ]
  },
  {
    id: "EC/2026/DEL/98765",
    projectName: "Metro Rail Extension Project",
    applicantName: "Delhi Metro Rail Corporation",
    sector: "Infrastructure",
    location: "New Delhi, Delhi",
    submittedDate: "2026-02-01",
    lastUpdated: "2026-03-08",
    status: "pending-info",
    currentStage: "Additional Information Required",
    progress: 45,
    timeline: [
      {
        stage: "Application Submitted",
        status: "completed",
        date: "2026-02-01",
        description: "Application successfully submitted"
      },
      {
        stage: "Initial Screening",
        status: "completed",
        date: "2026-02-05",
        description: "Application passed initial screening"
      },
      {
        stage: "Document Verification",
        status: "current",
        date: "2026-03-08",
        description: "Additional documents required - Check your email"
      },
      {
        stage: "Environmental Impact Assessment",
        status: "pending",
        description: "Pending document submission"
      },
      {
        stage: "Public Consultation",
        status: "pending",
        description: "Scheduled after EIA approval"
      },
      {
        stage: "Final Decision",
        status: "pending",
        description: "Final clearance decision"
      }
    ]
  },
  {
    id: "EC/2025/BLR/54321",
    projectName: "Tech Park Construction",
    applicantName: "Infosys Technologies Limited",
    sector: "Real Estate",
    location: "Bangalore, Karnataka",
    submittedDate: "2025-11-20",
    lastUpdated: "2026-03-01",
    status: "approved",
    currentStage: "Clearance Granted",
    progress: 100,
    timeline: [
      {
        stage: "Application Submitted",
        status: "completed",
        date: "2025-11-20",
        description: "Application successfully submitted"
      },
      {
        stage: "Initial Screening",
        status: "completed",
        date: "2025-11-25",
        description: "Application passed initial screening"
      },
      {
        stage: "Document Verification",
        status: "completed",
        date: "2025-12-10",
        description: "All documents verified successfully"
      },
      {
        stage: "Environmental Impact Assessment",
        status: "completed",
        date: "2026-01-15",
        description: "EIA report approved"
      },
      {
        stage: "Public Consultation",
        status: "completed",
        date: "2026-02-01",
        description: "Public hearing completed with positive feedback"
      },
      {
        stage: "Expert Committee Review",
        status: "completed",
        date: "2026-02-20",
        description: "Approved by expert committee"
      },
      {
        stage: "Final Decision",
        status: "completed",
        date: "2026-03-01",
        description: "Environmental clearance granted"
      }
    ]
  }
];

export function TrackApplication() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationStatus | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSearch = () => {
    setSearchPerformed(true);
    const found = mockApplications.find(
      app => app.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSelectedApplication(found || null);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "submitted":
        return { color: "blue", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: FileText, label: "Submitted" };
      case "under-review":
        return { color: "yellow", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: Clock, label: "Under Review" };
      case "pending-info":
        return { color: "orange", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: AlertCircle, label: "Action Required" };
      case "approved":
        return { color: "green", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle, label: "Approved" };
      case "rejected":
        return { color: "red", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertCircle, label: "Rejected" };
      default:
        return { color: "gray", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: FileText, label: "Unknown" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GovHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-br from-green-50 via-orange-50 to-blue-50">
        {/* Government Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M30 15 L32 21 L38 21 L33 25 L35 31 L30 27 L25 31 L27 25 L22 21 L28 21 Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-600 rounded-full shadow-md mb-4">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-800">Application Tracking System</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Track Your Application</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your Application ID to view real-time status, progress, and timeline of your environmental clearance application
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-200 p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter Application ID (e.g., EC/2026/MUM/12345)"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all text-lg"
              >
                Search
              </button>
            </div>

            {/* Quick Search Examples */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Try:</span>
              {mockApplications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    setSearchQuery(app.id);
                    setSearchPerformed(true);
                    setSelectedApplication(app);
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {app.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {searchPerformed && !selectedApplication && (
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h3>
            <p className="text-gray-600 mb-6">
              No application found with ID: <strong>{searchQuery}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Please check your Application ID and try again. If you continue to face issues, contact our support team.
            </p>
          </div>
        )}

        {selectedApplication && (
          <div className="space-y-8">
            {/* Application Overview Card */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden">
              {/* Header */}
              <div className={`${getStatusConfig(selectedApplication.status).bg} border-b-2 ${getStatusConfig(selectedApplication.status).border} p-8`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-gray-300 rounded-full mb-3">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-bold text-gray-700">{selectedApplication.id}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedApplication.projectName}</h2>
                    <p className="text-gray-700">{selectedApplication.applicantName}</p>
                  </div>
                  <div className={`px-4 py-2 ${getStatusConfig(selectedApplication.status).bg} border-2 ${getStatusConfig(selectedApplication.status).border} rounded-xl`}>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const StatusIcon = getStatusConfig(selectedApplication.status).icon;
                        return <StatusIcon className={`w-5 h-5 ${getStatusConfig(selectedApplication.status).text}`} />;
                      })()}
                      <span className={`font-bold ${getStatusConfig(selectedApplication.status).text}`}>
                        {getStatusConfig(selectedApplication.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">Overall Progress</span>
                    <span className="font-bold text-gray-900">{selectedApplication.progress}%</span>
                  </div>
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-gray-200">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500 rounded-full"
                      style={{ width: `${selectedApplication.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Sector</p>
                      <p className="font-bold text-gray-900">{selectedApplication.sector}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Location</p>
                      <p className="font-bold text-gray-900">{selectedApplication.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Submitted</p>
                      <p className="font-bold text-gray-900">{new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Stage */}
              <div className="px-8 pb-8">
                <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Current Stage</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">{selectedApplication.currentStage}</p>
                      <p className="text-sm text-gray-700">Last updated: {new Date(selectedApplication.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Application Timeline</h3>
              
              <div className="space-y-6">
                {selectedApplication.timeline.map((item, index) => {
                  const isCompleted = item.status === "completed";
                  const isCurrent = item.status === "current";
                  const isPending = item.status === "pending";

                  return (
                    <div key={index} className="flex gap-6">
                      {/* Timeline Icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all ${
                            isCompleted
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-500"
                              : isCurrent
                              ? "bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-blue-500 ring-4 ring-blue-100"
                              : "bg-white border-2 border-gray-300"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : isCurrent ? (
                            <Clock className="w-6 h-6 text-white" />
                          ) : (
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          )}
                        </div>
                        {index < selectedApplication.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 mt-2 ${
                              isCompleted ? "bg-gradient-to-b from-green-500 to-emerald-600" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className={`flex-1 pb-8 ${isCurrent ? "relative" : ""}`}>
                        {isCurrent && (
                          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent rounded-full"></div>
                        )}
                        <div className={`p-4 rounded-2xl border-2 ${
                          isCompleted 
                            ? "bg-green-50 border-green-200" 
                            : isCurrent 
                            ? "bg-blue-50 border-blue-200" 
                            : "bg-gray-50 border-gray-200"
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className={`font-bold ${
                              isCompleted ? "text-green-900" : isCurrent ? "text-blue-900" : "text-gray-700"
                            }`}>
                              {item.stage}
                            </h4>
                            {item.date && (
                              <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-600"
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowDetailsModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  View Details
                </button>
                <button 
                  onClick={() => {
                    // Simulate download
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = `${selectedApplication.id}_Report.pdf`;
                    alert(`Downloading report for ${selectedApplication.id}...\n\nNote: This is a demo. In production, this would download the actual PDF report.`);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Upload Documents
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!searchPerformed && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Track Status</h3>
              <p className="text-sm text-gray-600">
                Enter your Application ID to track real-time status and progress
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">View Timeline</h3>
              <p className="text-sm text-gray-600">
                See detailed timeline of your application's journey through various stages
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Download Reports</h3>
              <p className="text-sm text-gray-600">
                Access and download application reports and clearance certificates
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <GovFooter />

      {/* View Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Application Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Application ID</label>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.id}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Status</label>
                  <p className="text-lg font-bold text-gray-900">{getStatusConfig(selectedApplication.status).label}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Project Name</label>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.projectName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Applicant Name</label>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.applicantName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Sector</label>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.sector}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Location</label>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.location}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Submitted Date</label>
                  <p className="text-lg font-bold text-gray-900">{new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Last Updated</label>
                  <p className="text-lg font-bold text-gray-900">{new Date(selectedApplication.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
                <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Current Stage</label>
                <p className="text-xl font-bold text-gray-900 mt-2">{selectedApplication.currentStage}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Progress</span>
                    <span className="font-bold text-gray-900">{selectedApplication.progress}%</span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500"
                      style={{ width: `${selectedApplication.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 block">Timeline Summary</label>
                <div className="space-y-2">
                  {selectedApplication.timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' : item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="flex-1 text-sm font-semibold text-gray-700">{item.stage}</span>
                      {item.date && <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Documents Modal */}
      {showUploadModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Upload Additional Documents</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadSuccess(false);
                }}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="p-8">
              {!uploadSuccess ? (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">Application ID: <strong>{selectedApplication.id}</strong></p>
                    <p className="text-sm text-gray-500">Upload any additional documents requested by the scrutiny team</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Choose Files to Upload</h3>
                    <p className="text-sm text-gray-600 mb-4">Supported formats: PDF, DOCX, PNG, JPG (Max 20MB each)</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.png,.jpg,.jpeg"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          // Simulate upload
                          setTimeout(() => {
                            setUploadSuccess(true);
                          }, 1500);
                        }
                      }}
                      className="hidden"
                      id="track-upload"
                    />
                    <label
                      htmlFor="track-upload"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold cursor-pointer"
                    >
                      Select Files
                    </label>
                  </div>

                  <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> All uploaded documents will be reviewed by the scrutiny team within 2-3 business days.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Documents Uploaded Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your documents have been uploaded and will be reviewed shortly.</p>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadSuccess(false);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}