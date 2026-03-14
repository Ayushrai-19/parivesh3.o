import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import { BackToDashboard } from "../components/BackToDashboard";
import { useUser } from "../contexts/UserContext";
import type { BackendApplication, BackendDocument, BackendGist, BackendPayment, BackendTimeline } from "../services/workflowApi";
import { saveBlobResponse, workflowApi } from "../services/workflowApi";
import { FileText, Download, CreditCard, MapPin, Building2, Calendar, User, AlertCircle, FileClock } from "lucide-react";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export function ApplicationDetail() {
  const { id } = useParams();
  const { roleKey } = useUser();
  const [application, setApplication] = useState<BackendApplication | null>(null);
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [timeline, setTimeline] = useState<BackendTimeline | null>(null);
  const [gist, setGist] = useState<BackendGist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        return;
      }

      try {
        setError("");
        setIsLoading(true);

        const applicationId = Number(id);
        const [applicationResult, documentResult, paymentResult, timelineResult] = await Promise.all([
          workflowApi.getApplication(applicationId),
          workflowApi.listDocuments(applicationId),
          workflowApi.listApplicationPayments(applicationId),
          workflowApi.getApplicationTimeline(applicationId),
        ]);

        setApplication(applicationResult);
        setDocuments(documentResult);
        setPayments(paymentResult);
        setTimeline(timelineResult);

        try {
          const gistResult = await workflowApi.getApplicationGist(applicationId);
          setGist(gistResult);
        } catch {
          setGist(null);
        }
      } catch (loadError: any) {
        setError(loadError?.response?.data?.message || "Unable to load application details.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [id]);

  const latestPayment = payments[0] || null;

  const handleDocumentDownload = async (documentId: number) => {
    try {
      setActionMessage("");
      const response = await workflowApi.downloadDocument(documentId);
      saveBlobResponse(response, `document_${documentId}`);
      setActionMessage("Document download started.");
    } catch (downloadError: any) {
      setError(downloadError?.response?.data?.message || "Unable to download document.");
    }
  };

  const handleExport = async (type: "pdf" | "docx") => {
    if (!application) {
      return;
    }

    try {
      setActionMessage("");
      const response = type === "pdf" ? await workflowApi.downloadMomPdf(application.id) : await workflowApi.downloadMomDocx(application.id);
      saveBlobResponse(response, `mom_application_${application.id}.${type}`);
      setActionMessage(`${type.toUpperCase()} export download started.`);
    } catch (exportError: any) {
      setError(exportError?.response?.data?.message || `Unable to export ${type.toUpperCase()}.`);
    }
  };

  return (
    <DashboardLayout role={roleKey as "proponent" | "scrutiny" | "mom" | "admin"}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="-mt-2 mb-4">
            <BackToDashboard />
          </div>

          {application ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{application.project_name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-gray-600">Application ID: #{application.id}</span>
                  <StatusBadge status={application.status} />
                </div>
              </div>
              <div className="flex gap-3">
                {application.status === "FINALIZED" || application.status === "finalized" ? (
                  <>
                    <button type="button" onClick={() => handleExport("pdf")} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                      <Download className="w-4 h-4 inline mr-2" />
                      Export PDF
                    </button>
                    <button type="button" onClick={() => handleExport("docx")} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                      <Download className="w-4 h-4 inline mr-2" />
                      Export DOCX
                    </button>
                  </>
                ) : roleKey === "proponent" ? (
                  <Link to="/application/new" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                    Start New Application
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {actionMessage ? <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{actionMessage}</div> : null}

        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-sm text-gray-500">Loading application details...</div>
        ) : application ? (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Project Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Sector</label>
                  <p className="font-medium text-gray-900">{application.sector}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Location</label>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {application.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Category</label>
                  <p className="font-medium text-gray-900">{application.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Proponent</label>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {application.proponent_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Created On</label>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDateTime(application.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Last Updated</label>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDateTime(application.updated_at)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Description</label>
                  <p className="font-medium text-gray-900">{application.description}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Impact Summary</label>
                  <p className="font-medium text-gray-900">{application.impact_summary}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Uploaded Documents
                </h2>
                <div className="space-y-3">
                  {documents.length ? (
                    documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{document.file_name}</p>
                            <p className="text-xs text-gray-500">Uploaded on {formatDateTime(document.uploaded_at)}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleDocumentDownload(document.id)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors group" title="Download Document">
                          <Download className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">No documents uploaded yet.</div>
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Payment Status
                </h2>
                {latestPayment ? (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Latest Payment Recorded</p>
                          <p className="text-xs text-green-700">Verified on {formatDateTime(latestPayment.created_at)}</p>
                        </div>
                      </div>
                      <StatusBadge status={latestPayment.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Amount Paid</span>
                        <div className="font-bold text-green-900 text-lg">₹{latestPayment.amount.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Transaction Reference</span>
                        <div className="font-medium text-green-900">{latestPayment.transaction_reference}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">No payment record found for this application.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  Timeline & Scrutiny Notes
                </h2>
                <div className="space-y-4">
                  {timeline && (timeline.audit.length || timeline.eds.length) ? (
                    <>
                      {timeline.audit.map((item) => (
                        <div key={`audit-${item.id}`} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-center justify-between mb-1 gap-4">
                            <p className="text-sm font-medium text-gray-900">{item.changed_by_name} ({item.changed_by_role})</p>
                            <p className="text-xs text-gray-500">{formatDateTime(item.timestamp)}</p>
                          </div>
                          <p className="text-sm text-gray-700">{item.old_status ? `${item.old_status} → ${item.new_status}` : item.new_status}</p>
                          {item.notes ? <p className="text-sm text-gray-600 mt-1">{item.notes}</p> : null}
                        </div>
                      ))}
                      {timeline.eds.map((item) => (
                        <div key={`eds-${item.id}`} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-xl">
                          <div className="flex items-center justify-between mb-1 gap-4">
                            <p className="text-sm font-medium text-gray-900">EDS by {item.raised_by_name}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(item.created_at)}</p>
                          </div>
                          <p className="text-sm text-gray-700">{item.reason}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">No workflow timeline available yet.</div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileClock className="w-5 h-5 text-indigo-600" />
                    Meeting Gist
                  </h2>
                  {gist ? (
                    <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{gist.edited_content || gist.content}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">Meeting gist will be available after the application is referred to MoM.</div>
                  )}
                </div>

                {application.latest_eds_reason ? (
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                    <h2 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Essential Documents Sought
                    </h2>
                    <p className="text-sm text-red-800">{application.latest_eds_reason}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-sm text-gray-500">Application not found.</div>
        )}
      </div>
    </DashboardLayout>
  );
}