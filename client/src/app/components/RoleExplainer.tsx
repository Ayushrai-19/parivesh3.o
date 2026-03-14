import { User, Search, FileText, Settings, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: User,
    title: "Proponent",
    description: "Submits project applications and uploads documents.",
    responsibilities: [
      "Register and submit new applications",
      "Upload required environmental documents",
      "Respond to deficiency notices",
      "Track application status in real-time"
    ],
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    icon: Search,
    title: "Scrutiny Team",
    description: "Reviews applications and raises deficiencies if required.",
    responsibilities: [
      "Verify submitted documents and data",
      "Conduct technical evaluation",
      "Request additional information (EDS)",
      "Refer applications to committee"
    ],
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    icon: FileText,
    title: "MoM Team",
    description: "Prepares meeting gists and finalizes meeting minutes.",
    responsibilities: [
      "Prepare meeting agendas",
      "Generate meeting gists",
      "Record committee decisions",
      "Finalize and publish minutes"
    ],
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50"
  },
  {
    icon: Settings,
    title: "Admin",
    description: "Manages system workflows, users, and templates.",
    responsibilities: [
      "Create and manage user accounts",
      "Configure system templates",
      "Monitor application workflows",
      "Generate system reports"
    ],
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50"
  }
];

export function RoleExplainer() {
  return (
    null
  );
}