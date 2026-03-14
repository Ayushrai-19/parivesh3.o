import { useState } from "react";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  BookOpen, 
  Shield, 
  Leaf, 
  Building2, 
  Waves, 
  Wind, 
  Factory, 
  Trees,
  Mountain,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Scale,
  Globe,
  Lightbulb,
  X,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react";

interface Guideline {
  id: string;
  category: string;
  title: string;
  icon: any;
  color: string;
  bgGradient: string;
  sections: {
    heading: string;
    content: string[];
  }[];
  documents?: {
    name: string;
    type: string;
    size: string;
  }[];
}

const guidelines: Guideline[] = [
  {
    id: "general",
    category: "General Guidelines",
    title: "General Environmental Clearance Guidelines",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    sections: [
      {
        heading: "Overview",
        content: [
          "Environmental Clearance (EC) is mandatory for specified activities/projects involving investments as per the Environment Impact Assessment (EIA) Notification, 2006 (as amended).",
          "PARIVESH 3.0 is a Single Window Integrated Platform for obtaining environmental clearances from Central, State and District level authorities.",
          "All applications must be submitted online through the PARIVESH portal with complete documentation."
        ]
      },
      {
        heading: "Application Process",
        content: [
          "Register on the PARIVESH portal with valid credentials",
          "Fill out the online application form with accurate project details",
          "Upload all required documents in prescribed formats (PDF, DOC, or JPEG)",
          "Pay the requisite processing fee online through the payment gateway",
          "Submit the application and note the unique Application ID for tracking",
          "Track your application status through the 'Track Application' feature"
        ]
      },
      {
        heading: "Timeline",
        content: [
          "Initial screening: 5-7 working days",
          "Document verification: 7-10 working days",
          "EIA report review: 30-45 days",
          "Public consultation (if required): 30 days",
          "Expert committee review: 60 days",
          "Final decision: 105-120 days from complete submission"
        ]
      }
    ],
    documents: [
      { name: "General Guidelines (English)", type: "PDF", size: "2.5 MB" },
      { name: "General Guidelines (Hindi)", type: "PDF", size: "2.7 MB" },
      { name: "Application Checklist", type: "PDF", size: "850 KB" }
    ]
  },
  {
    id: "industrial",
    category: "Industrial Projects",
    title: "Industrial & Manufacturing Projects",
    icon: Factory,
    color: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50 to-red-50",
    sections: [
      {
        heading: "Applicable Projects",
        content: [
          "Manufacturing units with production capacity above specified thresholds",
          "Chemical and pharmaceutical manufacturing facilities",
          "Metal and steel production plants",
          "Cement and construction material manufacturing",
          "Food processing and beverage production units",
          "Textile and garment manufacturing facilities"
        ]
      },
      {
        heading: "Required Documents",
        content: [
          "Detailed Project Report (DPR) with process flow diagrams",
          "Land documents and site layout plans",
          "Water requirement and source details",
          "Effluent Treatment Plant (ETP) design and specifications",
          "Air Pollution Control System details",
          "Hazardous waste management plan (if applicable)",
          "Corporate Environmental Responsibility (CER) plan"
        ]
      },
      {
        heading: "Key Requirements",
        content: [
          "Zero Liquid Discharge (ZLD) system for Category A projects",
          "Minimum 33% green cover in the project area",
          "Rainwater harvesting and groundwater recharge systems",
          "Renewable energy integration (minimum 10% of total power)",
          "Proper disposal mechanisms for solid and hazardous waste",
          "Emergency preparedness and disaster management plan"
        ]
      }
    ],
    documents: [
      { name: "Industrial Project Guidelines", type: "PDF", size: "3.2 MB" },
      { name: "ETP Design Standards", type: "PDF", size: "1.8 MB" },
      { name: "Emission Standards", type: "PDF", size: "1.2 MB" }
    ]
  },
  {
    id: "mining",
    category: "Mining Projects",
    title: "Mining & Quarrying Projects",
    icon: Mountain,
    color: "from-yellow-500 to-amber-600",
    bgGradient: "from-yellow-50 to-amber-50",
    sections: [
      {
        heading: "Scope",
        content: [
          "Coal mining projects (all sizes)",
          "Mineral mining projects above 5 hectares",
          "Sand mining and quarrying operations",
          "Stone crushing and processing units",
          "Off-shore and deep-sea mining projects"
        ]
      },
      {
        heading: "Environmental Safeguards",
        content: [
          "Mining plan approved by Indian Bureau of Mines (IBM)",
          "Progressive mine closure and reclamation plan",
          "Dust suppression measures during all operations",
          "Slope stability analysis for open cast mines",
          "Ground water monitoring and protection plan",
          "Biodiversity conservation plan for the mining area",
          "Relocation and rehabilitation plan for affected communities"
        ]
      },
      {
        heading: "Special Conditions",
        content: [
          "No mining within 1 km of protected areas (wildlife sanctuaries, national parks)",
          "Mandatory afforestation in double the area of land diverted",
          "Water body protection - no mining within 500m of water sources",
          "Regular environmental monitoring and compliance reporting",
          "Installation of High Volume Air Samplers (HVAS) for air quality monitoring",
          "Implementation of safety measures as per Mines Act, 1952"
        ]
      }
    ],
    documents: [
      { name: "Mining Guidelines", type: "PDF", size: "4.1 MB" },
      { name: "Mine Closure Plan Template", type: "PDF", size: "2.3 MB" },
      { name: "Reclamation Standards", type: "PDF", size: "1.9 MB" }
    ]
  },
  {
    id: "infrastructure",
    category: "Infrastructure",
    title: "Infrastructure & Construction Projects",
    icon: Building2,
    color: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
    sections: [
      {
        heading: "Covered Projects",
        content: [
          "Highway and expressway projects (>100 km)",
          "Railway projects and metro rail systems",
          "Airport construction and expansion",
          "Ports and harbors development",
          "Township and area development projects (>50 hectares)",
          "SEZ (Special Economic Zone) development"
        ]
      },
      {
        heading: "Assessment Requirements",
        content: [
          "Traffic impact assessment and mitigation measures",
          "Social Impact Assessment (SIA) for land acquisition",
          "Tree cutting proposal and compensatory afforestation",
          "Construction waste management plan",
          "Worker safety and accommodation facilities",
          "Cultural heritage impact assessment (if applicable)",
          "Biodiversity offset measures for habitat loss"
        ]
      },
      {
        heading: "Conditions for Approval",
        content: [
          "Minimum 30% green belt development",
          "Solid waste management as per SWM Rules, 2016",
          "Sewage treatment plant with tertiary treatment",
          "Green building certification (IGBC/LEED/GRIHA)",
          "Stormwater management and flood prevention systems",
          "Public transport connectivity and parking management",
          "Energy-efficient design with renewable energy integration"
        ]
      }
    ],
    documents: [
      { name: "Infrastructure Project Guidelines", type: "PDF", size: "3.8 MB" },
      { name: "Green Building Standards", type: "PDF", size: "2.1 MB" },
      { name: "Construction Waste Management", type: "PDF", size: "1.5 MB" }
    ]
  },
  {
    id: "renewable",
    category: "Renewable Energy",
    title: "Renewable Energy Projects",
    icon: Wind,
    color: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
    sections: [
      {
        heading: "Project Types",
        content: [
          "Solar power plants (ground-mounted and rooftop)",
          "Wind energy farms (onshore and offshore)",
          "Hydroelectric power projects (>25 MW)",
          "Biomass and biogas energy plants",
          "Tidal and wave energy projects",
          "Geothermal energy installations"
        ]
      },
      {
        heading: "Simplified Clearance Process",
        content: [
          "Fast-track clearance for solar and wind projects under national targets",
          "Exemption from public hearing for certain categories",
          "Reduced documentation requirements compared to conventional power",
          "Online monitoring and reporting system integration",
          "Expedited approval within 60 days for eligible projects"
        ]
      },
      {
        heading: "Environmental Considerations",
        content: [
          "Wildlife and bird migration impact assessment for wind projects",
          "Land use optimization and dual-use applications (agri-voltaics)",
          "Panel recycling and disposal plan for solar projects",
          "Downstream impact assessment for hydro projects",
          "Noise pollution mitigation for wind turbines",
          "Electromagnetic interference management",
          "Integration with local biodiversity conservation efforts"
        ]
      }
    ],
    documents: [
      { name: "Renewable Energy Guidelines", type: "PDF", size: "2.9 MB" },
      { name: "Solar Project Standards", type: "PDF", size: "1.7 MB" },
      { name: "Wind Farm Best Practices", type: "PDF", size: "2.2 MB" }
    ]
  },
  {
    id: "water",
    category: "Water Resources",
    title: "Water & Irrigation Projects",
    icon: Droplets,
    color: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
    sections: [
      {
        heading: "Applicable Projects",
        content: [
          "River valley and dam projects",
          "Irrigation canal systems",
          "Water supply and distribution networks",
          "Desalination plants",
          "Wastewater treatment facilities",
          "Flood control and drainage systems"
        ]
      },
      {
        heading: "Mandatory Studies",
        content: [
          "Hydrological and flood frequency analysis",
          "Downstream impact assessment",
          "Fisheries and aquatic biodiversity study",
          "Sediment transport and reservoir sedimentation analysis",
          "Earthquake and dam safety assessment",
          "Cumulative impact assessment for river basin",
          "Resettlement and rehabilitation plan for affected people"
        ]
      },
      {
        heading: "Key Safeguards",
        content: [
          "Environmental flow (e-flow) maintenance in rivers",
          "Fish ladder and aquatic passage design",
          "Catchment area treatment plan",
          "Command area development with water use efficiency measures",
          "Groundwater recharge and managed aquifer recharge systems",
          "Water quality monitoring program",
          "Disaster management and dam break analysis"
        ]
      }
    ],
    documents: [
      { name: "Water Projects Guidelines", type: "PDF", size: "3.5 MB" },
      { name: "Dam Safety Standards", type: "PDF", size: "2.8 MB" },
      { name: "EIA Guidelines for River Valley Projects", type: "PDF", size: "2.4 MB" }
    ]
  },
  {
    id: "forest",
    category: "Forest Clearance",
    title: "Forest & Wildlife Conservation",
    icon: Trees,
    color: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-50 to-green-50",
    sections: [
      {
        heading: "Forest (Conservation) Act, 1980",
        content: [
          "Prior approval required for diversion of forest land for non-forest purposes",
          "Applies to all forest lands including Reserved Forests, Protected Forests, and unclassed forests",
          "Compensatory afforestation mandatory - twice the area diverted",
          "Net Present Value (NPV) payment required for forest land diversion",
          "No-go areas: National Parks, Wildlife Sanctuaries (unless unavoidable with Supreme Court approval)"
        ]
      },
      {
        heading: "Wildlife Clearance",
        content: [
          "Wildlife (Protection) Act, 1972 clearance for projects in/around protected areas",
          "Impact assessment on endangered and threatened species",
          "Minimum 1 km eco-sensitive zone around protected areas",
          "Elephant corridors and migratory routes protection",
          "Camera trap surveys and biodiversity assessment",
          "Wildlife mitigation measures - underpasses, overpasses, fencing"
        ]
      },
      {
        heading: "Compliance Requirements",
        content: [
          "Afforestation in double the area of forest land diverted",
          "Payment of NPV as per latest rates notified by MoEF&CC",
          "Penal NPV for violations and unauthorized diversions",
          "Annual compliance reports to State Forest Department",
          "Maintenance of compensatory afforestation for minimum 7 years",
          "Local community involvement in afforestation activities"
        ]
      }
    ],
    documents: [
      { name: "Forest Clearance Guidelines", type: "PDF", size: "3.3 MB" },
      { name: "Wildlife Protection Guidelines", type: "PDF", size: "2.6 MB" },
      { name: "Compensatory Afforestation Handbook", type: "PDF", size: "2.1 MB" }
    ]
  },
  {
    id: "coastal",
    category: "Coastal Regulation",
    title: "Coastal Regulation Zone (CRZ)",
    icon: Waves,
    color: "from-sky-500 to-indigo-600",
    bgGradient: "from-sky-50 to-indigo-50",
    sections: [
      {
        heading: "CRZ Notification, 2019",
        content: [
          "CRZ applies to coastal areas up to 500m from High Tide Line (HTL)",
          "Four categories: CRZ-I (ecologically sensitive), CRZ-II (urban), CRZ-III (rural), CRZ-IV (water area)",
          "No-development zone (NDZ) varies by CRZ category and population density",
          "Special provisions for islands and ecologically sensitive areas"
        ]
      },
      {
        heading: "Prohibited Activities",
        content: [
          "Construction within NDZ except for specified activities",
          "Reclamation of coastal wetlands and water bodies",
          "Mining of sand, rocks, and other sub-strata materials",
          "Disposal of untreated waste and effluents",
          "Mangrove cutting or destruction",
          "Land reclamation in CRZ-I areas"
        ]
      },
      {
        heading: "Permitted Activities (with clearance)",
        content: [
          "Desalination plants and associated infrastructure",
          "Salt manufacturing from seawater",
          "Coastal defense structures and erosion control",
          "Weather radar and other strategic installations",
          "Eco-tourism facilities following green building norms",
          "Coastal disaster management infrastructure",
          "Renewable energy projects (wind, tidal, wave)"
        ]
      }
    ],
    documents: [
      { name: "CRZ Notification 2019", type: "PDF", size: "2.8 MB" },
      { name: "CRZ Clearance Guidelines", type: "PDF", size: "2.3 MB" },
      { name: "Coastal Zone Management Plan", type: "PDF", size: "3.1 MB" }
    ]
  }
];

export function GuidelinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["general"]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const toggleCategory = (id: string) => {
    if (expandedCategories.includes(id)) {
      setExpandedCategories(expandedCategories.filter(cat => cat !== id));
    } else {
      setExpandedCategories([...expandedCategories, id]);
    }
  };

  const handleDownloadAllGuidelines = () => {
    // Create a text file with all guidelines summary
    const content = `PARIVESH 3.0 - Environmental Clearance Guidelines
Ministry of Environment, Forest and Climate Change
Government of India

==========================================================
COMPREHENSIVE GUIDELINES DOCUMENT
==========================================================

${guidelines.map(guideline => `
${guideline.category.toUpperCase()}
${guideline.title}
${'='.repeat(60)}

${guideline.sections.map(section => `
${section.heading}
${'-'.repeat(section.heading.length)}
${section.content.map((item, i) => `${i + 1}. ${item}`).join('\n')}
`).join('\n')}

Documents:
${guideline.documents?.map(doc => `- ${doc.name} (${doc.type}, ${doc.size})`).join('\n') || 'No documents available'}

`).join('\n\n')}

==========================================================
For more information, visit: https://parivesh.gov.in
Contact: support@parivesh.gov.in | 1800-11-2345
==========================================================
`;

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PARIVESH_All_Guidelines.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocument = (docName: string, category: string) => {
    // Create document content based on the document name and category
    const content = `PARIVESH 3.0 - Environmental Clearance Portal
Ministry of Environment, Forest and Climate Change
Government of India

==========================================================
${docName}
==========================================================

Category: ${category}
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

DOCUMENT OVERVIEW
-----------------
This document provides detailed guidelines and requirements for environmental 
clearance applications under the ${category} category.

IMPORTANT INFORMATION
---------------------
• All applications must be submitted through the PARIVESH 3.0 portal
• Complete documentation is mandatory for processing
• Applications are processed as per the EIA Notification 2006 (as amended)
• Compliance with all environmental norms is required
• Regular monitoring and reporting is mandatory post-approval

KEY REQUIREMENTS
----------------
1. Project Proponent Details
   - Complete organization information
   - Authorized signatory details
   - Contact information and correspondence address

2. Project Details
   - Comprehensive project description
   - Technical specifications
   - Investment details
   - Timeline and implementation plan

3. Environmental Assessment
   - Baseline environmental data
   - Impact prediction and assessment
   - Mitigation measures
   - Environmental Management Plan
   - Monitoring program

4. Supporting Documents
   - Land ownership documents
   - NOC from relevant authorities
   - Corporate Environmental Responsibility plan
   - Public consultation details (if applicable)

COMPLIANCE CHECKLIST
--------------------
☑ Application form duly filled and signed
☑ Project report with technical details
☑ Environmental Impact Assessment report
☑ Site photographs and location maps
☑ Land documents and layout plans
☑ NOCs from concerned departments
☑ Payment of processing fee
☑ Digital signatures on all documents

TIMELINE
--------
• Application submission: Day 0
• Initial screening: 5-7 working days
• Document verification: 7-10 working days
• Detailed review: 30-45 days
• Expert committee evaluation: 60 days
• Final decision: 105-120 days (approximate)

CONTACT INFORMATION
-------------------
Helpdesk: 1800-11-2345 (Toll Free)
Email: support@parivesh.gov.in
Website: https://parivesh.gov.in

Office Hours: Monday to Friday, 9:00 AM - 6:00 PM

==========================================================
NOTE: This is a demo document. For official guidelines,
please visit the PARIVESH portal or contact the helpdesk.
==========================================================

© 2026 Ministry of Environment, Forest and Climate Change
Government of India - All Rights Reserved
`;

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docName.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleContactSupport = () => {
    setShowSupportModal(true);
  };

  const filteredGuidelines = guidelines.filter(
    guideline =>
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideline.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideline.sections.some(section =>
        section.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GovHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M30 15 L32 21 L38 21 L33 25 L35 31 L30 27 L25 31 L27 25 L22 21 L28 21 Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-6">
              <div className="w-20 h-1 bg-orange-500 rounded"></div>
              <div className="w-20 h-1 bg-white border border-gray-300 rounded"></div>
              <div className="w-20 h-1 bg-green-600 rounded"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-4 text-gray-900">
              Environmental Clearance Guidelines
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-orange-500 via-white to-green-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Comprehensive guidelines for obtaining environmental and forest clearances through PARIVESH 3.0
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mx-auto mb-3">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{guidelines.length}</div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-3">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600 mt-1">Documents</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-3">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600 mt-1">Compliance</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-auto mb-3">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Support</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guidelines, categories, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors shadow-lg text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Lightbulb, label: "Getting Started", color: "from-yellow-400 to-orange-500" },
              { icon: AlertTriangle, label: "Important Notices", color: "from-red-400 to-pink-500" },
              { icon: CheckCircle, label: "Compliance Checklist", color: "from-green-400 to-emerald-500" },
              { icon: Users, label: "Contact Support", color: "from-blue-400 to-cyan-500" }
            ].map((item, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guidelines Content */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {filteredGuidelines.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No guidelines found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGuidelines.map((guideline) => {
                const isExpanded = expandedCategories.includes(guideline.id);
                const IconComponent = guideline.icon;

                return (
                  <div
                    key={guideline.id}
                    className={`bg-white rounded-2xl border-2 ${
                      isExpanded ? 'border-green-500 shadow-xl' : 'border-gray-200 shadow-md'
                    } overflow-hidden transition-all`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleCategory(guideline.id)}
                      className={`w-full p-6 flex items-center justify-between bg-gradient-to-r ${guideline.bgGradient} hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${guideline.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            {guideline.category}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{guideline.title}</h3>
                        </div>
                      </div>
                      <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-6 h-6 text-gray-600" />
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-8 bg-white">
                        {/* Sections */}
                        <div className="space-y-8 mb-8">
                          {guideline.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                  <ChevronRight className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">{section.heading}</h4>
                              </div>
                              <ul className="space-y-3 ml-11">
                                {section.content.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                                    <div className="mt-1.5 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-sm leading-relaxed">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Documents */}
                        {guideline.documents && guideline.documents.length > 0 && (
                          <div className="border-t-2 border-gray-100 pt-8">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Download className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Download Documents</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {guideline.documents.map((doc, docIndex) => (
                                <button
                                  key={docIndex}
                                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group text-left"
                                  onClick={() => handleDownloadDocument(doc.name, guideline.category)}
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 text-sm truncate">{doc.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {doc.type} • {doc.size}
                                    </div>
                                  </div>
                                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl border-2 border-orange-500 p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>All guidelines are subject to amendments. Please check the portal regularly for updates.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Applicants must comply with the latest notifications issued by MoEF&CC and State EPCBs.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>For project-specific queries, please contact the helpdesk or use the chatbot support.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Submission of false information may lead to rejection of application and legal action.</span>
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all" onClick={handleContactSupport}>
                    <Users className="w-5 h-5" />
                    Contact Support
                  </button>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all" onClick={handleDownloadAllGuidelines}>
                    <Download className="w-5 h-5" />
                    Download All Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-lg text-gray-600">Our support team is here to assist you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Office Hours",
                desc: "Monday - Friday: 9:00 AM - 6:00 PM",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: Users,
                title: "Helpdesk",
                desc: "Call: 1800-11-2345 (Toll Free)",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: FileText,
                title: "Email Support",
                desc: "support@parivesh.gov.in",
                gradient: "from-purple-500 to-pink-600"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <GovFooter />

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowSupportModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gray-500" />
                <p className="text-gray-700">Call: 1800-11-2345 (Toll Free)</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="text-gray-700">Email: support@parivesh.gov.in</p>
              </div>
              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-gray-500" />
                <p className="text-gray-700">Chat with us</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}