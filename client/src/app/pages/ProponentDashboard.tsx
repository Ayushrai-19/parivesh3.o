import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import { FileText, FolderOpen, Clock, CheckCircle, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { BackendApplication } from "../services/workflowApi";
import { workflowApi } from "../services/workflowApi";

const statusColors: Record<string, string> = {
  draft: "#94a3b8",
  submitted: "#3b82f6",
  under_scrutiny: "#f59e0b",
  essential_doc_sought: "#ef4444",
  mom_generated: "#8b5cf6",
  finalized: "#10b981",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_scrutiny: "Under Scrutiny",
  essential_doc_sought: "EDS Raised",
  mom_generated: "MoM Queue",
  finalized: "Finalized",
};

const formatStatusKey = (status: string) => status.trim().toLowerCase();

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function ProponentDashboard() {
  const [applications, setApplications] = useState<BackendApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await workflowApi.listApplications(1, 100);
        setApplications(response.items);
      } catch (loadError: any) {
        setError(loadError?.response?.data?.message || "Unable to load applications.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadApplications();
  }, []);

  const totals = useMemo(() => {
    const counts = {
      total: applications.length,
      drafts: 0,
      scrutiny: 0,
      finalized: 0,
    };

    for (const application of applications) {
      const status = formatStatusKey(application.status);
      if (status === "draft" || status === "essential_doc_sought") {
        counts.drafts += 1;
      }
      if (["submitted", "under_scrutiny", "mom_generated"].includes(status)) {
        counts.scrutiny += 1;
      }
      if (status === "finalized") {
        counts.finalized += 1;
      }
    }

    return counts;
  }, [applications]);

  const statusDistribution = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const application of applications) {
      const key = formatStatusKey(application.status);
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }

    return Array.from(grouped.entries()).map(([key, value]) => ({
      name: statusLabels[key] || key,
      value,
      color: statusColors[key] || "#64748b",
    }));
  }, [applications]);

  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { month: string; submitted: number; approved: number }>();

    for (let offset = 5; offset >= 0; offset -= 1) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - offset);
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      map.set(key, {
        month: monthDate.toLocaleString("en-IN", { month: "short" }),
        submitted: 0,
        approved: 0,
      });
    }

    for (const application of applications) {
      const created = new Date(application.created_at);
      const key = `${created.getFullYear()}-${created.getMonth()}`;
      const row = map.get(key);
      if (!row) {
        continue;
      }
      row.submitted += 1;
      if (formatStatusKey(application.status) === "finalized") {
        row.approved += 1;
      }
    }

    return Array.from(map.values());
  }, [applications]);

  return (
    <DashboardLayout role="proponent">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 pb-4 border-b-2 border-[#2a7f3e]">
          <h1 className="text-2xl font-bold text-gray-900">Project Proponent Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your environmental clearance applications from the live workflow</p>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border-l-4 border-[#2a7f3e] shadow rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{totals.total}</p>
              </div>
              <FileText className="w-12 h-12 text-[#2a7f3e] opacity-20" />
            </div>
          </div>

          <div className="bg-white border-l-4 border-[#ff9800] shadow rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Draft / EDS</p>
                <p className="text-3xl font-bold text-gray-900">{totals.drafts}</p>
              </div>
              <FolderOpen className="w-12 h-12 text-[#ff9800] opacity-20" />
            </div>
          </div>

          <div className="bg-white border-l-4 border-[#1976d2] shadow rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">In Process</p>
                <p className="text-3xl font-bold text-gray-900">{totals.scrutiny}</p>
              </div>
              <Clock className="w-12 h-12 text-[#1976d2] opacity-20" />
            </div>
          </div>

          <div className="bg-white border-l-4 border-[#4caf50] shadow rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Finalized</p>
                <p className="text-3xl font-bold text-gray-900">{totals.finalized}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-[#4caf50] opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Application Status Distribution</h3>
            </div>
            <div className="p-6">
              {statusDistribution.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" isAnimationActive={false}>
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`proponent-status-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No application data yet.</div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Application Trends (Last 6 Months)</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e0e0e0", borderRadius: "4px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="submitted" stroke="#2a7f3e" strokeWidth={2} name="Created" />
                  <Line type="monotone" dataKey="approved" stroke="#4caf50" strokeWidth={2} name="Finalized" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Applications</h2>
              <p className="text-xs text-gray-600 mt-1">Track live submissions, EDS, scrutiny, and MoM outcomes</p>
            </div>
            <Link to="/application/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a7f3e] text-white rounded hover:bg-[#1e5a2d] transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              New Application
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Application ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-10 text-sm text-gray-500" colSpan={6}>Loading applications...</td>
                  </tr>
                ) : applications.length ? (
                  applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">#{application.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{application.project_name}</div>
                        {application.latest_eds_reason ? <div className="text-xs text-red-600 mt-1">EDS: {application.latest_eds_reason}</div> : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{application.sector}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatTimestamp(application.updated_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link to={`/application/${application.id}`} className="text-[#2a7f3e] hover:text-[#1e5a2d] font-medium text-sm">
                            View Details →
                          </Link>
                          {["finalized", "mom_generated"].includes(formatStatusKey(application.status)) && (
                            <Link
                              to={`/mom/${application.id}/view`}
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-200 px-2 py-0.5 rounded"
                            >
                              View MoM →
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-10 text-sm text-gray-500" colSpan={6}>No applications found. Start by creating a new application.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}