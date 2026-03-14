import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { workflowApi, type MomDocumentData } from "../services/workflowApi";
import { ArrowLeft, Printer, FileText, Lock, Clock } from "lucide-react";

interface MomContent {
  agenda_id: string;
  meeting_venue: string;
  meeting_mode: string;
  date_time: string;
  opening_remarks: string;
  committee_discussion: string;
  project_description: string;
  proposal_for: string;
  proposal_no: string;
  file_no: string;
  submission_date: string;
  activity_sub_activity: string;
  salient_features: string;
  village: string;
  district_taluka: string;
  state_code: string;
}

function parseMomContent(raw: string): MomContent | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as MomContent;
  } catch {
    // try to extract JSON from within the string
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        const parsed = JSON.parse(raw.slice(start, end + 1));
        if (parsed && typeof parsed === "object") return parsed as MomContent;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function MoMViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<MomDocumentData | null>(null);
  const [content, setContent] = useState<MomContent | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const appId = Number(id);
    if (!appId) {
      setError("Invalid application ID.");
      setIsLoading(false);
      return;
    }
    workflowApi
      .getMomDocument(appId)
      .then((data) => {
        setDoc(data);
        setContent(parseMomContent(data.content));
      })
      .catch((err: { response?: { data?: { message?: string } } }) => {
        setError(err?.response?.data?.message || "Failed to load MoM document.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 text-sm">Loading MoM Document...</div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
          <FileText className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">MoM Not Available</h2>
          <p className="text-gray-500 text-sm mb-6">{error || "Document not found."}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const momId = doc.mom_id || `MOM/EAC/${doc.application_id}/${new Date().getFullYear()}`;
  const c = content;

  return (
    <div className="min-h-screen bg-gray-200">
      {/* ── Action bar (hidden on print) ── */}
      <div className="no-print sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {doc.is_locked ? (
              <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5" />
                Finalized &amp; Locked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                Draft — Pending Finalization
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* ── Document ── */}
      <div className="py-8 px-4 print:p-0 print:py-0">
        <div
          id="mom-document"
          className="max-w-[860px] mx-auto bg-white shadow-xl print:shadow-none font-sans text-[14px]"
        >
          {/* ═══════════ HEADER ═══════════ */}
          <div className="relative px-8 pt-6 pb-5 border-b-2 border-gray-800">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="opacity-[0.04] flex flex-col items-center">
                <div
                  className="w-80 h-80 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "conic-gradient(#4caf50 0% 25%, #2196f3 25% 50%, #ff9800 50% 75%, #f44336 75% 100%)",
                  }}
                >
                  <div className="w-60 h-60 rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl font-black text-gray-800 tracking-wide">PARIVESH</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-4">
              {/* GoI Emblem */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-amber-700 bg-amber-50 select-none">
                <div className="text-3xl leading-none">🏛️</div>
                <div className="text-[7px] font-bold text-amber-800 text-center mt-1 leading-tight">
                  सत्यमेव
                  <br />
                  जयते
                </div>
              </div>

              {/* Title block */}
              <div className="flex-1 text-center">
                <p className="font-bold text-gray-900 text-[15px] leading-snug">Government of India</p>
                <p className="font-semibold text-gray-800 text-[13px] mt-0.5">
                  Ministry of Environment, Forest and Climate Change
                </p>
                <p className="text-gray-700 text-[13px]">IA Division</p>
                <p className="text-gray-700 text-[13px]">(Non-Coal Mining)</p>
                <p className="font-bold text-gray-800 text-[13px] mt-1 tracking-widest">* * *</p>
              </div>

              {/* Parivesh Logo */}
              <div className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-green-600 bg-white overflow-hidden flex items-center justify-center select-none">
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#81c784 0% 12.5%, #4fc3f7 12.5% 25%, #fff176 25% 37.5%, #ffb74d 37.5% 50%, #e57373 50% 62.5%, #ba68c8 62.5% 75%, #4db6ac 75% 87.5%, #aed581 87.5% 100%)",
                  }}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
                    >
                      <span className="text-green-700 font-black text-[8px] leading-none">PARI</span>
                      <span className="text-green-600 font-bold text-[6px] leading-none">VESH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ METADATA FIELDS ═══════════ */}
          <div className="px-8 py-5 border-b border-gray-300">
            {[
              { label: "MoM ID", value: momId },
              { label: "Agenda ID", value: c?.agenda_id ?? "" },
              { label: "Meeting Venue", value: c?.meeting_venue ?? "" },
              { label: "Meeting Mode", value: c?.meeting_mode ?? "" },
              { label: "Date & Time", value: c?.date_time ?? "" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-36 font-semibold text-gray-800 text-[13px] flex-shrink-0 pt-1">{label}</div>
                <div className="text-gray-600 pt-1">:</div>
                <div className="flex-1 border border-gray-400 px-3 py-1.5 text-[13px] text-gray-800 min-h-[30px] bg-gray-50/60">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════ MEETING DETAILS ═══════════ */}
          <div className="px-8 py-5 border-b border-gray-300">
            <h2 className="font-bold text-gray-900 text-[14px] underline mb-4">
              Meeting Details &amp; Proposal Overview
            </h2>

            {/* Box 1 */}
            <div className="border border-gray-500 mb-4">
              <div className="border-b border-gray-400 px-3 py-2 bg-gray-100 text-[13px] font-semibold text-gray-700">
                1. Opening Remarks and Committee Members Present
              </div>
              <div className="px-4 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[100px] whitespace-pre-wrap">
                {c?.opening_remarks ?? ""}
              </div>
            </div>

            {/* Box 2 */}
            <div className="border border-gray-500">
              <div className="border-b border-gray-400 px-3 py-2 bg-gray-100 text-[13px] font-semibold text-gray-700">
                3.1.1 Details of the Proposal and Committee Discussion
              </div>
              <div className="px-4 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[100px] whitespace-pre-wrap">
                {c?.committee_discussion ?? ""}
              </div>
            </div>
          </div>

          {/* ═══════════ PROJECT DESCRIPTION & PROPOSAL TABLE ═══════════ */}
          <div className="px-8 py-5 border-b border-gray-300">
            <div className="border border-gray-500">
              {/* Description header */}
              <div className="border-b border-gray-400 px-3 py-2 bg-gray-100">
                <span className="font-bold text-gray-800 text-[13px]">Project Description Overview</span>
              </div>
              {/* Description body */}
              <div className="px-4 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[80px] whitespace-pre-wrap border-b border-gray-300">
                {c?.project_description ?? doc.project_name}
              </div>
              {/* Proposal For */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-400 text-[13px]">
                <span className="font-semibold text-gray-800">Proposal For: </span>
                <span className="text-gray-700">{c?.proposal_for ?? doc.proponent_name}</span>
              </div>
              {/* Proposal table */}
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-400">
                    <th className="border-r border-gray-400 px-3 py-2 text-left font-bold text-gray-700 w-1/4">
                      Proposal No:
                    </th>
                    <th className="border-r border-gray-400 px-3 py-2 text-left font-bold text-gray-700 w-1/4">
                      File No:
                    </th>
                    <th className="border-r border-gray-400 px-3 py-2 text-left font-bold text-gray-700 w-1/4">
                      Submission Date
                    </th>
                    <th className="px-3 py-2 text-left font-bold text-gray-700 w-1/4">
                      Activity Sub-Activity
                      <br />
                      (Schedule Item)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-r border-gray-300 px-3 py-3 text-gray-800 align-top">
                      {c?.proposal_no ?? ""}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-3 text-gray-800 align-top">
                      {c?.file_no ?? ""}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-3 text-gray-800 align-top">
                      {c?.submission_date ?? ""}
                    </td>
                    <td className="px-3 py-3 text-gray-800 align-top">{c?.activity_sub_activity ?? ""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ═══════════ SALIENT FEATURES ═══════════ */}
          <div className="px-8 py-5 border-b border-gray-300">
            <h3 className="font-bold text-gray-900 text-[13px] underline mb-3">
              3.1.2. Project Salient Features
            </h3>
            <div className="border border-gray-500 min-h-[100px]">
              <div className="px-4 py-3 text-[13px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                {c?.salient_features ?? ""}
              </div>
            </div>
          </div>

          {/* ═══════════ PROJECT DETAILS TABLE ═══════════ */}
          <div className="px-8 py-5">
            <p className="text-[13px] text-gray-800 mb-2">
              <strong>2.</strong>&nbsp; The details of the project submitted by the Project Proponent are given
              under:
            </p>
            <p className="text-[13px] text-gray-800 mb-4 ml-5">
              <strong>i.</strong>&nbsp; Project details:
            </p>

            <table className="w-full border border-gray-500 text-[13px] border-collapse">
              <tbody>
                {/* Name of the Proposal */}
                <tr>
                  <td className="border border-gray-400 px-3 py-3 font-bold text-gray-800 bg-gray-50 w-1/3" colSpan={2}>
                    Name of the Proposal:
                  </td>
                  <td className="border border-gray-400 px-3 py-3 text-gray-800" colSpan={2}>
                    {doc.project_name}
                  </td>
                </tr>
                {/* Location header row */}
                <tr>
                  <td
                    className="border border-gray-400 px-3 py-2 font-semibold text-gray-800 bg-gray-50 align-top"
                    rowSpan={4}
                  >
                    Location
                  </td>
                  <td
                    className="border border-gray-400 px-3 py-2 font-bold text-gray-700 bg-gray-50"
                    colSpan={3}
                  >
                    Location
                  </td>
                </tr>
                {/* Village */}
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700 w-40">Village:</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800" colSpan={2}>
                    {c?.village ?? ""}
                  </td>
                </tr>
                {/* District/Taluka */}
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">District / Taluka:</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800" colSpan={2}>
                    {c?.district_taluka ?? ""}
                  </td>
                </tr>
                {/* State/Code */}
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">State / State-Code:</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800" colSpan={2}>
                    {c?.state_code ?? ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════ DOCUMENT FOOTER ═══════════ */}
          <div className="border-t-2 border-gray-800 px-8 py-4 flex items-center justify-between text-[11px] text-gray-500 no-print">
            <span>
              Document Reference: {momId} &nbsp;|&nbsp; Application #{doc.application_id}
            </span>
            <span>
              {doc.is_locked && doc.finalized_at
                ? `Finalized on ${new Date(doc.finalized_at).toLocaleDateString("en-IN", { dateStyle: "long" })}${doc.finalized_by_name ? ` by ${doc.finalized_by_name}` : ""}`
                : "Status: Draft — Pending Finalization"}
            </span>
          </div>

          {/* Footer shown on print */}
          <div className="hidden print:block border-t border-gray-400 px-8 py-3 text-center text-[10px] text-gray-500">
            Generated via Parivesh Portal &nbsp;|&nbsp; Ministry of Environment, Forest and Climate Change, Government of India
            &nbsp;|&nbsp; {momId}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; }
          #mom-document { max-width: 100% !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
