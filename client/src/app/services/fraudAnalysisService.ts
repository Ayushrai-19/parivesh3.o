import { FraudAnalysisResult, FraudIssue } from "../components/FraudDetectionPanel";
import {
  FileWarning,
  Copy,
  AlertTriangle,
  MapPin,
  FileX,
  Clock,
} from "lucide-react";

interface ApplicationData {
  id: string;
  projectName: string;
  sector: string;
  location: string;
  landArea: string;
  documents: any[];
  submittedOn?: string;
}

// Simulate fraud detection analysis
export function performFraudAnalysis(
  applicationData: ApplicationData
): FraudAnalysisResult {
  const issues: FraudIssue[] = [];
  let riskScore = 0;

  // Check 1: Land area mismatch
  const landAreaValue = parseFloat(applicationData.landArea);
  if (landAreaValue > 1000) {
    // Simulate mismatch for large projects
    const mismatchPercentage = Math.random() * 30;
    if (mismatchPercentage > 15) {
      issues.push({
        id: "land-mismatch-1",
        type: "warning",
        category: "Land Area Mismatch",
        description: `Land area in application form (${applicationData.landArea} ha) differs from document analysis (${(
          landAreaValue * 1.2
        ).toFixed(1)} ha)`,
        details: `The land area mentioned in the application form is ${landAreaValue} hectares, but our AI analysis of uploaded documents suggests the actual area might be ${(
          landAreaValue * 1.2
        ).toFixed(
          1
        )} hectares. This ${mismatchPercentage.toFixed(
          1
        )}% discrepancy requires verification. Please cross-check with land ownership documents and survey reports.`,
        icon: MapPin,
      });
      riskScore += 20;
    }
  }

  // Check 2: Duplicate document detection
  const documentNames = applicationData.documents.map((doc) =>
    doc.name.toLowerCase()
  );
  const duplicates = documentNames.filter(
    (name, index) => documentNames.indexOf(name) !== index
  );
  if (duplicates.length > 0) {
    issues.push({
      id: "duplicate-doc-1",
      type: "critical",
      category: "Duplicate Document Detected",
      description: `Multiple uploads of the same document: "${duplicates[0]}"`,
      details: `The system detected ${
        duplicates.length + 1
      } uploads of documents with identical or very similar names. This could indicate accidental duplicate submission or potential document manipulation. Please verify the authenticity and uniqueness of all uploaded documents.`,
      icon: Copy,
    });
    riskScore += 30;
  }

  // Check 3: Project location near restricted zones
  const restrictedKeywords = ["forest", "wildlife", "sanctuary", "reserve", "crz"];
  const locationLower = applicationData.location.toLowerCase();
  const nearRestricted = restrictedKeywords.some((keyword) =>
    locationLower.includes(keyword)
  );
  
  if (nearRestricted || Math.random() > 0.5) {
    issues.push({
      id: "restricted-zone-1",
      type: "warning",
      category: "Restricted Environmental Zone Proximity",
      description: `Project location "${applicationData.location}" is within 10km of protected forest area`,
      details: `Our geospatial analysis indicates that the project location falls within 10 kilometers of a protected forest reserve or ecologically sensitive area. Projects in such proximity require additional environmental clearances and may face stricter scrutiny. Ensure all buffer zone regulations are addressed in the EIA report.`,
      icon: AlertTriangle,
    });
    riskScore += 25;
  }

  // Check 4: Missing mandatory documents
  const requiredDocs = [
    "eia",
    "environmental impact",
    "consent",
    "noc",
    "clearance",
  ];
  const uploadedDocNames = documentNames.join(" ");
  const missingDocs = requiredDocs.filter(
    (req) => !uploadedDocNames.includes(req)
  );

  if (missingDocs.length > 0) {
    issues.push({
      id: "missing-docs-1",
      type: "critical",
      category: "Missing Mandatory Documents",
      description: `${missingDocs.length} required environmental compliance document(s) not found`,
      details: `The following mandatory documents appear to be missing or not properly named: ${missingDocs
        .map((d) => d.toUpperCase())
        .join(
          ", "
        )}. All environmental clearance applications must include comprehensive EIA reports, NOCs from relevant authorities, and consent letters. Please ensure all required documents are uploaded with proper file names.`,
      icon: FileX,
    });
    riskScore += 35;
  }

  // Check 5: Rapid submission detection
  if (applicationData.submittedOn) {
    const submissionDate = new Date(applicationData.submittedOn);
    const now = new Date();
    const hoursSinceSubmission =
      (now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceSubmission < 2) {
      issues.push({
        id: "rapid-submission-1",
        type: "info",
        category: "Rapid Submission Pattern",
        description: `Application submitted within ${Math.round(
          hoursSinceSubmission
        )} hour(s) of account creation`,
        details: `This application was submitted very quickly after account creation. While this may be normal for well-prepared applicants, it could also indicate bulk submissions or automated filing. Consider reviewing the application completeness and accuracy more thoroughly.`,
        icon: Clock,
      });
      riskScore += 10;
    }
  }

  // Check 6: Incomplete project description
  if (!applicationData.projectName || applicationData.projectName.length < 10) {
    issues.push({
      id: "incomplete-info-1",
      type: "warning",
      category: "Insufficient Project Information",
      description: "Project description appears incomplete or too brief",
      details: `The project name or description is unusually short (${
        applicationData.projectName?.length || 0
      } characters). Comprehensive applications typically include detailed project descriptions. This may indicate rushed submission or lack of proper documentation preparation.`,
      icon: FileWarning,
    });
    riskScore += 15;
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

  // Determine risk level
  let riskLevel: "low" | "medium" | "high";
  if (riskScore < 30) {
    riskLevel = "low";
  } else if (riskScore < 70) {
    riskLevel = "medium";
  } else {
    riskLevel = "high";
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (issues.some((i) => i.category.includes("Land Area"))) {
    recommendations.push(
      "Verify land area measurements with official survey documents and cross-reference with uploaded land ownership records"
    );
  }
  
  if (issues.some((i) => i.category.includes("Duplicate"))) {
    recommendations.push(
      "Check document authenticity and verify no duplicate submissions exist from the same proponent"
    );
  }
  
  if (issues.some((i) => i.category.includes("Restricted"))) {
    recommendations.push(
      "Conduct thorough environmental impact assessment for projects near ecologically sensitive zones and verify compliance with buffer zone regulations"
    );
  }
  
  if (issues.some((i) => i.category.includes("Missing"))) {
    recommendations.push(
      "Request all missing mandatory documents before proceeding with scrutiny. Issue EDS if critical documents are absent"
    );
  }

  if (riskLevel === "high") {
    recommendations.push(
      "Given the high risk score, consider escalating this application for senior review and more detailed verification"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "No major issues detected. Proceed with standard scrutiny process"
    );
    recommendations.push(
      "Continue to verify all documents thoroughly despite low risk score"
    );
  }

  return {
    applicationId: applicationData.id,
    riskScore,
    riskLevel,
    issues,
    analyzedAt: new Date(),
    confidence: Math.floor(Math.random() * 10) + 88, // 88-97% confidence
    recommendations,
  };
}

// Store fraud analysis in session/mock database
const fraudAnalysisCache = new Map<string, FraudAnalysisResult>();

export function storeFraudAnalysis(result: FraudAnalysisResult): void {
  fraudAnalysisCache.set(result.applicationId, result);
}

export function getFraudAnalysis(
  applicationId: string
): FraudAnalysisResult | null {
  return fraudAnalysisCache.get(applicationId) || null;
}

export function hasFraudAnalysis(applicationId: string): boolean {
  return fraudAnalysisCache.has(applicationId);
}
