import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatsCard } from "../components/StatsCard";
import { StatusBadge } from "../components/StatusBadge";
import type { BackendApplication } from "../services/workflowApi";
import { workflowApi } from "../services/workflowApi";
import { Clock, AlertCircle, CheckCircle2, FileCheck, X, Shield } from "lucide-react";

interface QueueApplication extends BackendApplication {
  documentsCount: number;
  paymentStatus: string;
  paymentCount: number;
}

const formatStatusKey = (status: string) => status.trim().toLowerCase();

export function ScrutinyDashboard() {
  const [applications, setApplications] = useState<QueueApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartScrutiny, setShowStartScrutiny] = useState(false);
  const [selectedApp, setSelectedApp] = useState<QueueApplication | null>(null);
  const [scrutinyNotes, setScrutinyNotes] = useState("");

  const loadQueue = async () => {
    try {
      setError("");
      setIsLoading(true);
      const queue = await workflowApi.getScrutinyQueue();
      const enriched = await Promise.all(
        queue.map(async (application) => {
          const [documents, payments] = await Promise.all([
            workflowApi.listDocuments(application.id),
            workflowApi.listApplicationPayments(application.id),
          ]);

          return {
            ...application,
            documentsCount: documents.length,
            paymentCount: payments.length,
            paymentStatus: payments.some((payment) => formatStatusKey(payment.status) === "success") ? "success" : "failed",
          };
        })
      );

      setApplications(enriched);
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message || "Unable to load scrutiny queue.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const stats = useMemo(() => {
    const pending = applications.filter((application) => formatStatusKey(application.status) === "submitted").length;
    const eds = applications.filter((application) => formatStatusKey(application.status) === "essential_doc_sought").length;
    const review = applications.filter((application) => formatStatusKey(application.status) === "under_scrutiny").length;
    const verified = applications.filter((application) => application.documentsCount >= 2 && application.paymentStatus === "success").length;
    return { pending, eds, review, verified };
  }, [applications]);

  const resetModals = () => {
    setShowStartScrutiny(false);
    setSelectedApp(null);
    setScrutinyNotes("");
  };

  const handleStartScrutiny = async () => {
    if (!selectedApp) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await workflowApi.startScrutiny(selectedApp.id);
      setSuccessMessage(`Application #${selectedApp.id} moved to scrutiny.`);
      resetModals();
      await loadQueue();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || "Unable to start scrutiny.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <DashboardLayout role="scrutiny">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scrutiny Team Dashboard</h1>
          <p className="text-gray-600">Review live submissions, raise EDS, and refer verified applications into the MoM queue</p>
        </div>

        <div className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-2xl shadow-xl border-2 border-blue-300 p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Workflow Queue Is Live</h3>
              <p className="text-white/90 text-sm mb-3">Every row below is loaded from the backend. Starting scrutiny, raising EDS, and referring to MoM update the same application record the proponent created.</p>
            </div>
          </div>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {successMessage ? <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Pending Review" value={stats.pending} icon={Clock} color="amber" />
          <StatsCard title="EDS Raised" value={stats.eds} icon={AlertCircle} color="red" />
          <StatsCard title="Under Scrutiny" value={stats.review} icon={CheckCircle2} color="green" />
          <StatsCard title="Docs Verified" value={stats.verified} icon={FileCheck} color="blue" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Applications Under Review</h2>
            <p className="text-sm text-gray-500 mt-1">Queue contains submitted and active scrutiny items from the database</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Application ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Proponent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-sm text-gray-500">Loading scrutiny queue...</td>
                  </tr>
                ) : applications.length ? (
                  applications.map((application) => {
                    const status = formatStatusKey(application.status);
                    const documentsComplete = application.documentsCount >= 2;
                    return (
                      <tr key={application.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">#{application.id}</div>
                          <div className="text-xs text-gray-500">{new Date(application.updated_at).toLocaleDateString("en-IN")}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{application.project_name}</div>
                          <div className="mt-1 text-xs text-gray-500">{application.sector} • {application.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">{application.proponent_name || "Proponent"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${documentsComplete ? "text-green-600" : "text-red-600"}`}>
                            {documentsComplete ? `Complete (${application.documentsCount})` : `Incomplete (${application.documentsCount})`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={application.paymentStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {status === "submitted" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApp(application);
                                  setShowStartScrutiny(true);
                                }}
                                className="px-3 py-1.5 text-sm bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors font-medium"
                              >
                                Start Scrutiny
                              </button>
                            ) : (
                              <Link to={`/dashboard/scrutiny/review/${application.id}`} className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                                Review
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-sm text-gray-500">No applications are waiting in the scrutiny queue.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showStartScrutiny && selectedApp ? (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative">
              <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-t-3xl flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Start Scrutiny</h2>
                <button type="button" onClick={resetModals} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-2">Application ID: <strong>#{selectedApp.id}</strong></p>
                <p className="text-gray-600 mb-6">Project: <strong>{selectedApp.project_name}</strong></p>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scrutiny Notes</label>
                <textarea
                  value={scrutinyNotes}
                  onChange={(event) => setScrutinyNotes(event.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Initial review notes"
                />
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={resetModals} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="button" onClick={handleStartScrutiny} disabled={isSubmitting || !scrutinyNotes.trim()} className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">Start Scrutiny</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

      </div>
    </DashboardLayout>
  );
}