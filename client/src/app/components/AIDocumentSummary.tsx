import { useState } from "react";
import {
  Sparkles,
  FileText,
  MapPin,
  Building2,
  Maximize2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  TrendingUp,
  Users,
  Droplet,
  Wind,
  Trees,
  Factory,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

interface DocumentAnalysis {
  projectType: string;
  projectLocation: {
    state: string;
    district: string;
    coordinates: string;
  };
  sector: string;
  landArea: {
    total: string;
    forestLand: string;
    nonForestLand: string;
  };
  environmentalImpacts: {
    category: string;
    level: "low" | "moderate" | "high";
    description: string;
    icon: any;
  }[];
  complianceNotes: {
    status: "compliant" | "partial" | "non-compliant";
    note: string;
  }[];
  missingInformation: string[];
  overallRiskLevel: "low" | "moderate" | "high";
  confidence: number;
}

interface AIDocumentSummaryProps {
  documentName: string;
  documentType: string;
  onClose?: () => void;
  compact?: boolean;
}

// Mock AI analysis generator
const generateAIAnalysis = (documentName: string, documentType: string): DocumentAnalysis => {
  // Simulate different analyses based on document type
  const analyses: Record<string, Partial<DocumentAnalysis>> = {
    "EIA Report": {
      projectType: "Coal Mining Project",
      sector: "Mining - Coal",
      landArea: {
        total: "1,245.5 hectares",
        forestLand: "456.2 hectares",
        nonForestLand: "789.3 hectares",
      },
      environmentalImpacts: [
        {
          category: "Air Quality",
          level: "high",
          description: "Significant dust generation expected. Mitigation measures required.",
          icon: Wind,
        },
        {
          category: "Water Resources",
          level: "moderate",
          description: "Groundwater depletion risk moderate. Monitoring plan included.",
          icon: Droplet,
        },
        {
          category: "Forest Cover",
          level: "high",
          description: "456.2 ha forest diversion. Compensatory afforestation mandatory.",
          icon: Trees,
        },
        {
          category: "Biodiversity",
          level: "moderate",
          description: "Wildlife corridor proximity detected. Impact assessment needed.",
          icon: AlertTriangle,
        },
      ],
      complianceNotes: [
        {
          status: "compliant",
          note: "EIA methodology follows MOEFCC guidelines 2020",
        },
        {
          status: "compliant",
          note: "Public consultation conducted as per EIA Notification 2006",
        },
        {
          status: "partial",
          note: "Baseline data for noise levels covers only 6 months (12 months recommended)",
        },
      ],
      missingInformation: [
        "Detailed Disaster Management Plan",
        "Risk Assessment for nearby settlements",
        "Long-term rehabilitation plan beyond 10 years",
      ],
      overallRiskLevel: "high",
    },
    "Project Proposal": {
      projectType: "Highway Development Project",
      sector: "Infrastructure - Roads & Highways",
      landArea: {
        total: "856.3 hectares",
        forestLand: "124.5 hectares",
        nonForestLand: "731.8 hectares",
      },
      environmentalImpacts: [
        {
          category: "Land Use Change",
          level: "moderate",
          description: "Agricultural land conversion. R&R plan required for 45 families.",
          icon: Maximize2,
        },
        {
          category: "Air Quality",
          level: "low",
          description: "Minimal air quality impact during operation. Construction phase monitoring needed.",
          icon: Wind,
        },
        {
          category: "Noise Pollution",
          level: "moderate",
          description: "Noise barriers required near residential areas and schools.",
          icon: AlertCircle,
        },
        {
          category: "Wildlife Crossings",
          level: "moderate",
          description: "Eco-bridges recommended at 3 locations for wildlife movement.",
          icon: Trees,
        },
      ],
      complianceNotes: [
        {
          status: "compliant",
          note: "Alignment avoids ecologically sensitive areas",
        },
        {
          status: "compliant",
          note: "Green belt development plan included",
        },
        {
          status: "partial",
          note: "Traffic impact assessment incomplete for 2 junctions",
        },
      ],
      missingInformation: [
        "Detailed drainage system design",
        "Heritage impact assessment for nearby archaeological sites",
      ],
      overallRiskLevel: "moderate",
    },
    "Consent to Establish": {
      projectType: "Thermal Power Plant",
      sector: "Energy - Thermal Power",
      landArea: {
        total: "2,450.0 hectares",
        forestLand: "0 hectares",
        nonForestLand: "2,450.0 hectares",
      },
      environmentalImpacts: [
        {
          category: "Air Emissions",
          level: "high",
          description: "SO2, NOx, and PM emissions. FGD and ESP systems mandatory.",
          icon: Factory,
        },
        {
          category: "Water Consumption",
          level: "high",
          description: "High water requirement. Zero liquid discharge system proposed.",
          icon: Droplet,
        },
        {
          category: "Ash Management",
          level: "moderate",
          description: "Fly ash utilization plan for cement and brick manufacturing.",
          icon: AlertTriangle,
        },
        {
          category: "Thermal Pollution",
          level: "moderate",
          description: "Cooling tower design to minimize thermal discharge impact.",
          icon: TrendingUp,
        },
      ],
      complianceNotes: [
        {
          status: "compliant",
          note: "Emission standards meet CPCB norms for new thermal plants",
        },
        {
          status: "compliant",
          note: "Water recycling system efficiency > 80%",
        },
        {
          status: "non-compliant",
          note: "Green belt area insufficient - requires additional 50 hectares",
        },
      ],
      missingInformation: [
        "Emergency response plan for hazardous material spills",
        "Occupational health and safety protocols",
        "Detailed CSR plan for local community development",
      ],
      overallRiskLevel: "high",
    },
  };

  // Default analysis for other document types
  const defaultAnalysis: DocumentAnalysis = {
    projectType: "Industrial Development Project",
    projectLocation: {
      state: "Maharashtra",
      district: "Pune",
      coordinates: "18.5204°N, 73.8567°E",
    },
    sector: "Industry - Manufacturing",
    landArea: {
      total: "425.0 hectares",
      forestLand: "0 hectares",
      nonForestLand: "425.0 hectares",
    },
    environmentalImpacts: [
      {
        category: "Air Quality",
        level: "low",
        description: "Minimal emissions. Stack height and dispersion modeling adequate.",
        icon: Wind,
      },
      {
        category: "Water Usage",
        level: "low",
        description: "Moderate water requirement. Rainwater harvesting implemented.",
        icon: Droplet,
      },
      {
        category: "Waste Management",
        level: "moderate",
        description: "Hazardous waste storage and disposal plan meets CPCB guidelines.",
        icon: AlertTriangle,
      },
    ],
    complianceNotes: [
      {
        status: "compliant",
        note: "All mandatory clearances and NOCs obtained",
      },
      {
        status: "compliant",
        note: "Environmental management plan comprehensive",
      },
    ],
    missingInformation: [
      "Detailed project implementation timeline",
    ],
    overallRiskLevel: "low",
    confidence: 87,
  };

  // Get specific analysis or use default
  const specificAnalysis = analyses[documentType] || {};
  
  return {
    ...defaultAnalysis,
    ...specificAnalysis,
    projectLocation: {
      state: "Maharashtra",
      district: "Pune",
      coordinates: "18.5204°N, 73.8567°E",
    },
    confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
  };
};

export function AIDocumentSummary({
  documentName,
  documentType,
  onClose,
  compact = false,
}: AIDocumentSummaryProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    impacts: true,
    compliance: true,
    missing: true,
  });

  const handleGenerateSummary = () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    setTimeout(() => {
      const result = generateAIAnalysis(documentName, documentType);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 2500);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getRiskColor = (level: "low" | "moderate" | "high") => {
    switch (level) {
      case "low":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-500",
          gradient: "from-green-500 to-emerald-500",
          icon: CheckCircle,
        };
      case "moderate":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-500",
          gradient: "from-yellow-500 to-orange-500",
          icon: AlertCircle,
        };
      case "high":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-500",
          gradient: "from-red-500 to-pink-500",
          icon: AlertTriangle,
        };
    }
  };

  const getComplianceColor = (status: "compliant" | "partial" | "non-compliant") => {
    switch (status) {
      case "compliant":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" };
      case "partial":
        return { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" };
      case "non-compliant":
        return { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" };
    }
  };

  if (!analysis && !isAnalyzing) {
    return (
      <div className={compact ? "p-4" : "p-6"}>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            AI Document Analysis
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Generate an intelligent summary of this document using AI to extract key
            project details, environmental impacts, and compliance information.
          </p>
          <button
            onClick={handleGenerateSummary}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Document Summary
          </button>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-purple-200">
            <Info className="w-4 h-4 text-purple-600" />
            Analysis takes 2-3 seconds
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className={compact ? "p-4" : "p-6"}>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-12 text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Analyzing Document...
          </h3>
          <p className="text-gray-600">
            AI is processing the document to extract key information
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <span>Extracting project details...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
              <span>Analyzing environmental impacts...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-200"></div>
              <span>Checking compliance requirements...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const riskStyle = getRiskColor(analysis.overallRiskLevel);
  const RiskIcon = riskStyle.icon;

  return (
    <div className={compact ? "p-4" : "p-6"}>
      <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Document Analysis</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    AI Assisted Document Review
                  </span>
                  <span className="text-xs text-white/80">
                    {analysis.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {/* Overall Risk Level */}
          <div
            className={`${riskStyle.bg} border-2 ${riskStyle.border} rounded-xl p-4`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${riskStyle.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <RiskIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">
                  Overall Environmental Risk
                </div>
                <div className={`text-xl font-bold ${riskStyle.text} uppercase`}>
                  {analysis.overallRiskLevel} Impact
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <FileText className="w-5 h-5" />
                <span className="font-semibold text-sm">Project Type</span>
              </div>
              <p className="text-gray-900 font-bold">{analysis.projectType}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Building2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Sector</span>
              </div>
              <p className="text-gray-900 font-bold">{analysis.sector}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-sm">Location</span>
              </div>
              <p className="text-gray-900 font-bold">
                {analysis.projectLocation.district}, {analysis.projectLocation.state}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {analysis.projectLocation.coordinates}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <Maximize2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Total Land Area</span>
              </div>
              <p className="text-gray-900 font-bold">{analysis.landArea.total}</p>
              <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                <div>Forest: {analysis.landArea.forestLand}</div>
                <div>Non-Forest: {analysis.landArea.nonForestLand}</div>
              </div>
            </div>
          </div>

          {/* Environmental Impacts */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("impacts")}
              className="w-full bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-900">
                  Environmental Impact Indicators ({analysis.environmentalImpacts.length})
                </span>
              </div>
              {expandedSections.impacts ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections.impacts && (
              <div className="p-4 space-y-3">
                {analysis.environmentalImpacts.map((impact, index) => {
                  const impactStyle = getRiskColor(impact.level);
                  const ImpactIcon = impact.icon;
                  return (
                    <div
                      key={index}
                      className={`${impactStyle.bg} border-l-4 ${impactStyle.border} rounded-lg p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${impactStyle.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <ImpactIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900">
                              {impact.category}
                            </h4>
                            <span
                              className={`px-3 py-1 ${impactStyle.bg} ${impactStyle.text} rounded-full text-xs font-bold uppercase border ${impactStyle.border}`}
                            >
                              {impact.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {impact.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Compliance Notes */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("compliance")}
              className="w-full bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-900">
                  Compliance Notes ({analysis.complianceNotes.length})
                </span>
              </div>
              {expandedSections.compliance ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections.compliance && (
              <div className="p-4 space-y-2">
                {analysis.complianceNotes.map((note, index) => {
                  const complianceStyle = getComplianceColor(note.status);
                  const ComplianceIcon = complianceStyle.icon;
                  return (
                    <div
                      key={index}
                      className={`${complianceStyle.bg} rounded-lg p-3 flex items-start gap-3`}
                    >
                      <ComplianceIcon
                        className={`w-5 h-5 ${complianceStyle.color} flex-shrink-0 mt-0.5`}
                      />
                      <p className="text-sm text-gray-700">{note.note}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Missing Information */}
          {analysis.missingInformation.length > 0 && (
            <div className="border-2 border-red-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("missing")}
                className="w-full bg-red-50 px-4 py-3 flex items-center justify-between hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-700" />
                  <span className="font-bold text-gray-900">
                    Possible Missing Information ({analysis.missingInformation.length})
                  </span>
                </div>
                {expandedSections.missing ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.missing && (
                <div className="p-4">
                  <ul className="space-y-2">
                    {analysis.missingInformation.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AI Disclaimer */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">
                  AI-Generated Summary
                </p>
                <p>
                  This summary is generated by AI and should be verified by human
                  reviewers. It is meant to assist in document review, not replace
                  professional judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
