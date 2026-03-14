import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { GovHeader } from "../components/GovHeader";
import { Eye, Filter, Search, MapPin, Calendar, ShieldCheck, AlertTriangle, CheckCircle, Clock3 } from "lucide-react";
import { PublicProjects3DMap } from "../components/PublicProjects3DMap";
import { workflowApi, type PublicProject } from "../services/workflowApi";

const prettyStatus = (status: string) => status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const statusTheme = (status: string) => {
  const key = status.toUpperCase();
  if (key === "FINALIZED") return "bg-emerald-100 text-emerald-700";
  if (key === "MOM_GENERATED") return "bg-purple-100 text-purple-700";
  if (key === "REFERRED") return "bg-cyan-100 text-cyan-700";
  if (key === "UNDER_SCRUTINY") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
};

const riskColor = (risk: string) => {
  if (risk === "HIGH") return "text-red-700 bg-red-100";
  if (risk === "MODERATE") return "text-amber-700 bg-amber-100";
  return "text-emerald-700 bg-emerald-100";
};

export function ProjectsPage() {
  const [items, setItems] = useState<PublicProject[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await workflowApi.listPublicProjects({
          status: statusFilter === "all" ? undefined : statusFilter,
          sector: sectorFilter.trim() || undefined,
          location: locationFilter.trim() || undefined,
        });
        setItems(data.items);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Unable to load public project transparency data.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [statusFilter, sectorFilter, locationFilter]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((project) => {
      const text = `${project.application_id} ${project.project_name} ${project.sector} ${project.project_location}`.toLowerCase();
      return text.includes(q);
    });
  }, [items, searchQuery]);

  const summary = useMemo(() => ({
    total: filteredProjects.length,
    finalized: filteredProjects.filter((p) => p.current_status === "FINALIZED").length,
    underScrutiny: filteredProjects.filter((p) => p.current_status === "UNDER_SCRUTINY").length,
    verified: filteredProjects.filter((p) => p.audit_integrity === "VERIFIED").length,
  }), [filteredProjects]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GovHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Public Transparency Dashboard</h1>
              <p className="text-gray-600">Open visibility into environmental clearance workflow status and decisions</p>
            </div>
          </div>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Visible Projects</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{summary.total}</div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Under Scrutiny</div>
            <div className="mt-2 text-3xl font-bold text-amber-600">{summary.underScrutiny}</div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Finalized</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">{summary.finalized}</div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Audit Verified</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{summary.verified}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by application id, project name, sector, location"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Public Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_SCRUTINY">Under Scrutiny</option>
              <option value="REFERRED">Referred</option>
              <option value="MOM_GENERATED">MoM Generated</option>
              <option value="FINALIZED">Finalized</option>
            </select>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <input
                value={sectorFilter}
                onChange={(event) => setSectorFilter(event.target.value)}
                placeholder="Sector"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-3">
            <input
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              placeholder="Filter by location"
              className="w-full md:w-1/2 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Public Projects</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Application ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sector</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk Score</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">View Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-sm text-gray-500 text-center">Loading projects...</td>
                    </tr>
                  ) : filteredProjects.length ? (
                    filteredProjects.map((project) => (
                      <tr key={project.application_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-blue-700">#{project.application_id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{project.project_name}</div>
                          <div className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{new Date(project.submission_date).toLocaleDateString("en-IN")}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{project.sector}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{project.project_location}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusTheme(project.current_status)}`}>
                            {prettyStatus(project.current_status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${riskColor(project.environmental_risk_band)}`}>
                            {project.environmental_risk_score} ({project.environmental_risk_band})
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/projects/${project.application_id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm font-medium hover:shadow"
                          >
                            <Eye className="w-4 h-4" /> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-sm text-gray-500 text-center">No public projects found for selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">3D Public Project Map</h2>
              <p className="text-xs text-gray-500 mt-1">Tilt, zoom, and explore risk zones in a 3D-style view</p>
            </div>
            <div className="h-[520px]">
              <PublicProjects3DMap projects={filteredProjects} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Transparency Signals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="inline-flex items-center gap-2 text-emerald-800 font-semibold text-sm"><ShieldCheck className="w-4 h-4" /> Audit Integrity</div>
              <p className="text-xs text-emerald-700 mt-2">Projects with hash-chain evidence display VERIFIED state.</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="inline-flex items-center gap-2 text-blue-800 font-semibold text-sm"><Clock3 className="w-4 h-4" /> Workflow Visibility</div>
              <p className="text-xs text-blue-700 mt-2">Status reflects real pipeline: Submitted to Finalized.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="inline-flex items-center gap-2 text-amber-800 font-semibold text-sm"><AlertTriangle className="w-4 h-4" /> Risk Awareness</div>
              <p className="text-xs text-amber-700 mt-2">Environmental risk score helps citizens prioritize review focus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
