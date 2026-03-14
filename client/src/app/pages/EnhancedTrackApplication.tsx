import { useState } from "react";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { Search, CheckCircle, Clock, AlertCircle, FileText, Users, Mail, Phone, ChevronDown, ChevronUp, Calendar, User } from "lucide-react";

interface Stage {
  id: string;
  name: string;
  status: "completed" | "current" | "pending";
  date?: string;
  estimatedDate?: string;
  department: string;
  responsible: string;
  contact: {
    email: string;
    phone: string;
  };
  documents: {
    required: string[];
    submitted: string[];
  };
  checklist: {
    item: string;
    completed: boolean;
  }[];
  comments?: string;
  nextSteps?: string;
}

const mockStages: Stage[] = [
  {
    id: "1",
    name: "Application Submitted",
    status: "completed",
    date: "March 9, 2026 at 10:30 AM",
    department: "Submission Portal",
    responsible: "Automated System",
    contact: {
      email: "support@parivesh.gov.in",
      phone: "+91-11-2436-0749"
    },
    documents: {
      required: ["Application Form", "Project Proposal", "Land Documents"],
      submitted: ["Application Form", "Project Proposal", "Land Documents"]
    },
    checklist: [
      { item: "Application form filled completely", completed: true },
      { item: "Payment confirmed", completed: true },
      { item: "Documents uploaded", completed: true }
    ],
    comments: "Application successfully submitted and payment confirmed.",
    nextSteps: "Your application will be assigned to a scrutiny officer within 2 working days."
  },
  {
    id: "2",
    name: "Under Scrutiny",
    status: "completed",
    date: "March 10, 2026 at 2:15 PM",
    department: "Scrutiny Division",
    responsible: "Dr. Priya Sharma",
    contact: {
      email: "scrutiny.team@parivesh.gov.in",
      phone: "+91-11-2436-0750"
    },
    documents: {
      required: ["EIA Report", "Baseline Data", "Public Consultation Report"],
      submitted: ["EIA Report", "Baseline Data", "Public Consultation Report"]
    },
    checklist: [
      { item: "EIA report reviewed", completed: true },
      { item: "Baseline data verified", completed: true },
      { item: "Public consultation compliance checked", completed: true },
      { item: "All documents authenticated", completed: true }
    ],
    comments: "All documents have been thoroughly reviewed and verified. Application meets the basic requirements.",
    nextSteps: "Application will be referred to the Expert Appraisal Committee for detailed evaluation."
  },
  {
    id: "3",
    name: "Referred to Committee",
    status: "current",
    date: "March 11, 2026 at 11:45 AM",
    estimatedDate: "March 15, 2026",
    department: "MoM Division",
    responsible: "Amit Patel",
    contact: {
      email: "mom.team@parivesh.gov.in",
      phone: "+91-11-2436-0751"
    },
    documents: {
      required: ["Meeting Preparation Documents", "Technical Assessment"],
      submitted: ["Meeting Preparation Documents"]
    },
    checklist: [
      { item: "Agenda prepared", completed: true },
      { item: "Documents circulated to committee", completed: true },
      { item: "Meeting scheduled", completed: false },
      { item: "Presentation prepared", completed: false }
    ],
    comments: "Your project is scheduled for review in the upcoming EAC meeting on March 15, 2026.",
    nextSteps: "Committee will review the project and provide recommendations. You may be required to attend the meeting for clarifications."
  },
  {
    id: "4",
    name: "Committee Meeting",
    status: "pending",
    estimatedDate: "March 15, 2026",
    department: "Expert Appraisal Committee",
    responsible: "EAC Panel",
    contact: {
      email: "eac@parivesh.gov.in",
      phone: "+91-11-2436-0752"
    },
    documents: {
      required: ["Presentation", "Clarification Documents"],
      submitted: []
    },
    checklist: [
      { item: "Project presentation", completed: false },
      { item: "Expert review", completed: false },
      { item: "Public hearing compliance", completed: false },
      { item: "Committee decision", completed: false }
    ],
    nextSteps: "Await committee decision and recommendations."
  },
  {
    id: "5",
    name: "Final Decision",
    status: "pending",
    estimatedDate: "March 20, 2026",
    department: "Clearance Authority",
    responsible: "Secretary, MoEFCC",
    contact: {
      email: "clearance@parivesh.gov.in",
      phone: "+91-11-2436-0753"
    },
    documents: {
      required: ["Committee Recommendations", "Final Assessment"],
      submitted: []
    },
    checklist: [
      { item: "Committee recommendations reviewed", completed: false },
      { item: "Compliance conditions defined", completed: false },
      { item: "Clearance letter prepared", completed: false },
      { item: "Decision communicated", completed: false }
    ],
    nextSteps: "Final clearance letter will be issued and sent to your registered email."
  }
];

export function EnhancedTrackApplication() {
  const [applicationId, setApplicationId] = useState("EC-2026-001");
  const [showTracking, setShowTracking] = useState(true);
  const [expandedStage, setExpandedStage] = useState<string | null>("3");

  const handleSearch = () => {
    setShowTracking(true);
  };

  const currentStageIndex = mockStages.findIndex(s => s.status === "current");
  const completedStages = mockStages.filter(s => s.status === "completed").length;
  const totalStages = mockStages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <GovHeader />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Application</h1>
          <p className="text-lg text-gray-600">Real-time status updates for your environmental clearance</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-8 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="Enter Application ID (e.g., EC-2026-001)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              Track
            </button>
          </div>
        </div>

        {showTracking && (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Application: {applicationId}</h2>
                  <p className="text-blue-100">Solar Power Plant - Rajasthan</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{completedStages}/{totalStages}</div>
                  <div className="text-sm text-blue-100">Stages Completed</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-100 mt-2">
                Estimated completion: March 20, 2026
              </p>
            </div>

            {/* Email/SMS Notifications */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Get Status Updates</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Receive real-time notifications via email and SMS for any status changes
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Application Timeline</h3>

              <div className="space-y-6">
                {mockStages.map((stage, index) => {
                  const isExpanded = expandedStage === stage.id;
                  const isCompleted = stage.status === "completed";
                  const isCurrent = stage.status === "current";
                  const isPending = stage.status === "pending";

                  return (
                    <div key={stage.id} className="relative">
                      {/* Connecting Line */}
                      {index < mockStages.length - 1 && (
                        <div
                          className={`absolute left-6 top-14 w-0.5 h-[calc(100%+1.5rem)] ${
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      )}

                      {/* Stage Card */}
                      <div
                        className={`relative bg-white border-2 rounded-xl overflow-hidden transition-all ${
                          isCurrent
                            ? "border-blue-500 shadow-lg"
                            : isCompleted
                            ? "border-green-300"
                            : "border-gray-200"
                        }`}
                      >
                        {/* Stage Header */}
                        <div
                          onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? "bg-green-500"
                                  : isCurrent
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-300"
                              }`}
                            >
                              {isCompleted && <CheckCircle className="w-6 h-6 text-white" />}
                              {isCurrent && <Clock className="w-6 h-6 text-white" />}
                              {isPending && <Clock className="w-6 h-6 text-white" />}
                            </div>

                            {/* Stage Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900">{stage.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {stage.department} • {stage.responsible}
                                  </p>
                                </div>
                                <div className="text-right">
                                  {stage.date && (
                                    <p className="text-sm font-medium text-gray-900">{stage.date}</p>
                                  )}
                                  {!stage.date && stage.estimatedDate && (
                                    <p className="text-sm text-gray-500">Est: {stage.estimatedDate}</p>
                                  )}
                                </div>
                              </div>

                              {isCurrent && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                  In Progress
                                </div>
                              )}
                            </div>

                            {/* Expand Icon */}
                            <button className="text-gray-400 hover:text-gray-600">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t-2 border-gray-100 p-6 bg-gray-50 space-y-6">
                            {/* Contact Information */}
                            <div>
                              <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Contact Information
                              </h5>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <a href={`mailto:${stage.contact.email}`} className="text-blue-600 hover:underline">
                                    {stage.contact.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <a href={`tel:${stage.contact.phone}`} className="text-blue-600 hover:underline">
                                    {stage.contact.phone}
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Documents */}
                            <div>
                              <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Documents
                              </h5>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Required</p>
                                  <ul className="space-y-1">
                                    {stage.documents.required.map((doc, i) => (
                                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                        {doc}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Submitted</p>
                                  <ul className="space-y-1">
                                    {stage.documents.submitted.map((doc, i) => (
                                      <li key={i} className="text-sm text-green-700 flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        {doc}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Checklist */}
                            <div>
                              <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Progress Checklist
                              </h5>
                              <div className="space-y-2">
                                {stage.checklist.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div
                                      className={`w-5 h-5 rounded flex items-center justify-center ${
                                        item.completed ? "bg-green-500" : "bg-gray-200"
                                      }`}
                                    >
                                      {item.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span
                                      className={`text-sm ${
                                        item.completed ? "text-gray-700" : "text-gray-500"
                                      }`}
                                    >
                                      {item.item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Comments */}
                            {stage.comments && (
                              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <h5 className="font-bold text-gray-900 mb-2">Comments</h5>
                                <p className="text-sm text-gray-700">{stage.comments}</p>
                              </div>
                            )}

                            {/* Next Steps */}
                            {stage.nextSteps && (
                              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <h5 className="font-bold text-gray-900 mb-2">Next Steps</h5>
                                <p className="text-sm text-gray-700">{stage.nextSteps}</p>
                              </div>
                            )}

                            {/* Support Button */}
                            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                              Contact Support for This Stage
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <GovFooter />
    </div>
  );
}