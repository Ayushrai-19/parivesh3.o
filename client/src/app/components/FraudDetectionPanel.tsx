import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileWarning,
  MapPin,
  Copy,
  FileX,
  TrendingUp,
  Eye,
  MessageSquare,
  Flag,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  User,
} from "lucide-react";

export interface FraudIssue {
  id: string;
  type: "critical" | "warning" | "info";
  category: string;
  description: string;
  details?: string;
  icon: any;
}

export interface FraudAnalysisResult {
  applicationId: string;
  riskScore: number; // 0-100
  riskLevel: "low" | "medium" | "high";
  issues: FraudIssue[];
  analyzedAt: Date;
  confidence: number;
  recommendations: string[];
}

interface FraudDetectionPanelProps {
  analysisResult: FraudAnalysisResult;
  onRaiseEDS?: () => void;
  onContinueReview?: () => void;
  onAddRemarks?: () => void;
  compact?: boolean;
  showActions?: boolean;
}

export function FraudDetectionPanel({
  analysisResult,
  onRaiseEDS,
  onContinueReview,
  onAddRemarks,
  compact = false,
  showActions = true,
}: FraudDetectionPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return {
          bg: "bg-green-50",
          border: "border-green-500",
          text: "text-green-700",
          gradient: "from-green-500 to-emerald-500",
          icon: CheckCircle,
        };
      case "medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-500",
          text: "text-yellow-700",
          gradient: "from-yellow-500 to-orange-500",
          icon: AlertTriangle,
        };
      case "high":
        return {
          bg: "bg-red-50",
          border: "border-red-500",
          text: "text-red-700",
          gradient: "from-red-500 to-pink-500",
          icon: XCircle,
        };
    }
  };

  const getIssueColor = (type: "critical" | "warning" | "info") => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-l-4 border-red-500",
          text: "text-red-700",
          icon: "text-red-600",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-l-4 border-yellow-500",
          text: "text-yellow-700",
          icon: "text-yellow-600",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-l-4 border-blue-500",
          text: "text-blue-700",
          icon: "text-blue-600",
        };
    }
  };

  const riskStyle = getRiskColor(analysisResult.riskLevel);
  const RiskIcon = riskStyle.icon;

  const criticalIssues = analysisResult.issues.filter((i) => i.type === "critical");
  const warningIssues = analysisResult.issues.filter((i) => i.type === "warning");
  const infoIssues = analysisResult.issues.filter((i) => i.type === "info");

  return (
    <div className={compact ? "" : "p-4"}>
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">AI Fraud Detection Alert</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-3 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    AI Risk Analysis Completed
                  </span>
                  <span className="text-xs text-white/80">
                    Analyzed on {analysisResult.analyzedAt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-6 h-6 text-white" />
              ) : (
                <ChevronDown className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="p-6 space-y-6">
            {/* Risk Score and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Score */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-600">
                    Fraud Risk Score
                  </span>
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                </div>
                <div className="mb-3">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {analysisResult.riskScore}
                    <span className="text-2xl text-gray-500">/100</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysisResult.confidence}% confidence
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      analysisResult.riskScore < 30
                        ? "from-green-500 to-emerald-500"
                        : analysisResult.riskScore < 70
                        ? "from-yellow-500 to-orange-500"
                        : "from-red-500 to-pink-500"
                    } transition-all duration-500`}
                    style={{ width: `${analysisResult.riskScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Risk Level */}
              <div
                className={`${riskStyle.bg} border-2 ${riskStyle.border} rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-600">
                    Overall Risk Level
                  </span>
                  <RiskIcon className={`w-5 h-5 ${riskStyle.text}`} />
                </div>
                <div className={`flex items-center gap-4`}>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${riskStyle.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <RiskIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div
                      className={`text-3xl font-bold ${riskStyle.text} uppercase`}
                    >
                      {analysisResult.riskLevel}
                    </div>
                    <div className="text-sm text-gray-600">Risk Assessment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-700 mb-1">
                  {criticalIssues.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Critical Issues
                </div>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-yellow-700 mb-1">
                  {warningIssues.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Warnings</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {infoIssues.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Informational
                </div>
              </div>
            </div>

            {/* Issues Detected */}
            {analysisResult.issues.length > 0 && (
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Issues Detected ({analysisResult.issues.length})
                  </h4>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {analysisResult.issues.map((issue) => {
                    const issueStyle = getIssueColor(issue.type);
                    const IssueIcon = issue.icon;
                    return (
                      <div
                        key={issue.id}
                        className={`${issueStyle.bg} ${issueStyle.border} rounded-lg p-4`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <IssueIcon
                              className={`w-6 h-6 ${issueStyle.icon}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">
                                  {issue.category}
                                </div>
                                <div className={`text-sm ${issueStyle.text}`}>
                                  {issue.description}
                                </div>
                              </div>
                              <span
                                className={`px-2 py-1 ${issueStyle.bg} ${issueStyle.text} text-xs font-bold uppercase rounded-full border ${issueStyle.border.replace("border-l-4", "border")}`}
                              >
                                {issue.type}
                              </span>
                            </div>
                            {issue.details && (
                              <>
                                <button
                                  onClick={() =>
                                    setShowDetails(
                                      showDetails === issue.id ? null : issue.id
                                    )
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  {showDetails === issue.id
                                    ? "Hide Details"
                                    : "Show Details"}
                                </button>
                                {showDetails === issue.id && (
                                  <div className="mt-2 p-3 bg-white/50 rounded-lg text-xs text-gray-700 border border-gray-200">
                                    {issue.details}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  AI Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={onRaiseEDS}
                  className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <Flag className="w-5 h-5" />
                  Raise EDS
                </button>
                <button
                  onClick={onAddRemarks}
                  className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  Add Remarks
                </button>
                <button
                  onClick={onContinueReview}
                  className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Continue Review
                </button>
              </div>
            )}

            {/* AI Disclaimer */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">
                    AI-Assisted Analysis
                  </p>
                  <p>
                    This fraud detection analysis is generated by AI and should be
                    verified by human reviewers. The system analyzes patterns,
                    inconsistencies, and risk factors but cannot replace
                    professional judgment. All flagged issues should be
                    investigated thoroughly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fraud Analysis Badge Component
interface FraudAnalysisBadgeProps {
  riskLevel: "low" | "medium" | "high";
  compact?: boolean;
}

export function FraudAnalysisBadge({
  riskLevel,
  compact = false,
}: FraudAnalysisBadgeProps) {
  const getBadgeStyle = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-700 border-green-500";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-500";
      case "high":
        return "bg-red-100 text-red-700 border-red-500";
    }
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(
          riskLevel
        )}`}
      >
        <Shield className="w-3 h-3" />
        AI Risk: {riskLevel.toUpperCase()}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border-2 ${getBadgeStyle(
        riskLevel
      )}`}
    >
      <Shield className="w-4 h-4" />
      <span>AI Risk Analysis Completed</span>
      <span className="uppercase">• {riskLevel} Risk</span>
    </div>
  );
}
