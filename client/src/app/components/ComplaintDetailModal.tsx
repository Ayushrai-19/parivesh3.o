import { X, Calendar, Tag, FileText, Paperclip, MessageSquare, User, Clock } from "lucide-react";

interface ComplaintDetailModalProps {
  complaint: {
    id: string;
    title: string;
    category: string;
    applicationId?: string;
    description: string;
    status: "submitted" | "under_review" | "resolved" | "closed";
    submittedDate: string;
    lastUpdated: string;
    attachments?: string[];
  };
  onClose: () => void;
}

export function ComplaintDetailModal({ complaint, onClose }: ComplaintDetailModalProps) {
  const statusConfig = {
    submitted: {
      label: "Submitted",
      className: "bg-blue-100 text-blue-800 border-blue-300"
    },
    under_review: {
      label: "Under Investigation",
      className: "bg-orange-100 text-orange-800 border-orange-300"
    },
    resolved: {
      label: "Resolved",
      className: "bg-green-100 text-green-800 border-green-300"
    },
    closed: {
      label: "Closed",
      className: "bg-gray-100 text-gray-800 border-gray-300"
    }
  };

  const currentStatus = statusConfig[complaint.status];

  // Mock timeline data
  const timeline = [
    {
      date: complaint.submittedDate,
      status: "Submitted",
      description: "Complaint registered successfully",
      user: "System"
    },
    ...(complaint.status !== "submitted" ? [{
      date: complaint.lastUpdated,
      status: "Under Investigation",
      description: "Support team is reviewing your complaint",
      user: "Support Team"
    }] : []),
    ...(complaint.status === "resolved" || complaint.status === "closed" ? [{
      date: complaint.lastUpdated,
      status: complaint.status === "resolved" ? "Resolved" : "Closed",
      description: complaint.status === "resolved" 
        ? "Issue has been resolved. Please check the resolution notes." 
        : "Complaint has been closed.",
      user: "Support Team"
    }] : [])
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2a7f3e] to-[#1e5a2d] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Complaint Details</h2>
            <p className="text-sm text-white/80 mt-0.5">{complaint.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 ${currentStatus.className}`}>
              <Clock className="w-4 h-4" />
              {currentStatus.label}
            </span>
          </div>

          {/* Complaint Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                Submitted On
              </div>
              <div className="font-semibold text-gray-900">
                {new Date(complaint.submittedDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                Last Updated
              </div>
              <div className="font-semibold text-gray-900">
                {new Date(complaint.lastUpdated).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Tag className="w-4 h-4" />
                Category
              </div>
              <div className="font-semibold text-gray-900">{complaint.category}</div>
            </div>
            {complaint.applicationId && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FileText className="w-4 h-4" />
                  Related Application
                </div>
                <div className="font-semibold text-gray-900">{complaint.applicationId}</div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Complaint Title</h3>
            <p className="text-lg font-semibold text-gray-900">{complaint.title}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Attachments</h3>
              <div className="space-y-2">
                {complaint.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900 flex-1">{attachment}</span>
                    <button className="text-sm text-[#2a7f3e] font-medium hover:text-[#1e5a2d]">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-4">Status Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#2a7f3e]' : 'bg-gray-300'}`}></div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{event.status}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      {event.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Section (if resolved) */}
          {complaint.status === "resolved" && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Resolution</h4>
                  <p className="text-sm text-green-800">
                    Your issue has been resolved. The payment status has been updated and your application is now showing the correct status. If you still face any issues, please raise a new complaint.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Need help? Contact <strong>support@parivesh.gov.in</strong>
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#2a7f3e] text-white rounded-lg hover:bg-[#1e5a2d] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
