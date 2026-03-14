interface StatusBadgeProps {
  status: string;
}

const toStatusKey = (status: string) =>
  String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
  submitted: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
  scrutiny: { bg: "bg-amber-100", text: "text-amber-700", label: "Under Scrutiny" },
  under_scrutiny: { bg: "bg-amber-100", text: "text-amber-700", label: "Under Scrutiny" },
  eds: { bg: "bg-red-100", text: "text-red-700", label: "EDS Requested" },
  essential_doc_sought: { bg: "bg-red-100", text: "text-red-700", label: "EDS Requested" },
  referred: { bg: "bg-purple-100", text: "text-purple-700", label: "Referred for Meeting" },
  mom: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Under MoM Review" },
  mom_generated: { bg: "bg-cyan-100", text: "text-cyan-700", label: "MoM Generated" },
  finalized: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Decision Finalized" },
  paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
  success: { bg: "bg-green-100", text: "text-green-700", label: "Success" },
  failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
  approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[toStatusKey(status)] || statusConfig.draft;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}