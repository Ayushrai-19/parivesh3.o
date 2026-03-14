import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface BackToDashboardProps {
  role?: string;
  className?: string;
}

export function BackToDashboard({ role = "proponent", className = "" }: BackToDashboardProps) {
  return (
    <Link
      to={`/dashboard/${role}`}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-lg group ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
      <span>Back to Dashboard</span>
    </Link>
  );
}