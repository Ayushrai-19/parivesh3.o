import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatsCard } from "../components/StatsCard";
import { StatusBadge } from "../components/StatusBadge";
import type { BackendApplication, BackendGist, MomDocumentData } from "../services/workflowApi";
import { saveBlobResponse, workflowApi } from "../services/workflowApi";
import { FileText, Edit3, Download, CheckCircle, FileCheck, Lock, Calendar, Building, Printer, Sparkles, Eye, Save } from "lucide-react";

interface MomEdits {
  agenda_id: string; meeting_venue: string; meeting_mode: string; date_time: string;
  opening_remarks: string; committee_discussion: string; project_description: string;
  proposal_for: string; proposal_no: string; file_no: string; submission_date: string;
  activity_sub_activity: string; salient_features: string;
  village: string; district_taluka: string; state_code: string;
}

const emptyMomEdits: MomEdits = {
  agenda_id: "", meeting_venue: "", meeting_mode: "", date_time: "",
  opening_remarks: "", committee_discussion: "", project_description: "",
  proposal_for: "", proposal_no: "", file_no: "", submission_date: "",
  activity_sub_activity: "", salient_features: "",
  village: "", district_taluka: "", state_code: "",
};

function parseMomEdits(raw: string): MomEdits {
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === "object") return { ...emptyMomEdits, ...p };
  } catch {
    const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
    if (s !== -1 && e > s) {
      try {
        const p = JSON.parse(raw.slice(s, e + 1));
        if (p && typeof p === "object") return { ...emptyMomEdits, ...p };
      } catch { /* ignore */ }
    }
  }
  return emptyMomEdits;
}

const formatStatusKey = (status: string) => status.trim().toLowerCase();
const formatDate = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function MoMDashboard() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<BackendApplication[]>([]);
  const [finalizedApplications, setFinalizedApplications] = useState<BackendApplication[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [gist, setGist] = useState<BackendGist | null>(null);
  const [gistContent, setGistContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isMomGenerating, setIsMomGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // MoM draft state
  const [momDoc, setMomDoc] = useState<MomDocumentData | null>(null);
  const [momEdits, setMomEdits] = useState<MomEdits>(emptyMomEdits);
  const [isMomSaving, setIsMomSaving] = useState(false);
  const [isMomEditMode, setIsMomEditMode] = useState(false);

  const loadDashboardData = async (preferredApplicationId?: number | null) => {
    try {
      setError("");
      setIsLoading(true);

      const [queueResult, applicationsResult] = await Promise.all([
        workflowApi.getMomQueue(),
        workflowApi.listApplications(1, 200),
      ]);

      const finalized = applicationsResult.items.filter((application) => formatStatusKey(application.status) === "finalized");
      setQueue(queueResult);
      setFinalizedApplications(finalized);

      const nextSelectedId = preferredApplicationId ?? queueResult[0]?.id ?? null;
      setSelectedApplicationId(nextSelectedId);

      if (nextSelectedId) {
        const gistResult = await workflowApi.getGist(nextSelectedId);
        setGist(gistResult);
        setGistContent(gistResult.edited_content || gistResult.content);
        try {
          const momResult = await workflowApi.getMomDocument(nextSelectedId);
          setMomDoc(momResult);
          setMomEdits(parseMomEdits(momResult.content));
        } catch {
          setMomDoc(null);
          setMomEdits(emptyMomEdits);
        }
      } else {
        setGist(null);
        setGistContent("");
        setMomDoc(null);
        setMomEdits(emptyMomEdits);
      }
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message || "Unable to load MoM dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const selectedApplication = useMemo(
    () => queue.find((application) => application.id === selectedApplicationId) || null,
    [queue, selectedApplicationId]
  );

  const stats = useMemo(
    () => ({
      queue: queue.length,
      generated: queue.filter((application) => Boolean(application.generated_at)).length,
      finalized: finalizedApplications.length,
    }),
    [queue, finalizedApplications]
  );

  const handleSelectApplication = async (applicationId: number) => {
    try {
      setSelectedApplicationId(applicationId);
      setError("");
      setMomDoc(null);
      setMomEdits(emptyMomEdits);
      setIsMomEditMode(false);
      const gistResult = await workflowApi.getGist(applicationId);
      setGist(gistResult);
      setGistContent(gistResult.edited_content || gistResult.content);
      try {
        const momResult = await workflowApi.getMomDocument(applicationId);
        setMomDoc(momResult);
        setMomEdits(parseMomEdits(momResult.content));
      } catch { /* no MoM yet */ }
    } catch (selectError: any) {
      setError(selectError?.response?.data?.message || "Unable to load gist.");
    }
  };

  const handleAiRegenerate = async () => {
    if (!selectedApplicationId) return;
    try {
      setIsAiGenerating(true);
      setError("");
      setSuccessMessage("");
      const updated = await workflowApi.aiRegenerateGist(selectedApplicationId);
      setGist(updated);
      setGistContent(updated.edited_content || updated.content);
      setSuccessMessage(`Gist regenerated with AI for application #${selectedApplicationId}.`);
    } catch (aiError: any) {
      setError(aiError?.response?.data?.message || "AI generation failed. Check that GEMINI_API_KEY is set.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAiGenerateMom = async () => {
    if (!selectedApplicationId) return;
    try {
      setIsMomGenerating(true);
      setError("");
      setSuccessMessage("");
      await workflowApi.aiGenerateMom(selectedApplicationId);
      // Load the generated MoM into state immediately
      const momResult = await workflowApi.getMomDocument(selectedApplicationId);
      setMomDoc(momResult);
      setMomEdits(parseMomEdits(momResult.content));
      setIsMomEditMode(true); // open editor so user can review/edit
      setSuccessMessage(`MoM generated with AI. Review and edit below, then Finalize when ready.`);
    } catch (momError: any) {
      setError(momError?.response?.data?.message || "MoM AI generation failed.");
    } finally {
      setIsMomGenerating(false);
    }
  };

  const handleSaveMomContent = async () => {
    if (!selectedApplicationId) return;
    try {
      setIsMomSaving(true);
      setError("");
      await workflowApi.updateMomContent(selectedApplicationId, JSON.stringify(momEdits));
      setSuccessMessage(`MoM draft saved for application #${selectedApplicationId}.`);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Unable to save MoM draft.");
    } finally {
      setIsMomSaving(false);
    }
  };

  const handleSaveGist = async () => {
    if (!selectedApplicationId || !gistContent.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      const updated = await workflowApi.updateGist(selectedApplicationId, gistContent.trim());
      setGist(updated);
      setGistContent(updated.edited_content || updated.content);
      setSuccessMessage(`Gist saved for application #${selectedApplicationId}.`);
    } catch (saveError: any) {
      setError(saveError?.response?.data?.message || "Unable to save gist.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvertToDraft = async () => {
    if (!selectedApplicationId) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await workflowApi.convertToMomDraft(selectedApplicationId);
      setSuccessMessage(`MoM draft prepared for application #${selectedApplicationId}.`);
    } catch (convertError: any) {
      setError(convertError?.response?.data?.message || "Unable to convert gist to MoM draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!selectedApplicationId) return;
    try {
      setIsSaving(true);
      setError("");
      if (momDoc) {
        // Save latest edits then finalize
        await workflowApi.updateMomContent(selectedApplicationId, JSON.stringify(momEdits));
      } else {
        // Fall back to converting gist if no AI MoM exists
        await workflowApi.convertToMomDraft(selectedApplicationId);
      }
      await workflowApi.finalizeMom(selectedApplicationId);
      setSuccessMessage(`Application #${selectedApplicationId} finalized. Exports are now available.`);
      await loadDashboardData(null);
    } catch (finalizeError: any) {
      setError(finalizeError?.response?.data?.message || "Unable to finalize MoM.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (applicationId: number, type: "pdf" | "docx") => {
    try {
      setError("");
      const response = type === "pdf" ? await workflowApi.downloadMomPdf(applicationId) : await workflowApi.downloadMomDocx(applicationId);
      saveBlobResponse(response, `mom_application_${applicationId}.${type}`);
      setSuccessMessage(`${type.toUpperCase()} export download started for application #${applicationId}.`);
    } catch (exportError: any) {
      setError(exportError?.response?.data?.message || `Unable to export ${type.toUpperCase()}.`);
    }
  };

  return (
    <DashboardLayout role="mom">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MoM Dashboard</h1>
          <p className="text-gray-600">Review referred applications, edit gist, lock final minutes, and export official documents</p>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {successMessage ? <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="MoM Queue" value={stats.queue} icon={FileText} color="blue" />
          <StatsCard title="Gists Generated" value={stats.generated} icon={Edit3} color="cyan" />
          <StatsCard title="Finalized" value={stats.finalized} icon={CheckCircle} color="green" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Referred Queue</h2>
              <p className="text-sm text-gray-500 mt-1">Applications referred from scrutiny appear here after gist generation</p>
            </div>
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="px-6 py-8 text-sm text-gray-500">Loading queue...</div>
              ) : queue.length ? (
                queue.map((application) => (
                  <button
                    key={application.id}
                    type="button"
                    onClick={() => void handleSelectApplication(application.id)}
                    className={`w-full text-left px-6 py-4 transition-colors ${selectedApplicationId === application.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <div className="font-medium text-gray-900">#{application.id} • {application.project_name}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5" />
                      {application.sector}
                    </div>
                    <div className="mt-2"><StatusBadge status={application.status} /></div>
                  </button>
                ))
              ) : (
                <div className="px-6 py-8 text-sm text-gray-500">No applications are currently in the MoM queue.</div>
              )}
            </div>
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {selectedApplication && gist ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">#{selectedApplication.id} • {selectedApplication.project_name}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1"><Building className="w-4 h-4" />{selectedApplication.sector}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(selectedApplication.updated_at)}</span>
                    </div>
                  </div>
                  <StatusBadge status={selectedApplication.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-600">Generated</div>
                    <div className="mt-1 font-semibold text-gray-900">{selectedApplication.generated_at ? formatDate(selectedApplication.generated_at) : "Auto-generated"}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="mt-1 font-semibold text-gray-900">{selectedApplication.location}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="mt-1 font-semibold text-gray-900">{selectedApplication.category}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Editable Gist</label>
                  <textarea
                    value={gistContent}
                    onChange={(event) => setGistContent(event.target.value)}
                    rows={16}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Gist</p>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => void handleAiRegenerate()} disabled={isAiGenerating || isSaving || isMomGenerating} className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-60">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        {isAiGenerating ? "Generating..." : "Regenerate Gist with AI"}
                      </button>
                      <button type="button" onClick={handleSaveGist} disabled={isSaving || isAiGenerating || isMomGenerating || !gistContent.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-60">
                        <Edit3 className="w-4 h-4 inline mr-2" />
                        Save Gist
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">MoM Document</p>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => void handleAiGenerateMom()} disabled={isMomGenerating || isSaving || isAiGenerating} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-60">
                        <FileText className="w-4 h-4 inline mr-2" />
                        {isMomGenerating ? "Generating MoM..." : momDoc ? "Re-generate MoM with AI" : "Generate Full MoM with AI"}
                      </button>
                      {!momDoc && (
                        <button type="button" onClick={handleConvertToDraft} disabled={isSaving || isMomGenerating} className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-60">
                          <FileCheck className="w-4 h-4 inline mr-2" />
                          Convert Gist to Draft
                        </button>
                      )}
                    </div>
                    {momDoc && !momDoc.is_locked && (
                      <p className="mt-2 text-xs text-indigo-600">▼ MoM draft is ready below — edit, review, and finalize it.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 px-4 py-8 text-sm text-gray-500">Select a referred application to review and finalize its meeting gist.</div>
            )}
          </div>
        </div>

        {/* ═══ AI Generated MoM Draft Panel ═══ */}
        {selectedApplication && momDoc ? (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-100 overflow-hidden mb-8">
            {/* Header */}
            <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">AI Generated MoM Draft</h2>
                  <p className="text-xs text-gray-500 mt-0.5">#{selectedApplication.id} — {selectedApplication.project_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {momDoc.is_locked ? (
                  <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-xs font-medium">
                    <Lock className="w-3 h-3" />Finalized &amp; Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-medium">
                    <Edit3 className="w-3 h-3" />Draft — Editable
                  </span>
                )}
                {!momDoc.is_locked && (
                  <button type="button" onClick={() => setIsMomEditMode((v) => !v)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                    {isMomEditMode ? "Close Editor" : "Edit Draft"}
                  </button>
                )}
                <button type="button" onClick={() => navigate(`/mom/${selectedApplicationId}/view`)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
                  <Eye className="w-3.5 h-3.5 inline mr-1" />View Full Document
                </button>
              </div>
            </div>

            {/* Edit Mode */}
            {!momDoc.is_locked && isMomEditMode ? (
              <div className="p-6 space-y-6">
                {/* Meeting Metadata */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Meeting Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {([["agenda_id","Agenda ID"],["meeting_mode","Meeting Mode"],["date_time","Date & Time"]] as [keyof MomEdits, string][]).map(([k, lbl]) => (
                      <div key={k}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
                        <input type="text" value={momEdits[k]}
                          onChange={(e) => setMomEdits((v) => ({ ...v, [k]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meeting Venue</label>
                    <input type="text" value={momEdits.meeting_venue}
                      onChange={(e) => setMomEdits((v) => ({ ...v, meeting_venue: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                  </div>
                </div>

                {/* Narrative Sections */}
                {([
                  ["opening_remarks","1. Opening Remarks & Committee Members Present",5],
                  ["committee_discussion","3.1.1 Details of the Proposal and Committee Discussion",5],
                  ["project_description","Project Description Overview",4],
                  ["salient_features","3.1.2 Project Salient Features",5],
                ] as [keyof MomEdits, string, number][]).map(([k, lbl, rows]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
                    <textarea value={momEdits[k]} rows={rows}
                      onChange={(e) => setMomEdits((v) => ({ ...v, [k]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 resize-y" />
                  </div>
                ))}

                {/* Proposal Details */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Proposal Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {([["proposal_no","Proposal No"],["file_no","File No"],["submission_date","Submission Date"]] as [keyof MomEdits, string][]).map(([k, lbl]) => (
                      <div key={k}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
                        <input type="text" value={momEdits[k]}
                          onChange={(e) => setMomEdits((v) => ({ ...v, [k]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Activity / Sub-Activity (Schedule Item)</label>
                    <input type="text" value={momEdits.activity_sub_activity}
                      onChange={(e) => setMomEdits((v) => ({ ...v, activity_sub_activity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Project Location</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {([["village","Village"],["district_taluka","District / Taluka"],["state_code","State / State-Code"]] as [keyof MomEdits, string][]).map(([k, lbl]) => (
                      <div key={k}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
                        <input type="text" value={momEdits[k]}
                          onChange={(e) => setMomEdits((v) => ({ ...v, [k]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => void handleSaveMomContent()} disabled={isMomSaving || isSaving}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium text-sm transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4 inline mr-2" />{isMomSaving ? "Saving..." : "Save Draft"}
                  </button>
                  <button type="button" onClick={() => void handleFinalize()} disabled={isSaving || isMomSaving}
                    className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium text-sm transition-colors disabled:opacity-60">
                    <Lock className="w-4 h-4 inline mr-2" />{isSaving ? "Finalizing..." : "Save & Finalize"}
                  </button>
                </div>
              </div>
            ) : (
              /* View/Preview mode */
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {momEdits.opening_remarks && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Opening Remarks</p>
                      <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">{momEdits.opening_remarks}</p>
                    </div>
                  )}
                  {momEdits.committee_discussion && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Committee Discussion</p>
                      <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">{momEdits.committee_discussion}</p>
                    </div>
                  )}
                  {momEdits.salient_features && (
                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Salient Features</p>
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{momEdits.salient_features}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {!momDoc.is_locked && (
                    <button type="button" onClick={() => void handleFinalize()} disabled={isSaving || isMomSaving}
                      className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium text-sm transition-colors disabled:opacity-60">
                      <Lock className="w-4 h-4 inline mr-2" />{isSaving ? "Finalizing..." : "Finalize & Lock"}
                    </button>
                  )}
                  <button type="button" onClick={() => navigate(`/mom/${selectedApplicationId}/view`)}
                    className="px-5 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 font-medium text-sm transition-colors">
                    <Eye className="w-4 h-4 inline mr-2" />View Full Document
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Finalized Applications</h2>
            <p className="text-sm text-gray-500 mt-1">Official PDF and DOCX exports become available only after finalization</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Application</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Exports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {finalizedApplications.length ? (
                  finalizedApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">#{application.id} • {application.project_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{application.sector}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(application.updated_at)}</td>
                      <td className="px-6 py-4"><StatusBadge status={application.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button type="button" onClick={() => navigate(`/mom/${application.id}/view`)} className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                            <Eye className="w-4 h-4 inline mr-1" />
                            View
                          </button>
                          <button type="button" onClick={() => void handleExport(application.id, "pdf")} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                            <Printer className="w-4 h-4 inline mr-2" />
                            PDF
                          </button>
                          <button type="button" onClick={() => void handleExport(application.id, "docx")} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            <Download className="w-4 h-4 inline mr-2" />
                            DOCX
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-sm text-gray-500">No finalized applications yet.</td>
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