import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import { FileText, Search, Filter, Eye, Plus, Calendar } from "lucide-react";
import { useParams, Link } from "react-router";
import type { BackendApplication } from "../services/workflowApi";
import { workflowApi } from "../services/workflowApi";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));

const statusKey = (value: string) => value.trim().toLowerCase();

export function ApplicationsPage() {
  const { role } = useParams();
  const roleKey = role || "proponent";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<BackendApplication[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        setIsLoading(true);

        if (roleKey === "scrutiny") {
          const queue = await workflowApi.getScrutinyQueue();
          setApplications(queue);
          return;
        }

        if (roleKey === "mom") {
          const queue = await workflowApi.getMomQueue();
          setApplications(queue);
          return;
        }

        const result = await workflowApi.listApplications(1, 200);
        setApplications(result.items);
      } catch (loadError: any) {
        setError(loadError?.response?.data?.message || "Unable to load applications.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [roleKey]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchTarget = `${application.id} ${application.project_name} ${application.proponent_name || ""} ${application.sector}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchTerm.trim().toLowerCase());
      const matchesFilter = filterStatus === "all" || statusKey(application.status) === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [applications, filterStatus, searchTerm]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(applications.map((application) => statusKey(application.status))));
    return [
      { value: "all", label: "All Status" },
      ...uniqueStatuses.map((status) => ({
        value: status,
        label: status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      })),
    ];
  }, [applications]);

  const stats = useMemo(() => {
    const total = applications.length;
    const inProgress = applications.filter((application) =>
      ["submitted", "under_scrutiny", "essential_doc_sought", "mom_generated"].includes(statusKey(application.status))
    ).length;
    const finalized = applications.filter((application) => statusKey(application.status) === "finalized").length;
    const drafts = applications.filter((application) => statusKey(application.status) === "draft").length;
    return { total, inProgress, finalized, drafts };
  }, [applications]);

  return (
    <DashboardLayout role={roleKey}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
              <p className="text-gray-600">
                {roleKey === "proponent" && "Manage and track your environmental clearance applications"}
                {roleKey === "scrutiny" && "Review submitted applications waiting for verification"}
                {roleKey === "mom" && "Applications referred for MoM preparation"}
                {roleKey === "admin" && "Monitor all applications in the system"}
              </p>
            </div>
            {roleKey === "proponent" ? (
              <Link
                to="/application/new"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Application
              </Link>
            ) : null}
          </div>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm opacity-90">Total Applications</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold mb-1">{stats.inProgress}</p>
            <p className="text-sm opacity-90">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold mb-1">{stats.finalized}</p>
            <p className="text-sm opacity-90">Finalized</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold mb-1">{stats.drafts}</p>
            <p className="text-sm opacity-90">Drafts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, project name, sector, or proponent..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer min-w-[220px]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Application ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sector</th>
                  {(roleKey === "scrutiny" || roleKey === "mom" || roleKey === "admin") ? (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Proponent</th>
                  ) : null}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading applications...</td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No applications found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-blue-600">#{application.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{application.project_name}</p>
                        <p className="text-xs text-gray-500 mt-1">{application.location}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {application.sector}
                        </span>
                      </td>
                      {(roleKey === "scrutiny" || roleKey === "mom" || roleKey === "admin") ? (
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{application.proponent_name || "Proponent"}</span>
                        </td>
                      ) : null}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(application.updated_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/application/${application.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredApplications.length > 0 ? (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong> applications
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}