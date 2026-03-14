import { GovHeader } from "../components/GovHeader";
import { BookOpen, FileText, HelpCircle, Video, Download, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router";

export function ResourcesPage() {
  const { type } = useParams<{ type: string }>();

  const getContent = () => {
    switch (type) {
      case "policies":
        return {
          title: "Environmental Policies",
          icon: FileText,
          color: "from-blue-600 to-cyan-600",
          items: [
            {
              title: "National Environmental Policy 2006",
              description: "Comprehensive framework for environmental protection and sustainable development",
              date: "Updated: Jan 2026",
              link: "#"
            },
            {
              title: "EIA Notification 2026",
              description: "Latest environmental impact assessment procedures and requirements",
              date: "Released: Mar 2026",
              link: "#"
            },
            {
              title: "Forest Conservation Act 1980",
              description: "Legal framework for conservation and protection of forest areas",
              date: "Amended: 2025",
              link: "#"
            },
            {
              title: "Wildlife Protection Act 1972",
              description: "Comprehensive legislation for wildlife conservation in India",
              date: "Amended: 2024",
              link: "#"
            },
            {
              title: "Coastal Regulation Zone Notification 2019",
              description: "Guidelines for development activities in coastal areas",
              date: "Updated: Dec 2025",
              link: "#"
            },
          ]
        };

      case "user-manual":
        return {
          title: "User Manual",
          icon: BookOpen,
          color: "from-green-600 to-emerald-600",
          items: [
            {
              title: "Getting Started with PARIVESH",
              description: "Complete guide to create account and start your first application",
              date: "Version 3.0",
              link: "#"
            },
            {
              title: "Application Submission Guide",
              description: "Step-by-step instructions for submitting environmental clearance applications",
              date: "Last updated: Mar 2026",
              link: "#"
            },
            {
              title: "Document Upload Requirements",
              description: "Detailed specifications for document formats and upload procedures",
              date: "Version 2.5",
              link: "#"
            },
            {
              title: "Tracking & Monitoring Applications",
              description: "Learn how to track your application status and respond to queries",
              date: "Version 3.0",
              link: "#"
            },
            {
              title: "Dashboard Navigation Guide",
              description: "Comprehensive overview of dashboard features for all user roles",
              date: "Last updated: Feb 2026",
              link: "#"
            },
          ]
        };

      case "faqs":
        return {
          title: "Frequently Asked Questions",
          icon: HelpCircle,
          color: "from-purple-600 to-pink-600",
          items: [
            {
              title: "How do I register on PARIVESH?",
              description: "Click on 'Register' button, fill in your details, verify email, and complete KYC process to access the portal.",
              date: "General",
              link: "#"
            },
            {
              title: "What documents are required for environmental clearance?",
              description: "Typically includes project proposal, EIA report, public hearing minutes, ToR compliance documents, and NOCs from authorities.",
              date: "Documentation",
              link: "#"
            },
            {
              title: "How long does the clearance process take?",
              description: "Average processing time is 45-60 days for Category B projects and 105-120 days for Category A projects, depending on completeness.",
              date: "Timeline",
              link: "#"
            },
            {
              title: "Can I track my application status?",
              description: "Yes, use the 'Track Application' feature with your application ID to view real-time status and updates.",
              date: "Tracking",
              link: "#"
            },
            {
              title: "What if my application is rejected?",
              description: "You can resubmit after addressing the concerns mentioned in rejection note. Appeal process is also available within 30 days.",
              date: "Application Status",
              link: "#"
            },
          ]
        };

      case "training-videos":
        return {
          title: "Training Videos",
          icon: Video,
          color: "from-red-600 to-orange-600",
          items: [
            {
              title: "Introduction to PARIVESH 3.0",
              description: "Overview of the platform, features, and benefits (Duration: 12:45)",
              date: "Beginner",
              link: "#"
            },
            {
              title: "How to Submit Environmental Clearance Application",
              description: "Complete walkthrough of the application submission process (Duration: 18:30)",
              date: "Tutorial",
              link: "#"
            },
            {
              title: "Document Upload Best Practices",
              description: "Learn proper document formatting and upload procedures (Duration: 8:15)",
              date: "Tutorial",
              link: "#"
            },
            {
              title: "Understanding EIA Report Requirements",
              description: "Detailed guide on preparing Environmental Impact Assessment reports (Duration: 25:40)",
              date: "Advanced",
              link: "#"
            },
            {
              title: "Dashboard Features for Proponents",
              description: "Comprehensive tour of proponent dashboard capabilities (Duration: 15:20)",
              date: "Tutorial",
              link: "#"
            },
          ]
        };

      default:
        return {
          title: "Resources",
          icon: BookOpen,
          color: "from-blue-600 to-purple-600",
          items: []
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <GovHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${content.color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <p className="text-gray-600">Essential resources and documentation for PARIVESH portal</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {type === "training-videos" ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    <Video className="w-4 h-4" />
                    Watch Video
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all">
                  <ExternalLink className="w-4 h-4" />
                  View Online
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Resources */}
        <div className="mt-12 text-center">
          <Link
            to="/guidelines"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
          >
            Back to All Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
