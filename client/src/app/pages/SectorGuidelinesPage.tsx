import { useState } from "react";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { ArrowRight, FileText, Download, Search, Mountain, Building2, Wind, Factory, Droplets, Waves } from "lucide-react";

const sectors = [
  {
    id: "mining",
    name: "Mining",
    icon: Mountain,
    color: "from-amber-500 to-orange-600",
    bgColor: "from-amber-50 to-orange-50",
    description: "Coal, minerals, and quarrying projects",
    guidelines: [
      "Environmental Impact Assessment Guidelines for Mining",
      "Forest Clearance Requirements",
      "Rehabilitation and Reclamation Plans",
      "Water Management and Pollution Control"
    ],
    documents: [
      "Mining Plan",
      "Environmental Management Plan",
      "Baseline Environmental Data",
      "Public Consultation Report",
      "Rehabilitation Plan"
    ],
    formLink: "/application/new?sector=mining"
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: Building2,
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50",
    description: "Roads, buildings, and urban development",
    guidelines: [
      "Building & Construction Project Guidelines",
      "Traffic Impact Assessment",
      "Air Quality Management",
      "Construction Waste Management"
    ],
    documents: [
      "Project Proposal",
      "Site Plan and Layout",
      "Traffic Impact Assessment",
      "Environmental Management Plan",
      "Consent from Local Authorities"
    ],
    formLink: "/application/new?sector=infrastructure"
  },
  {
    id: "renewable",
    name: "Renewable Energy",
    icon: Wind,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
    description: "Solar, wind, and hydroelectric projects",
    guidelines: [
      "Solar Power Project Guidelines",
      "Wind Farm Assessment Requirements",
      "Grid Connectivity Clearances",
      "Land Use Change Permissions"
    ],
    documents: [
      "Detailed Project Report",
      "Land Ownership Documents",
      "Technical Specifications",
      "Environmental Assessment",
      "Power Purchase Agreement"
    ],
    formLink: "/application/new?sector=renewable"
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-50",
    description: "Industrial plants and factories",
    guidelines: [
      "Industrial Project EIA Guidelines",
      "Emission Control Standards",
      "Effluent Treatment Requirements",
      "Hazardous Waste Management"
    ],
    documents: [
      "Detailed Project Report",
      "Process Flow Diagram",
      "Pollution Control Measures",
      "Waste Management Plan",
      "Consent to Establish"
    ],
    formLink: "/application/new?sector=manufacturing"
  },
  {
    id: "water",
    name: "Water & Irrigation",
    icon: Droplets,
    color: "from-cyan-500 to-blue-600",
    bgColor: "from-cyan-50 to-blue-50",
    description: "Dams, canals, and water supply projects",
    guidelines: [
      "Dam and Reservoir Guidelines",
      "Downstream Impact Assessment",
      "Rehabilitation & Resettlement",
      "Catchment Area Treatment"
    ],
    documents: [
      "Hydrological Study Report",
      "Dam Safety Report",
      "Resettlement Action Plan",
      "Environmental Flows Assessment",
      "Disaster Management Plan"
    ],
    formLink: "/application/new?sector=water"
  },
  {
    id: "coastal",
    name: "Coastal Regulation Zone",
    icon: Waves,
    color: "from-indigo-500 to-purple-600",
    bgColor: "from-indigo-50 to-purple-50",
    description: "Projects in coastal areas",
    guidelines: [
      "CRZ Notification Compliance",
      "Coastal Zone Management Plan",
      "Marine Ecology Assessment",
      "Fisheries Impact Study"
    ],
    documents: [
      "CRZ Clearance Application",
      "Coastal Zone Map",
      "Marine Biodiversity Assessment",
      "Fisherfolk Livelihood Study",
      "Disaster Preparedness Plan"
    ],
    formLink: "/application/new?sector=coastal"
  }
];

export function SectorGuidelinesPage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSectors = sectors.filter(sector =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSectorData = sectors.find(s => s.id === selectedSector);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <GovHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sector-Specific Guidelines</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find relevant guidelines, required documents, and application forms for your project sector
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sectors..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Sector Grid */}
        {!selectedSector && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSectors.map((sector) => {
              const Icon = sector.icon;

              return (
                <div
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`bg-gradient-to-br ${sector.bgColor} rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden`}
                >
                  <div className="p-6">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${sector.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{sector.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-bold text-gray-900">{sector.guidelines.length}</span> Guidelines
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">{sector.documents.length}</span> Documents
                      </div>
                    </div>

                    {/* Button */}
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 group-hover:border-blue-500 group-hover:text-blue-600 transition-all">
                      View Details
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sector Detail View */}
        {selectedSector && selectedSectorData && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedSector(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to All Sectors
            </button>

            {/* Sector Header */}
            <div className={`bg-gradient-to-br ${selectedSectorData.bgColor} rounded-2xl border-2 border-white shadow-lg p-8`}>
              <div className="flex items-center gap-6">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${selectedSectorData.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <selectedSectorData.icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedSectorData.name}</h2>
                  <p className="text-gray-600">{selectedSectorData.description}</p>
                </div>
                <a
                  href={selectedSectorData.formLink}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Start Application
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sector Guidelines</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSectorData.guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{guideline}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-green-900">
                  <strong>💡 Tip:</strong> Download all guidelines before starting your application to ensure compliance.
                </p>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Required Documents</h3>
              </div>

              <div className="space-y-3">
                {selectedSectorData.documents.map((document, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-gray-900 flex-1">{document}</p>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        Required
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-sm text-amber-900">
                  <strong>⚠️ Important:</strong> All documents must be digitally signed and uploaded in PDF format (Max 10MB per file).
                </p>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Typical Application Process
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    1
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Submit</p>
                  <p className="text-sm text-gray-600">Upload all documents</p>
                </div>

                <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Review</p>
                  <p className="text-sm text-gray-600">15-20 working days</p>
                </div>

                <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Committee</p>
                  <p className="text-sm text-gray-600">30-45 days</p>
                </div>

                <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    4
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Decision</p>
                  <p className="text-sm text-gray-600">60-90 days total</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Application?</h3>
              <p className="text-blue-100 mb-6">
                All guidelines reviewed? Begin your {selectedSectorData.name.toLowerCase()} project application now.
              </p>
              <a
                href={selectedSectorData.formLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all"
              >
                Start Application
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <GovFooter />
    </div>
  );
}