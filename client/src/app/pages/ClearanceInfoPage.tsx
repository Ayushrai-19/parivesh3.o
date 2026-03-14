import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import {
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Building2,
  GitBranch,
  ClipboardList,
  Calendar,
  FileCheck,
  Bell,
  Users,
  ArrowRight,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

type ClearanceType = "environment" | "forest" | "wildlife" | "crz";

interface ClearanceData {
  title: string;
  shortName: string;
  color: string;
  gradient: string;
  icon: string;
  overview: {
    description: string;
    keyPoints: string[];
    applicability: string;
    legalBasis: string;
  };
  authority: {
    central: string[];
    state: string[];
    expert: string[];
  };
  processFlow: {
    steps: Array<{
      number: number;
      title: string;
      description: string;
      duration: string;
      icon: any;
    }>;
  };
  forms: Array<{
    name: string;
    description: string;
    downloadUrl: string;
  }>;
  agenda: Array<{
    date: string;
    title: string;
    venue: string;
  }>;
  mom: Array<{
    date: string;
    meetingNumber: string;
    summary: string;
    downloadUrl: string;
  }>;
  notifications: Array<{
    date: string;
    title: string;
    type: string;
    downloadUrl: string;
  }>;
  relatedAuthorities: Array<{
    name: string;
    role: string;
    website: string;
  }>;
}

const clearanceData: Record<ClearanceType, ClearanceData> = {
  environment: {
    title: "Environmental Clearance (EC)",
    shortName: "EC",
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
    icon: "🌍",
    overview: {
      description:
        "Environmental Clearance (EC) is a mandatory approval required for new projects or expansion of existing projects as per the Environment Impact Assessment (EIA) Notification, 2006. The clearance ensures that development projects are environmentally sustainable and follow prescribed environmental norms.",
      keyPoints: [
        "Mandatory for projects listed under EIA Notification 2006",
        "Categorized as Category A (Central) and Category B (State/UT)",
        "Requires Environmental Impact Assessment (EIA) Report",
        "Public Consultation is mandatory for Category A & B1 projects",
        "Valid for a specified period with conditions for implementation",
      ],
      applicability:
        "All new projects and expansion/modernization of existing projects involving construction, operation or any activity that may have potential environmental impacts as listed in the Schedule of EIA Notification, 2006.",
      legalBasis:
        "Environment (Protection) Act, 1986 and EIA Notification, 2006 (as amended)",
    },
    authority: {
      central: [
        "Ministry of Environment, Forest and Climate Change (MoEFCC)",
        "Expert Appraisal Committee (EAC) - for Category A projects",
        "Impact Assessment Division, MoEFCC",
      ],
      state: [
        "State Environment Impact Assessment Authority (SEIAA)",
        "State Expert Appraisal Committee (SEAC) - for Category B projects",
        "State Pollution Control Board (SPCB)",
      ],
      expert: [
        "EAC (Industry, Infrastructure, River Valley, Mining, Thermal, etc.)",
        "SEAC constituted by respective State/UT Governments",
      ],
    },
    processFlow: {
      steps: [
        {
          number: 1,
          title: "Screening",
          description:
            "Project proponent submits Form 1 and pre-feasibility report. Authority determines whether EIA is required (for Category B projects).",
          duration: "15-30 days",
          icon: FileText,
        },
        {
          number: 2,
          title: "Scoping",
          description:
            "Terms of Reference (ToR) are defined for preparing detailed EIA report. TOR specifies the environmental concerns to be addressed.",
          duration: "60 days",
          icon: ClipboardList,
        },
        {
          number: 3,
          title: "Public Consultation",
          description:
            "Public hearing conducted to gather concerns from affected communities. Environmental groups and local people participate.",
          duration: "45 days",
          icon: Users,
        },
        {
          number: 4,
          title: "EIA Report Preparation",
          description:
            "Detailed EIA study conducted covering environmental baseline, impact prediction, mitigation measures, and EMP.",
          duration: "6-12 months",
          icon: FileCheck,
        },
        {
          number: 5,
          title: "Appraisal",
          description:
            "EAC/SEAC examines the EIA report, public consultation proceedings, and project details. Site visit may be conducted.",
          duration: "60-90 days",
          icon: GitBranch,
        },
        {
          number: 6,
          title: "Decision",
          description:
            "MoEFCC/SEIAA grants Environmental Clearance with specific conditions or rejects based on EAC/SEAC recommendations.",
          duration: "30 days",
          icon: CheckCircle,
        },
      ],
    },
    forms: [
      {
        name: "Form 1 - Application for Environmental Clearance",
        description:
          "Basic project information form for initiating EC application",
        downloadUrl: "#",
      },
      {
        name: "Form 1A - Application for EC for Expansion/Modernization",
        description: "Form for existing projects seeking expansion clearance",
        downloadUrl: "#",
      },
      {
        name: "ToR Application Template",
        description: "Template for applying for Terms of Reference",
        downloadUrl: "#",
      },
      {
        name: "EIA Report Format",
        description: "Standard format and guidelines for EIA report preparation",
        downloadUrl: "#",
      },
      {
        name: "Environment Management Plan (EMP) Template",
        description: "Template for preparing Environmental Management Plan",
        downloadUrl: "#",
      },
    ],
    agenda: [
      {
        date: "March 20, 2026",
        title: "154th EAC (Infrastructure) Meeting",
        venue: "Paryavaran Bhawan, New Delhi",
      },
      {
        date: "March 18, 2026",
        title: "89th EAC (Industry) Meeting",
        venue: "MoEFCC Conference Hall",
      },
      {
        date: "March 15, 2026",
        title: "45th EAC (Mining) Meeting",
        venue: "Indira Paryavaran Bhawan",
      },
    ],
    mom: [
      {
        date: "February 25, 2026",
        meetingNumber: "153rd EAC (Infrastructure)",
        summary:
          "Considered 28 projects including highway, port, and airport developments. Recommended EC for 18 projects with conditions.",
        downloadUrl: "#",
      },
      {
        date: "February 20, 2026",
        meetingNumber: "88th EAC (Industry)",
        summary:
          "Reviewed 35 industrial projects. Granted ToR for 12 projects and EC for 20 projects.",
        downloadUrl: "#",
      },
      {
        date: "February 15, 2026",
        meetingNumber: "44th EAC (Mining)",
        summary:
          "Evaluated 22 mining projects. Recommended clearance for 15 projects subject to compliance.",
        downloadUrl: "#",
      },
    ],
    notifications: [
      {
        date: "March 1, 2026",
        title: "Amendment to EIA Notification 2006",
        type: "Notification",
        downloadUrl: "#",
      },
      {
        date: "February 15, 2026",
        title: "Guidelines for Online Public Consultation",
        type: "Office Memorandum",
        downloadUrl: "#",
      },
      {
        date: "January 30, 2026",
        title: "Standard ToR for Highway Projects",
        type: "Circular",
        downloadUrl: "#",
      },
    ],
    relatedAuthorities: [
      {
        name: "Central Pollution Control Board (CPCB)",
        role: "Pollution monitoring and regulatory compliance",
        website: "https://cpcb.nic.in",
      },
      {
        name: "State Pollution Control Boards (SPCBs)",
        role: "State-level pollution control and consent management",
        website: "#",
      },
      {
        name: "National Green Tribunal (NGT)",
        role: "Environmental dispute resolution",
        website: "https://greentribunal.gov.in",
      },
      {
        name: "Wildlife Institute of India (WII)",
        role: "Wildlife impact assessment studies",
        website: "https://wii.gov.in",
      },
    ],
  },
  forest: {
    title: "Forest Clearance (FC)",
    shortName: "FC",
    color: "green",
    gradient: "from-green-600 to-emerald-600",
    icon: "🌲",
    overview: {
      description:
        "Forest Clearance (FC) is mandatory for diversion of forest land for non-forest purposes under the Forest (Conservation) Act, 1980. The clearance ensures sustainable forest management and compensatory measures for forest land diversion.",
      keyPoints: [
        "Required for any non-forest activity in forest land",
        "Compensatory Afforestation is mandatory",
        "Net Present Value (NPV) payment required",
        "Wildlife clearance needed if in protected areas",
        "Stage-I and Stage-II approval process",
      ],
      applicability:
        "All projects requiring diversion of forest land for non-forest purposes including mining, infrastructure, industries, and other developmental activities.",
      legalBasis:
        "Forest (Conservation) Act, 1980 and Forest (Conservation) Rules, 2022",
    },
    authority: {
      central: [
        "Ministry of Environment, Forest and Climate Change (MoEFCC)",
        "Forest Advisory Committee (FAC)",
        "Regional Offices of MoEFCC",
      ],
      state: [
        "State Forest Department",
        "Chief Conservator of Forests (CCF)",
        "Principal Chief Conservator of Forests (PCCF)",
      ],
      expert: [
        "Forest Advisory Committee (FAC)",
        "State-level Forest Advisory Committee",
      ],
    },
    processFlow: {
      steps: [
        {
          number: 1,
          title: "Proposal Submission",
          description:
            "Project proponent submits proposal through State Government to MoEFCC with all required documents and site maps.",
          duration: "30 days",
          icon: FileText,
        },
        {
          number: 2,
          title: "Stage-I Approval (In-Principle)",
          description:
            "FAC examines the proposal. In-principle approval granted for proceeding with land acquisition and other clearances.",
          duration: "60-90 days",
          icon: ClipboardList,
        },
        {
          number: 3,
          title: "Compensatory Afforestation",
          description:
            "User agency submits CA scheme, undertakes land identification for afforestation, and deposits funds.",
          duration: "6-12 months",
          icon: GitBranch,
        },
        {
          number: 4,
          title: "Compliance Verification",
          description:
            "State Forest Department verifies compliance with Stage-I conditions including fund deposits and CA land availability.",
          duration: "60 days",
          icon: CheckCircle,
        },
        {
          number: 5,
          title: "Stage-II Approval (Final)",
          description:
            "After compliance verification, final approval issued with conditions for implementation and monitoring.",
          duration: "30-45 days",
          icon: FileCheck,
        },
        {
          number: 6,
          title: "Implementation & Monitoring",
          description:
            "Project implementation with regular compliance reporting. Compensatory afforestation carried out as per approved plan.",
          duration: "Ongoing",
          icon: Clock,
        },
      ],
    },
    forms: [
      {
        name: "Form A - Proposal for Forest Clearance",
        description: "Main application form for forest land diversion",
        downloadUrl: "#",
      },
      {
        name: "Form B - Cost-Benefit Analysis",
        description: "Economic analysis of the proposed project",
        downloadUrl: "#",
      },
      {
        name: "Form C - Compliance Report",
        description: "Report on compliance with previous clearance conditions",
        downloadUrl: "#",
      },
      {
        name: "Compensatory Afforestation Scheme",
        description: "Template for CA scheme preparation",
        downloadUrl: "#",
      },
      {
        name: "Site Inspection Report Format",
        description: "Format for forest department site inspection",
        downloadUrl: "#",
      },
    ],
    agenda: [
      {
        date: "March 22, 2026",
        title: "68th Forest Advisory Committee Meeting",
        venue: "Indira Paryavaran Bhawan, New Delhi",
      },
      {
        date: "March 10, 2026",
        title: "Regional FAC Meeting (Northern Region)",
        venue: "Regional Office, MoEFCC, Chandigarh",
      },
    ],
    mom: [
      {
        date: "February 28, 2026",
        meetingNumber: "67th FAC Meeting",
        summary:
          "Considered 42 forest diversion proposals. Granted Stage-I approval for 25 projects and Stage-II for 15 projects.",
        downloadUrl: "#",
      },
      {
        date: "February 10, 2026",
        meetingNumber: "66th FAC Meeting",
        summary:
          "Reviewed 38 proposals including mining and infrastructure projects. Recommended compliance verification for 10 projects.",
        downloadUrl: "#",
      },
    ],
    notifications: [
      {
        date: "March 5, 2026",
        title: "Forest (Conservation) Amendment Rules 2026",
        type: "Notification",
        downloadUrl: "#",
      },
      {
        date: "February 20, 2026",
        title: "Revised NPV Rates for Forest Land",
        type: "Office Memorandum",
        downloadUrl: "#",
      },
      {
        date: "January 25, 2026",
        title: "Guidelines for Compensatory Afforestation",
        type: "Circular",
        downloadUrl: "#",
      },
    ],
    relatedAuthorities: [
      {
        name: "CAMPA (Compensatory Afforestation Fund Management)",
        role: "Management of compensatory afforestation funds",
        website: "#",
      },
      {
        name: "Forest Survey of India (FSI)",
        role: "Forest cover assessment and monitoring",
        website: "https://fsi.nic.in",
      },
      {
        name: "Indian Council of Forestry Research (ICFRE)",
        role: "Forestry research and education",
        website: "https://icfre.gov.in",
      },
    ],
  },
  wildlife: {
    title: "Wildlife Clearance (WL)",
    shortName: "WL",
    color: "orange",
    gradient: "from-orange-600 to-amber-600",
    icon: "🦁",
    overview: {
      description:
        "Wildlife Clearance is required for projects located within or near Protected Areas including National Parks, Wildlife Sanctuaries, Tiger Reserves, and Eco-Sensitive Zones under the Wildlife (Protection) Act, 1972.",
      keyPoints: [
        "Mandatory for projects in/around Protected Areas",
        "Required for activities in Eco-Sensitive Zones (ESZ)",
        "Standing Committee of NBWL examines proposals",
        "Strict conditions for wildlife conservation",
        "Site inspection by WCCB/WII may be required",
      ],
      applicability:
        "All projects within 10 km of Protected Area boundaries or activities affecting wildlife corridors, habitats, and critical wildlife areas.",
      legalBasis:
        "Wildlife (Protection) Act, 1972 and subsequent amendments",
    },
    authority: {
      central: [
        "Ministry of Environment, Forest and Climate Change (MoEFCC)",
        "National Board for Wildlife (NBWL)",
        "Standing Committee of NBWL",
        "Wildlife Crime Control Bureau (WCCB)",
      ],
      state: [
        "State Board for Wildlife (SBWL)",
        "Chief Wildlife Warden",
        "State Forest & Wildlife Department",
      ],
      expert: [
        "Wildlife Institute of India (WII)",
        "Standing Committee of NBWL",
        "State Wildlife Advisory Board",
      ],
    },
    processFlow: {
      steps: [
        {
          number: 1,
          title: "Site Assessment",
          description:
            "Project proponent conducts preliminary assessment of wildlife presence, corridors, and ecological significance of the area.",
          duration: "30-45 days",
          icon: FileText,
        },
        {
          number: 2,
          title: "Proposal Submission",
          description:
            "Submit detailed proposal through State Wildlife Board including wildlife impact assessment and mitigation measures.",
          duration: "15 days",
          icon: ClipboardList,
        },
        {
          number: 3,
          title: "State Board Review",
          description:
            "State Board for Wildlife examines the proposal and provides recommendations to Standing Committee of NBWL.",
          duration: "60 days",
          icon: GitBranch,
        },
        {
          number: 4,
          title: "Site Inspection",
          description:
            "Expert team from WII or WCCB conducts site inspection to verify ecological impact and wildlife presence.",
          duration: "30-45 days",
          icon: Users,
        },
        {
          number: 5,
          title: "NBWL Appraisal",
          description:
            "Standing Committee of NBWL reviews proposal, site inspection report, and makes recommendations to MoEFCC.",
          duration: "60-90 days",
          icon: FileCheck,
        },
        {
          number: 6,
          title: "Final Approval",
          description:
            "MoEFCC issues wildlife clearance with stringent conditions for wildlife conservation and habitat protection.",
          duration: "30 days",
          icon: CheckCircle,
        },
      ],
    },
    forms: [
      {
        name: "Form for Wildlife Clearance Application",
        description: "Standard application form for WL clearance",
        downloadUrl: "#",
      },
      {
        name: "Wildlife Impact Assessment Format",
        description: "Guidelines for conducting wildlife impact studies",
        downloadUrl: "#",
      },
      {
        name: "ESZ Compliance Declaration",
        description: "Form for projects in Eco-Sensitive Zones",
        downloadUrl: "#",
      },
      {
        name: "Mitigation Measures Template",
        description: "Template for wildlife conservation measures",
        downloadUrl: "#",
      },
    ],
    agenda: [
      {
        date: "March 25, 2026",
        title: "45th Standing Committee of NBWL Meeting",
        venue: "Paryavaran Bhawan, New Delhi",
      },
      {
        date: "March 12, 2026",
        title: "State Wildlife Board Meeting (Maharashtra)",
        venue: "Mumbai",
      },
    ],
    mom: [
      {
        date: "February 22, 2026",
        meetingNumber: "44th NBWL Standing Committee",
        summary:
          "Reviewed 18 proposals affecting Protected Areas. Recommended clearance for 8 projects with strict wildlife conservation conditions.",
        downloadUrl: "#",
      },
      {
        date: "January 28, 2026",
        meetingNumber: "43rd NBWL Standing Committee",
        summary:
          "Considered 15 infrastructure projects near wildlife corridors. Approved 6 projects with habitat restoration requirements.",
        downloadUrl: "#",
      },
    ],
    notifications: [
      {
        date: "February 28, 2026",
        title: "ESZ Notification for Tiger Reserves",
        type: "Notification",
        downloadUrl: "#",
      },
      {
        date: "February 10, 2026",
        title: "Guidelines for Linear Projects in Wildlife Areas",
        type: "Office Memorandum",
        downloadUrl: "#",
      },
      {
        date: "January 20, 2026",
        title: "Wildlife Impact Assessment Protocol",
        type: "Circular",
        downloadUrl: "#",
      },
    ],
    relatedAuthorities: [
      {
        name: "Wildlife Institute of India (WII)",
        role: "Wildlife research and impact assessment",
        website: "https://wii.gov.in",
      },
      {
        name: "Wildlife Crime Control Bureau (WCCB)",
        role: "Wildlife protection and enforcement",
        website: "https://wccb.gov.in",
      },
      {
        name: "National Tiger Conservation Authority (NTCA)",
        role: "Tiger reserve management and conservation",
        website: "https://ntca.gov.in",
      },
      {
        name: "Bombay Natural History Society (BNHS)",
        role: "Wildlife surveys and ecological studies",
        website: "https://bnhs.org",
      },
    ],
  },
  crz: {
    title: "Coastal Regulation Zone Clearance (CRZ)",
    shortName: "CRZ",
    color: "cyan",
    gradient: "from-cyan-600 to-blue-600",
    icon: "🌊",
    overview: {
      description:
        "CRZ Clearance is mandatory for activities and construction within the Coastal Regulation Zone as defined under CRZ Notification, 2019. The clearance aims to protect coastal ecosystems and ensure sustainable coastal development.",
      keyPoints: [
        "Applicable to projects within 500m-100m from High Tide Line (HTL)",
        "Different regulations for CRZ-I, II, III, and IV zones",
        "Coastal Zone Management Plan (CZMP) compliance required",
        "No-development zones strictly protected",
        "Special provisions for islands and ecologically sensitive areas",
      ],
      applicability:
        "All construction, industrial, and developmental activities within the Coastal Regulation Zone along seas, bays, estuaries, creeks, rivers, and backwaters.",
      legalBasis:
        "Environment (Protection) Act, 1986 and CRZ Notification, 2019",
    },
    authority: {
      central: [
        "Ministry of Environment, Forest and Climate Change (MoEFCC)",
        "National Centre for Sustainable Coastal Management (NCSCM)",
        "Expert Appraisal Committee (CRZ)",
      ],
      state: [
        "State Coastal Zone Management Authority (SCZMA)",
        "State Environment Impact Assessment Authority (SEIAA)",
        "Coastal Zone Management Plans (CZMP) at District level",
      ],
      expert: [
        "Expert Appraisal Committee for CRZ Projects",
        "National Centre for Sustainable Coastal Management",
      ],
    },
    processFlow: {
      steps: [
        {
          number: 1,
          title: "CRZ Classification",
          description:
            "Determine project location classification (CRZ-I/II/III/IV) based on CZMP and distance from High Tide Line (HTL).",
          duration: "15 days",
          icon: FileText,
        },
        {
          number: 2,
          title: "Proposal Preparation",
          description:
            "Prepare detailed project report with CRZ compliance, coastal impact assessment, and HTL demarcation.",
          duration: "60 days",
          icon: ClipboardList,
        },
        {
          number: 3,
          title: "SCZMA Review",
          description:
            "State Coastal Zone Management Authority examines proposal for compliance with CRZ norms and CZMP.",
          duration: "45-60 days",
          icon: GitBranch,
        },
        {
          number: 4,
          title: "Site Verification",
          description:
            "Physical verification of HTL demarcation, project location, and coastal features by authorized agency.",
          duration: "30 days",
          icon: Users,
        },
        {
          number: 5,
          title: "Expert Committee Appraisal",
          description:
            "EAC for CRZ projects evaluates coastal impact, compliance, and recommends to MoEFCC with conditions.",
          duration: "60-90 days",
          icon: FileCheck,
        },
        {
          number: 6,
          title: "CRZ Clearance",
          description:
            "MoEFCC grants CRZ clearance with specific conditions for coastal zone protection and monitoring.",
          duration: "30 days",
          icon: CheckCircle,
        },
      ],
    },
    forms: [
      {
        name: "Form for CRZ Clearance Application",
        description: "Standard form for CRZ clearance submission",
        downloadUrl: "#",
      },
      {
        name: "HTL Demarcation Certificate",
        description: "Certificate from authorized agency for HTL marking",
        downloadUrl: "#",
      },
      {
        name: "Coastal Impact Assessment Format",
        description: "Guidelines for coastal impact studies",
        downloadUrl: "#",
      },
      {
        name: "CZMP Compliance Declaration",
        description: "Declaration of compliance with Coastal Zone Management Plan",
        downloadUrl: "#",
      },
      {
        name: "Marine Biodiversity Assessment",
        description: "Template for marine ecology impact assessment",
        downloadUrl: "#",
      },
    ],
    agenda: [
      {
        date: "March 28, 2026",
        title: "32nd EAC (CRZ) Meeting",
        venue: "Indira Paryavaran Bhawan, New Delhi",
      },
      {
        date: "March 15, 2026",
        title: "SCZMA Meeting (Gujarat)",
        venue: "Gandhinagar, Gujarat",
      },
    ],
    mom: [
      {
        date: "February 25, 2026",
        meetingNumber: "31st EAC (CRZ)",
        summary:
          "Reviewed 24 coastal projects. Recommended CRZ clearance for 16 projects with coastal conservation measures.",
        downloadUrl: "#",
      },
      {
        date: "January 30, 2026",
        meetingNumber: "30th EAC (CRZ)",
        summary:
          "Examined 20 port and tourism projects. Approved 12 projects subject to HTL verification and mangrove protection.",
        downloadUrl: "#",
      },
    ],
    notifications: [
      {
        date: "March 2, 2026",
        title: "Amendment to CRZ Notification 2019",
        type: "Notification",
        downloadUrl: "#",
      },
      {
        date: "February 18, 2026",
        title: "Guidelines for HTL Demarcation",
        type: "Office Memorandum",
        downloadUrl: "#",
      },
      {
        date: "January 28, 2026",
        title: "Mangrove Conservation Guidelines",
        type: "Circular",
        downloadUrl: "#",
      },
    ],
    relatedAuthorities: [
      {
        name: "National Centre for Sustainable Coastal Management (NCSCM)",
        role: "Coastal zone mapping and CZMP preparation",
        website: "https://ncscm.res.in",
      },
      {
        name: "National Institute of Ocean Technology (NIOT)",
        role: "Oceanographic studies and coastal surveys",
        website: "https://niot.res.in",
      },
      {
        name: "Survey of India (SOI)",
        role: "HTL demarcation and coastal mapping",
        website: "https://surveyofindia.gov.in",
      },
      {
        name: "Indian National Centre for Ocean Information Services (INCOIS)",
        role: "Ocean data and coastal information",
        website: "https://incois.gov.in",
      },
    ],
  },
};

export function ClearanceInfoPage() {
  const { type } = useParams<{ type: ClearanceType }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const data = type ? clearanceData[type] : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Clearance Type Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The clearance type you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a7f3e] text-white rounded-lg hover:bg-[#1e5a2d] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "authority", label: "Approving Authority", icon: Building2 },
    { id: "process", label: "Process Flow", icon: GitBranch },
    { id: "forms", label: "Application Forms", icon: ClipboardList },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "mom", label: "Minutes of Meeting", icon: FileCheck },
    { id: "notifications", label: "Notifications & Orders", icon: Bell },
    { id: "authorities", label: "Related Authorities", icon: Users },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GovHeader />

      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${data.gradient} py-12`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 text-white mb-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{data.title}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl">
              {data.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {data.title}
              </h1>
              <p className="text-white/90 text-lg">
                Complete guide and application process
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Navigation Panel */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                <h3 className="text-white font-bold text-lg">Quick Navigation</h3>
              </div>
              <nav className="p-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                      activeSection === section.id
                        ? `bg-${data.color}-100 text-${data.color}-700 font-semibold`
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>

              {/* Apply Button in Sidebar */}
              <div className="p-4 border-t-2 border-gray-200">
                <Link
                  to={`/application/new?type=${type}`}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${data.gradient} text-white rounded-xl font-bold hover:shadow-xl transition-all`}
                >
                  Apply for {data.shortName}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Overview Section */}
            <section id="overview" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Info className="w-7 h-7" />
                    Overview
                  </h2>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {data.overview.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Key Points
                    </h3>
                    <ul className="space-y-3">
                      {data.overview.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                      <h4 className="font-bold text-gray-900 mb-2">
                        Applicability
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {data.overview.applicability}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                      <h4 className="font-bold text-gray-900 mb-2">
                        Legal Basis
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {data.overview.legalBasis}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Authority Section */}
            <section id="authority" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Building2 className="w-7 h-7" />
                    Know Your Approving Authority
                  </h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Central Level
                      </h3>
                      <ul className="space-y-2">
                        {data.authority.central.map((auth, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{auth}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        State Level
                      </h3>
                      <ul className="space-y-2">
                        {data.authority.state.map((auth, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{auth}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Expert Committees
                      </h3>
                      <ul className="space-y-2">
                        {data.authority.expert.map((auth, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ChevronRight className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{auth}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Process Flow Section */}
            <section id="process" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <GitBranch className="w-7 h-7" />
                    Know Your Process Flow
                  </h2>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    {data.processFlow.steps.map((step, index) => (
                      <div
                        key={index}
                        className="relative flex gap-6 group hover:bg-gray-50 rounded-xl p-6 transition-all border-2 border-gray-100"
                      >
                        {/* Step Number Badge */}
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${data.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl font-black text-white">
                            {step.number}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {step.title}
                            </h3>
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                              <Clock className="w-4 h-4" />
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-gray-700">{step.description}</p>
                        </div>

                        {/* Connecting Line */}
                        {index < data.processFlow.steps.length - 1 && (
                          <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Forms Section */}
            <section id="forms" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ClipboardList className="w-7 h-7" />
                    Know Your Application Forms
                  </h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {data.forms.map((form, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {form.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {form.description}
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          <Download className="w-5 h-5" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Agenda Section */}
            <section id="agenda" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Calendar className="w-7 h-7" />
                    Upcoming Meeting Agenda
                  </h2>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {data.agenda.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500"
                      >
                        <Calendar className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-semibold">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Venue: {item.venue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* MOM Section */}
            <section id="mom" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileCheck className="w-7 h-7" />
                    Minutes of Meeting (MoM)
                  </h2>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {data.mom.map((item, index) => (
                      <div
                        key={index}
                        className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold">
                              {item.date}
                            </span>
                            <h3 className="font-bold text-gray-900 mt-2">
                              {item.meetingNumber}
                            </h3>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            <Download className="w-4 h-4" />
                            Download MoM
                          </button>
                        </div>
                        <p className="text-gray-700">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section id="notifications" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Bell className="w-7 h-7" />
                    Notifications & Orders
                  </h2>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {data.notifications.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-500"
                      >
                        <div className="flex items-start gap-4">
                          <Bell className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm font-semibold">
                                {item.date}
                              </span>
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold">
                                {item.type}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Related Authorities Section */}
            <section id="authorities" className="mb-8 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${data.gradient} px-6 py-4`}>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="w-7 h-7" />
                    Related Authorities & Departments
                  </h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.relatedAuthorities.map((auth, index) => (
                      <div
                        key={index}
                        className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-bold text-gray-900 mb-2">
                          {auth.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{auth.role}</p>
                        <a
                          href={auth.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Apply for {data.shortName} Clearance?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Start your application process now. Make sure you have all the
                required documents and information ready before proceeding.
              </p>
              <Link
                to={`/application/new?type=${type}`}
                className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${data.gradient} text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all`}
              >
                Apply for {data.shortName} Clearance
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
