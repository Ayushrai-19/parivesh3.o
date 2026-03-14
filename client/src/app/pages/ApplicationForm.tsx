import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { DashboardHeader } from "../components/DashboardHeader";
import { GovFooter } from "../components/GovFooter";
import { PaymentSection } from "../components/PaymentSection";
import { BackToDashboard } from "../components/BackToDashboard";
import type { BackendPayment } from "../services/workflowApi";
import { workflowApi } from "../services/workflowApi";
import { ArrowLeft, ArrowRight, Check, Upload, MapPin, FileText, CreditCard, Send, Building2, Leaf, X, Eye, AlertCircle, CheckCircle2, Loader } from "lucide-react";

interface UploadedDocument {
  id: number;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  previewUrl: string;
}

const steps = [
  { id: 1, name: "Project Information", icon: FileText },
  { id: 2, name: "Environmental Details", icon: MapPin },
  { id: 3, name: "Document Upload", icon: Upload },
  { id: 4, name: "Payment", icon: CreditCard },
  { id: 5, name: "Submit Application", icon: Send },
];

const APPLICATION_FEE = 2000;

const sectorToBackendSector: Record<string, string> = {
  mining: "Mining",
  power: "Power",
  manufacturing: "Industry",
  renewable: "Renewable Energy",
  infrastructure: "Infrastructure",
  realestate: "Infrastructure",
};

const categoryToBackendCategory: Record<string, string> = {
  red: "Red",
  orange: "Orange",
  green: "Green",
  white: "White",
};

export function ApplicationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const isPaymentStep = currentStep === 4;
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState<BackendPayment | null>(null);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<UploadedDocument | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"upi" | "card" | "testpay">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [formData, setFormData] = useState({
    projectName: "",
    sector: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    landAreaDiameter: "",
    forestLandArea: "",
    waterRequirement: "",
    pollutionCategory: "",
    environmentalImpact: "",
    biodiversityImpact: "",
    mitigationMeasures: "",
  });

  const canPreviewDocument = (doc: UploadedDocument) => doc.type === "application/pdf" || doc.type.startsWith("image/");

  const buildApplicationPayload = () => ({
    project_name: formData.projectName.trim(),
    sector: sectorToBackendSector[formData.sector] || formData.sector || "Infrastructure",
    category: categoryToBackendCategory[formData.pollutionCategory] || formData.pollutionCategory || "General",
    location: formData.location.trim(),
    location_lat: Number(formData.latitude),
    location_lng: Number(formData.longitude),
    land_area_diameter_km: Number(formData.landAreaDiameter),
    forest_land_area_ha: Number(formData.forestLandArea),
    water_requirement_kld: Number(formData.waterRequirement),
    biodiversity_impact: formData.biodiversityImpact.trim(),
    mitigation_measures: formData.mitigationMeasures.trim(),
    description: formData.description.trim(),
    impact_summary: formData.environmentalImpact.trim(),
  });

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.projectName || !formData.sector || !formData.location || !formData.description || !formData.latitude || !formData.longitude) {
        return "Complete all required project information fields.";
      }

      const lat = Number(formData.latitude);
      const lng = Number(formData.longitude);
      if (Number.isNaN(lat) || lat < -90 || lat > 90 || Number.isNaN(lng) || lng < -180 || lng > 180) {
        return "Enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180).";
      }
    }

    if (step === 2) {
      if (!formData.landAreaDiameter || !formData.forestLandArea || !formData.waterRequirement || !formData.pollutionCategory || !formData.environmentalImpact || !formData.biodiversityImpact || !formData.mitigationMeasures) {
        return "Complete all required environmental detail fields.";
      }

      if (Number(formData.landAreaDiameter) <= 0 || Number(formData.forestLandArea) < 0 || Number(formData.waterRequirement) < 0) {
        return "Enter valid numeric environmental values.";
      }
    }

    if (step === 3 && uploadedDocuments.length < 2) {
      return "Upload at least 2 supporting documents before continuing.";
    }

    if (step === 4 && !paymentRecord) {
      return "Process payment before continuing to final submission.";
    }

    return "";
  };

  const ensureDraftApplication = async () => {
    const payload = buildApplicationPayload();

    if (applicationId) {
      await workflowApi.updateApplication(applicationId, payload);
      return applicationId;
    }

    const created = await workflowApi.createApplication(payload);
    setApplicationId(created.id);
    return created.id;
  };

  const validateFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];
    const validExtensions = [".pdf", ".docx", ".png", ".jpg", ".jpeg"];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const maxSizeMb = file.type === "application/pdf" && file.name.toLowerCase().includes("eia") ? 50 : 30;

    if (!validTypes.includes(file.type) && !validExtensions.includes(extension)) {
      return "Only PDF, DOCX, PNG, and JPG files are allowed.";
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File ${file.name} exceeds ${maxSizeMb}MB.`;
    }

    return "";
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const stepError = validateStep(1) || validateStep(2);
    if (stepError) {
      setFormError(stepError);
      event.target.value = "";
      return;
    }

    for (const file of files) {
      const fileError = validateFile(file);
      if (fileError) {
        setFormError(fileError);
        event.target.value = "";
        return;
      }
    }

    try {
      setFormError("");
      setIsUploading(true);
      const draftId = await ensureDraftApplication();

      const savedDocs: UploadedDocument[] = [];
      for (const file of files) {
        const saved = await workflowApi.uploadDocument(draftId, file);
        savedDocs.push({
          id: saved.id,
          name: saved.file_name,
          type: saved.file_type,
          size: file.size,
          uploadedAt: saved.uploaded_at,
          previewUrl: URL.createObjectURL(file),
        });
      }

      setUploadedDocuments((current) => [...current, ...savedDocs]);
    } catch (error: any) {
      setFormError(error?.response?.data?.message || "Document upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const processPayment = async () => {
    try {
      setFormError("");
      setIsProcessingPayment(true);

      const draftId = await ensureDraftApplication();
      const isCard = selectedPaymentMethod === "card";
      const isUpi = selectedPaymentMethod === "upi";

      if (isCard && (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv)) {
        setFormError("Enter complete card details before processing payment.");
        return;
      }

      const method =
        selectedPaymentMethod === "card"
          ? cardData.cardNumber.replace(/\s/g, "").startsWith("4")
            ? "credit"
            : "debit"
          : selectedPaymentMethod;

      const generatedReference = `${selectedPaymentMethod.toUpperCase()}-${draftId}-${Date.now()}`;

      const payment = await workflowApi.processPayment({
        application_id: draftId,
        amount: APPLICATION_FEE,
        method,
        method_label:
          selectedPaymentMethod === "upi"
            ? "UPI"
            : selectedPaymentMethod === "card"
              ? "Card"
              : "Test Pay",
        transaction_reference: generatedReference,
        meta:
          selectedPaymentMethod === "upi"
            ? { upiId }
            : selectedPaymentMethod === "card"
              ? { ...cardData }
              : {},
      });

      setPaymentRecord(payment);
    } catch (error: any) {
      setFormError(error?.response?.data?.message || "Payment processing failed.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async () => {
    if (!applicationId || !paymentRecord) {
      setFormError("Complete payment before submitting the application.");
      return;
    }

    try {
      setFormError("");
      setIsSubmittingApplication(true);
      await ensureDraftApplication();
      await workflowApi.submitApplication(applicationId);
      setSubmittedApplicationId(applicationId);
      sessionStorage.setItem("lastSubmittedApplicationId", String(applicationId));
      setShowSuccessModal(true);
      window.setTimeout(() => navigate(`/application/${applicationId}`), 1800);
    } catch (error: any) {
      setFormError(error?.response?.data?.message || "Application submission failed.");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setFormError(error);
      return;
    }

    setFormError("");
    if (currentStep < steps.length) {
      setCurrentStep((value) => value + 1);
    }
  };

  const handlePrevious = () => {
    setFormError("");
    if (currentStep > 1) {
      setCurrentStep((value) => value - 1);
    }
  };

  const summaryRows = useMemo(
    () => [
      { label: "Project Name", value: formData.projectName || "Not provided" },
      { label: "Sector", value: sectorToBackendSector[formData.sector] || "Not provided" },
      { label: "Location", value: formData.location || "Not provided" },
      { label: "Coordinates", value: formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : "Not provided" },
      { label: "Land Area Diameter", value: formData.landAreaDiameter ? `${formData.landAreaDiameter} km` : "Not provided" },
      { label: "Forest Land Area", value: formData.forestLandArea ? `${formData.forestLandArea} ha` : "Not provided" },
      { label: "Water Requirement", value: formData.waterRequirement ? `${formData.waterRequirement} KLD` : "Not provided" },
      { label: "Pollution Category", value: categoryToBackendCategory[formData.pollutionCategory] || "Not provided" },
      { label: "Documents Uploaded", value: String(uploadedDocuments.length) },
      { label: "Payment", value: paymentRecord ? "Recorded" : "Pending" },
    ],
    [formData, uploadedDocuments.length, paymentRecord]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <DashboardHeader role="proponent" />

      <section className="relative overflow-hidden pt-8 pb-12 bg-gradient-to-br from-green-50 via-orange-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="-mt-4 mb-4">
            <BackToDashboard />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-600 rounded-full shadow-md mb-4">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-800">Environmental Clearance Application</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Apply for Clearance</h1>
            <p className="text-gray-600">Draft, upload, pay, and submit against the real backend workflow</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-gray-200 p-8">
            <div className="relative">
              <div className="absolute top-7 left-0 right-0 flex items-center px-7">
                <div className="w-full h-1 bg-gray-200 relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="relative flex items-start justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex flex-col items-center" style={{ flex: "0 0 auto", width: "20%" }}>
                      <div
                        className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-500"
                            : isCurrent
                              ? "bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-blue-500 ring-4 ring-blue-100"
                              : "bg-white border-2 border-gray-300"
                        }`}
                      >
                        {isCompleted ? <Check className="w-7 h-7 text-white" /> : <Icon className={`w-6 h-6 ${isCurrent ? "text-white" : "text-gray-400"}`} />}
                      </div>
                      <div className="mt-3 text-center px-2">
                        <div className={`text-xs font-semibold whitespace-nowrap ${isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
                          {step.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
          {!isPaymentStep && formError ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div> : null}

          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Information</h2>
                  <p className="text-gray-600">Provide basic project details</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(event) => setFormData({ ...formData, projectName: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter project name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sector *</label>
                  <select
                    value={formData.sector}
                    onChange={(event) => setFormData({ ...formData, sector: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select sector</option>
                    <option value="mining">Mining</option>
                    <option value="power">Power</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="renewable">Renewable Energy</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="realestate">Real Estate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude *</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(event) => setFormData({ ...formData, latitude: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g. 28.6139"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude *</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(event) => setFormData({ ...formData, longitude: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g. 77.2090"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description *</label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Describe your project in detail"
                />
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Environmental Details</h2>
                  <p className="text-gray-600">Provide land area, category, and impact summary</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Land Area Diameter (km) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.landAreaDiameter}
                    onChange={(event) => setFormData({ ...formData, landAreaDiameter: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Forest Land Area (ha) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.forestLandArea}
                    onChange={(event) => setFormData({ ...formData, forestLandArea: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Water Requirement (KLD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.waterRequirement}
                    onChange={(event) => setFormData({ ...formData, waterRequirement: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pollution Category *</label>
                  <select
                    value={formData.pollutionCategory}
                    onChange={(event) => setFormData({ ...formData, pollutionCategory: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="red">Red (Highly Polluting)</option>
                    <option value="orange">Orange (Moderately Polluting)</option>
                    <option value="green">Green (Low Polluting)</option>
                    <option value="white">White (Non-Polluting)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Environmental Impact Details *</label>
                <textarea
                  rows={8}
                  value={formData.environmentalImpact}
                  onChange={(event) => setFormData({ ...formData, environmentalImpact: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Describe the environmental impact and mitigation measures"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Biodiversity Impact *</label>
                <textarea
                  rows={4}
                  value={formData.biodiversityImpact}
                  onChange={(event) => setFormData({ ...formData, biodiversityImpact: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Describe biodiversity impact in/around project zone"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mitigation Measures *</label>
                <textarea
                  rows={4}
                  value={formData.mitigationMeasures}
                  onChange={(event) => setFormData({ ...formData, mitigationMeasures: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="List mitigation measures and environmental safeguards"
                />
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
                  <p className="text-gray-600">Documents are stored directly in the backend uploads folder and indexed in the database.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-10 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all cursor-pointer group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Documents *</h3>
                <p className="text-sm text-gray-600 mb-6">Accepted formats: PDF, DOCX, PNG, JPG</p>
                <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" multiple onChange={handleFileUpload} className="hidden" id="all-docs" />
                <label htmlFor="all-docs" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold cursor-pointer">
                  {isUploading ? "Uploading..." : "Choose Files"}
                </label>
              </div>

              {uploadedDocuments.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg">Uploaded Documents ({uploadedDocuments.length})</h3>
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-400 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">{Math.round(doc.size / 1024)} KB</div>
                          <div className="text-xs text-gray-400 mt-1">{new Date(doc.uploadedAt).toLocaleString()}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewDocument(doc)}
                          className="inline-flex items-center justify-center w-9 h-9 bg-gray-100 text-gray-600 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-all"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Important Information</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Minimum 2 documents required to proceed</li>
                      <li>• Uploaded files are stored on the server and linked to your draft application</li>
                      <li>• PDF/image preview is available immediately after upload</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center space-y-3">
              <h3 className="text-xl font-bold text-blue-900">Secure Payment Window Open</h3>
              <p className="text-sm text-blue-800">Complete payment in the gateway popup. After successful payment, use Continue to review your submission.</p>
            </div>
          ) : null}

          {currentStep === 5 ? (
            <div className="space-y-8 text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-xl">
                <Send className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Review & Submit Application</h2>
                <p className="text-gray-600">Final submission will move the draft into the scrutiny queue.</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 text-left space-y-6">
                <h3 className="font-bold text-gray-900 text-lg">Application Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {summaryRows.map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-200">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</span>
                      <div className="font-semibold text-gray-900 mt-1">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmittingApplication}
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmittingApplication ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          ) : null}

          {!isPaymentStep ? <div className="flex justify-between items-center pt-8 mt-8 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:shadow-lg"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : null}
          </div> : null}
        </div>
      </div>

      <GovFooter />

      {currentStep === 4 ? (
        <PaymentSection
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          cardData={cardData}
          setCardData={setCardData}
          upiId={upiId}
          setUpiId={setUpiId}
          amount={APPLICATION_FEE}
          isProcessingPayment={isProcessingPayment}
          paymentRecord={paymentRecord}
          paymentError={formError}
          onProcessPayment={processPayment}
          onBack={handlePrevious}
          onContinue={handleNext}
        />
      ) : null}

      {previewDocument ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Document Preview</h3>
                <p className="text-purple-100 text-sm mt-1">{previewDocument.name}</p>
              </div>
              <button type="button" onClick={() => setPreviewDocument(null)} className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-auto bg-gray-50">
              {canPreviewDocument(previewDocument) ? (
                previewDocument.type === "application/pdf" ? (
                  <iframe src={previewDocument.previewUrl} className="w-full h-[70vh] rounded-lg border-2 border-gray-200 bg-white" title={previewDocument.name} />
                ) : (
                  <img src={previewDocument.previewUrl} alt={previewDocument.name} className="max-h-[70vh] mx-auto rounded-lg border-2 border-gray-200 bg-white" />
                )
              ) : (
                <div className="flex items-center justify-center p-12 bg-white rounded-lg h-[400px] border-2 border-gray-200">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Preview not available for this file type.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {showSuccessModal ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
              <p className="text-lg text-gray-600 mb-6">Your application is now stored in the database and routed into scrutiny.</p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Application ID:</strong> #{submittedApplicationId}
                </p>
                <p className="text-xs text-gray-600">You are being redirected to the live application detail page.</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Opening application...</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}