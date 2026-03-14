import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { GovHeader } from "../components/GovHeader";
import { workflowApi, type PublicProjectDetail } from "../services/workflowApi";
import { ArrowLeft, ShieldCheck, FileText, MapPin, Calendar, AlertTriangle } from "lucide-react";

const prettyStatus = (status: string) => status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function PublicProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<PublicProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await workflowApi.getPublicProjectDetail(Number(id));
        setProject(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Unable to load project details.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const currentStageIndex = useMemo(() => {
    if (!project) return -1;
    return project.workflow_progress.findIndex((stage) => stage.is_current);
  }, [project]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GovHeader />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900">
            <ArrowLeft className="w-4 h-4" /> Back to Public Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-8 text-sm text-gray-500">Loading project details...</div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-sm text-red-700">{error}</div>
        ) : project ? (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.project_name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span>Application ID: #{project.application_id}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{project.location}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(project.submission_date).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{prettyStatus(project.current_status)}</span>
                  {project.approval_decision ? (
                    <div className="mt-2 text-xs font-semibold text-emerald-700">Decision: {project.approval_decision}</div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  {project.workflow_progress.map((stage, idx) => (
                    <div key={stage.stage} className={`rounded-xl border p-3 text-center ${stage.is_current ? "border-blue-500 bg-blue-50" : stage.is_completed ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-gray-50"}`}>
                      <div className="text-[11px] text-gray-500">Step {idx + 1}</div>
                      <div className="text-xs font-semibold mt-1 text-gray-800">{prettyStatus(stage.stage)}</div>
                    </div>
                  ))}
                </div>
                {currentStageIndex >= 0 ? (
                  <p className="mt-3 text-sm text-gray-600">Current stage: <span className="font-semibold text-gray-900">{prettyStatus(project.workflow_progress[currentStageIndex].stage)}</span></p>
                ) : null}
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Public Risk Snapshot</h2>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <div className="text-sm text-amber-700">Environmental Risk Score</div>
                  <div className="text-3xl font-bold text-amber-800 mt-1">{project.environmental_risk_score}</div>
                  <div className="text-xs font-semibold text-amber-700 mt-1">{project.environmental_risk_band}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 inline-flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Environmental Risk Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{project.environmental_risk_summary}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <div className="text-gray-500">Land Area Diameter</div>
                    <div className="mt-1 font-semibold text-gray-900">{project.land_area_diameter_km ? `${project.land_area_diameter_km} km` : "Not provided"}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <div className="text-gray-500">Forest Land Area</div>
                    <div className="mt-1 font-semibold text-gray-900">{project.forest_land_area_ha !== null ? `${project.forest_land_area_ha} ha` : "Not provided"}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <div className="text-gray-500">Water Requirement</div>
                    <div className="mt-1 font-semibold text-gray-900">{project.water_requirement_kld !== null ? `${project.water_requirement_kld} KLD` : "Not provided"}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <div className="text-gray-500">Map Overlay Radius</div>
                    <div className="mt-1 font-semibold text-gray-900">{project.circle_radius_m ? `${project.circle_radius_m} m` : "Pending docs/payment"}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 inline-flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" /> AI Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{project.ai_summary || "No AI summary available."}</p>
              </div>
            </div>

            {project.mom_summary ? (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">MoM Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{project.mom_summary}</p>
              </div>
            ) : null}

            {(project.biodiversity_impact || project.mitigation_measures) ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Biodiversity Impact</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.biodiversity_impact || "Not available"}</p>
                </div>
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mitigation Measures</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.mitigation_measures || "Not available"}</p>
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border p-5 shadow-sm bg-white">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Audit Integrity: {project.audit_integrity}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
