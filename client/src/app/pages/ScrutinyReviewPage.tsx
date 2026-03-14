import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import { BackToDashboard } from "../components/BackToDashboard";
import type { BackendApplication, BackendDocument, BackendPayment, BackendTimeline } from "../services/workflowApi";
import { saveBlobResponse, workflowApi } from "../services/workflowApi";
import { ArrowLeft, FileText, Download, Send, MessageSquare, CheckCircle, AlertCircle, Calendar, Building, MapPin, X, FileCheck, CreditCard } from "lucide-react";

const formatStatusKey = (status: string) => status.trim().toLowerCase();
const formatDateTime = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function ScrutinyReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<BackendApplication | null>(null);
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [timeline, setTimeline] = useState<BackendTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showEdsModal, setShowEdsModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [edsRemarks, setEdsRemarks] = useState("");
  const [referRemarks, setReferRemarks] = useState("");

  const loadData = async () => {
    if (!id) {
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const applicationId = Number(id);
      const [applicationResult, documentsResult, paymentsResult, timelineResult] = await Promise.all([
        workflowApi.getApplication(applicationId),
        workflowApi.listDocuments(applicationId),
        workflowApi.listApplicationPayments(applicationId),
        workflowApi.getApplicationTimeline(applicationId),
      ]);

      setApplication(applicationResult);
      setDocuments(documentsResult);
      setPayments(paymentsResult);
      setTimeline(timelineResult);
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message || "Unable to load application review data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  const handleDownloadDocument = async (documentId: number) => {
    try {
      const response = await workflowApi.downloadDocument(documentId);
      saveBlobResponse(response, `document_${documentId}`);
    } catch (downloadError: any) {
      setError(downloadError?.response?.data?.message || "Unable to download document.");
    }
  };

  const handleStartScrutiny = async () => {
    if (!application) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await workflowApi.startScrutiny(application.id);
      setSuccessMessage(`Application #${application.id} is now under scrutiny.`);
      await loadData();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || "Unable to start scrutiny.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRaiseEds = async () => {
    if (!application || !edsRemarks.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await workflowApi.raiseEds(application.id, edsRemarks.trim());
      setSuccessMessage(`EDS raised for application #${application.id}.`);
      setShowEdsModal(false);
      setEdsRemarks("");
      await loadData();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || "Unable to raise EDS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefer = async () => {
    if (!application) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await workflowApi.referToMom(application.id);
      setSuccessMessage(`Application #${application.id} referred to MoM.`);
      setShowReferModal(false);
      setReferRemarks("");
      await loadData();
      window.setTimeout(() => navigate("/dashboard/mom"), 1200);
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || "Unable to refer application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = application ? formatStatusKey(application.status) : "";
  const hasSuccessfulPayment = payments.some((payment) => formatStatusKey(payment.status) === "success");
  const documentsComplete = documents.length >= 2;

  return (
    <DashboardLayout role="scrutiny">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="-mt-2 mb-4">
            <BackToDashboard />
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Scrutiny Review</h1>
              {application ? (
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-gray-600">Application ID: #{application.id}</span>
                  <StatusBadge status={application.status} />
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/scrutiny" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back To Queue
              </Link>
              {status === "submitted" ? (
                <button type="button" onClick={handleStartScrutiny} disabled={isSubmitting} className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium disabled:opacity-60">
                  Start Scrutiny
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {successMessage ? <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div> : null}

        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-sm text-gray-500">Loading application review...</div>
        ) : application ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Application Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Project Name</label>
                    <p className="font-medium text-gray-900">{application.project_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Proponent</label>
                    <p className="font-medium text-gray-900">{application.proponent_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Sector</label>
                    <p className="font-medium text-gray-900">{application.sector}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Category</label>
                    <p className="font-medium text-gray-900">{application.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Location</label>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{application.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Updated</label>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{formatDateTime(application.updated_at)}</p>
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

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  Review Summary
                </h2>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Documents Uploaded</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{documents.length}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Payment Status</div>
                  <div className="mt-2"><StatusBadge status={hasSuccessfulPayment ? "success" : "failed"} /></div>
                </div>
                {application.latest_eds_reason ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-red-900">Latest EDS Reason</div>
                        <div className="text-sm text-red-800 mt-1">{application.latest_eds_reason}</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Supporting Documents
                </h2>
                <div className="space-y-3">
                  {documents.length ? (
                    documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">{document.file_name}</div>
                          <div className="text-xs text-gray-500">{document.file_type} • {formatDateTime(document.uploaded_at)}</div>
                        </div>
                        <button type="button" onClick={() => handleDownloadDocument(document.id)} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">No documents uploaded.</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Payment Records
                </h2>
                <div className="space-y-3">
                  {payments.length ? (
                    payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">₹{payment.amount.toLocaleString("en-IN")}</div>
                          <div className="text-xs text-gray-500">{payment.method_label} • {payment.transaction_reference}</div>
                          <div className="text-xs text-gray-500">{formatDateTime(payment.created_at)}</div>
                        </div>
                        <StatusBadge status={payment.status} />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">No payment records found.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                Workflow Timeline
              </h2>
              <div className="space-y-4">
                {timeline && (timeline.audit.length || timeline.eds.length) ? (
                  <>
                    {timeline.audit.map((item) => (
                      <div key={`audit-${item.id}`} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <div className="font-medium text-gray-900">{item.changed_by_name}</div>
                          <div className="text-xs text-gray-500">{formatDateTime(item.timestamp)}</div>
                        </div>
                        <div className="text-sm text-gray-700">{item.old_status ? `${item.old_status} → ${item.new_status}` : item.new_status}</div>
                        {item.notes ? <div className="text-sm text-gray-600 mt-1">{item.notes}</div> : null}
                      </div>
                    ))}
                    {timeline.eds.map((item) => (
                      <div key={`eds-${item.id}`} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-xl">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <div className="font-medium text-gray-900">EDS raised by {item.raised_by_name}</div>
                          <div className="text-xs text-gray-500">{formatDateTime(item.created_at)}</div>
                        </div>
                        <div className="text-sm text-gray-700">{item.reason}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">No workflow events recorded yet.</div>
)}
              </div>
            </div>

            {status === "under_scrutiny" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  Decision Actions
                </h2>
                <p className="text-sm text-gray-500 mb-6">After reviewing all documents and payment records, choose one of the following actions.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEdsModal(true)}
                    className="flex flex-col items-start gap-2 px-6 py-5 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 font-semibold text-red-700 text-base">
                      <AlertCircle className="w-5 h-5" />
                      Raise EDS
                    </div>
                    <p className="text-sm text-red-600">Request missing or corrected documents from the proponent</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReferModal(true)}
                    className="flex flex-col items-start gap-2 px-6 py-5 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 font-semibold text-green-700 text-base">
                      <CheckCircle className="w-5 h-5" />
                      Refer to MoM
                    </div>
                    <p className="text-sm text-green-600">Application passes scrutiny — move to the MoM queue</p>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-sm text-gray-500">Application not found.</div>
        )}

        {showEdsModal && application ? (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative">
              <div className="sticky top-0 bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-3xl flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Raise Essential Documents Sought</h2>
                <button type="button" onClick={() => setShowEdsModal(false)} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-4">Application #{application.id}</p>
                <textarea
                  value={edsRemarks}
                  onChange={(event) => setEdsRemarks(event.target.value)}
                  rows={7}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Specify missing documents or changes required from the proponent"
                />
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowEdsModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="button" onClick={handleRaiseEds} disabled={isSubmitting || !edsRemarks.trim()} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">Raise EDS</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showReferModal && application ? (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative">
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-3xl flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Refer Application To MoM</h2>
                <button type="button" onClick={() => setShowReferModal(false)} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-4">Application #{application.id}</p>
                <textarea
                  value={referRemarks}
                  onChange={(event) => setReferRemarks(event.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Optional internal remarks before the MoM team takes over"
                />
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 mt-4 text-sm text-green-800">
                  Referral will generate or refresh the gist and place this application in the MoM queue.
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowReferModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="button" onClick={handleRefer} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4 inline mr-2" />
                    Refer To MoM
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}