import { api } from "./api";

export interface PaginationData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface BackendApplication {
  id: number;
  proponent_id: number;
  proponent_name?: string;
  project_name: string;
  sector: string;
  category: string;
  location: string;
  location_lat?: number | null;
  location_lng?: number | null;
  land_area_diameter_km?: number | null;
  forest_land_area_ha?: number | null;
  water_requirement_kld?: number | null;
  biodiversity_impact?: string | null;
  mitigation_measures?: string | null;
  description: string;
  impact_summary: string;
  status: string;
  created_at: string;
  updated_at: string;
  latest_eds_reason?: string | null;
  generated_at?: string;
}

export interface BackendDocument {
  id: number;
  application_id: number;
  file_name: string;
  file_type: string;
  uploaded_at: string;
}

export interface BackendPayment {
  id: number;
  application_id: number;
  amount: number;
  method: string;
  method_label: string;
  transaction_reference: string;
  status: string;
  failure_reason?: string | null;
  created_at: string;
}

export interface BackendTimelineAudit {
  id: number;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  timestamp: string;
  changed_by_name: string;
  changed_by_role: string;
}

export interface BackendTimelineEds {
  id: number;
  reason: string;
  created_at: string;
  resolved_at: string | null;
  raised_by_name: string;
  raised_by_role: string;
}

export interface BackendTimeline {
  audit: BackendTimelineAudit[];
  eds: BackendTimelineEds[];
}

export interface BackendGist {
  id: number;
  application_id: number;
  content: string;
  generated_at: string;
  edited_content: string | null;
  edited_by: number | null;
}

export interface BackendNotification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BackendNotificationList {
  items: BackendNotification[];
  unreadCount: number;
}

export interface AdminUser {
  id: number;
  name: string;
  login_id: string;
  email: string;
  role: "PROPONENT" | "SCRUTINY" | "MOM" | "ADMIN";
  created_at: string;
  last_login: string | null;
}

export interface MomDocumentData {
  mom_id: string;
  application_id: number;
  project_name: string;
  sector: string;
  category: string;
  location: string;
  proponent_name: string;
  content: string;
  is_locked: boolean;
  finalized_at: string | null;
  finalized_by_name: string | null;
}

export interface AdminApplication extends BackendApplication {
  generated_at: string | null;
  gist_edited: boolean;
  mom_id: number | null;
  finalized_at: string | null;
  mom_locked: boolean | null;
  mom_finalized_by_name: string | null;
  documents_count: number;
  successful_payments: number;
}

export interface AdminPayment extends BackendPayment {
  proponent_name: string;
  proponent_email: string;
  project_name: string;
  application_status: string;
}

export interface AdminPaymentsResponse {
  items: AdminPayment[];
  summary: {
    total_transactions: number;
    success_transactions: number;
    failed_transactions: number;
    successful_amount: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AdminAuditLog {
  id: number;
  application_id: number;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  changed_by_name: string | null;
  timestamp: string;
}

export interface AdminLoginActivity {
  id: number;
  user_id: number;
  role: "SCRUTINY" | "MOM";
  login_method: "STANDARD" | "QUICK";
  identifier_used: string | null;
  login_at: string;
  name: string;
  login_id: string;
  email: string;
}

export interface PublicProject {
  application_id: number;
  project_name: string;
  sector: string;
  project_location: string;
  submission_date: string;
  current_status: string;
  environmental_risk_score: number;
  environmental_risk_band: "LOW" | "MODERATE" | "HIGH";
  approval_decision: string | null;
  ai_summary: string | null;
  audit_integrity: "VERIFIED" | "UNVERIFIED" | "NOT_AVAILABLE";
  map_lat: number;
  map_lng: number;
  map_source: "EXACT_COORDINATES" | "LOCATION_HASH_FALLBACK";
  circle_radius_m: number | null;
  circle_visible: boolean;
}

export interface PublicProjectsResponse {
  items: PublicProject[];
  filters_applied: {
    sector: string | null;
    status: string | null;
    location: string | null;
  };
}

export interface PublicProjectDetail {
  application_id: number;
  project_name: string;
  sector: string;
  location: string;
  submission_date: string;
  current_status: string;
  approval_decision: string | null;
  environmental_risk_score: number;
  environmental_risk_band: "LOW" | "MODERATE" | "HIGH";
  environmental_risk_summary: string;
  ai_summary: string | null;
  mom_summary: string | null;
  audit_integrity: "VERIFIED" | "UNVERIFIED" | "NOT_AVAILABLE";
  map_lat: number;
  map_lng: number;
  map_source: "EXACT_COORDINATES" | "LOCATION_HASH_FALLBACK";
  land_area_diameter_km: number | null;
  forest_land_area_ha: number | null;
  water_requirement_kld: number | null;
  biodiversity_impact: string | null;
  mitigation_measures: string | null;
  circle_radius_m: number | null;
  circle_visible: boolean;
  workflow_progress: Array<{
    stage: string;
    order: number;
    is_current: boolean;
    is_completed: boolean;
  }>;
}

const unwrap = <T>(response: { data: { data: T } }) => response.data.data;

export const workflowApi = {
  listApplications: async (page = 1, limit = 50) => {
    const res = await api.get("/applications", { params: { page, limit } });
    return unwrap<PaginationData<BackendApplication>>(res);
  },

  getApplication: async (applicationId: number) => {
    const res = await api.get(`/applications/${applicationId}`);
    return unwrap<BackendApplication>(res);
  },

  getApplicationTimeline: async (applicationId: number) => {
    const res = await api.get(`/applications/${applicationId}/timeline`);
    return unwrap<BackendTimeline>(res);
  },

  createApplication: async (payload: {
    project_name: string;
    sector: string;
    category: string;
    location: string;
    location_lat: number;
    location_lng: number;
    land_area_diameter_km: number;
    forest_land_area_ha: number;
    water_requirement_kld: number;
    biodiversity_impact: string;
    mitigation_measures: string;
    description: string;
    impact_summary: string;
  }) => {
    const res = await api.post("/applications", payload);
    return unwrap<BackendApplication>(res);
  },

  updateApplication: async (
    applicationId: number,
    payload: {
      project_name: string;
      sector: string;
      category: string;
      location: string;
      location_lat: number;
      location_lng: number;
      land_area_diameter_km: number;
      forest_land_area_ha: number;
      water_requirement_kld: number;
      biodiversity_impact: string;
      mitigation_measures: string;
      description: string;
      impact_summary: string;
    }
  ) => {
    const res = await api.put(`/applications/${applicationId}`, payload);
    return unwrap<BackendApplication>(res);
  },

  submitApplication: async (applicationId: number) => {
    const res = await api.post(`/applications/${applicationId}/submit`);
    return unwrap<null>(res);
  },

  resubmitApplication: async (applicationId: number) => {
    const res = await api.post(`/applications/${applicationId}/resubmit`);
    return unwrap<null>(res);
  },

  listDocuments: async (applicationId: number) => {
    const res = await api.get(`/documents/application/${applicationId}`);
    return unwrap<BackendDocument[]>(res);
  },

  uploadDocument: async (applicationId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/documents/${applicationId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrap<BackendDocument>(res);
  },

  downloadDocument: async (documentId: number) => {
    const res = await api.get(`/documents/${documentId}/download`, {
      responseType: "blob",
    });
    return res;
  },

  listApplicationPayments: async (applicationId: number) => {
    const res = await api.get(`/payments/application/${applicationId}`);
    return unwrap<BackendPayment[]>(res);
  },

  processPayment: async (payload: {
    application_id: number;
    amount: number;
    method: "upi" | "debit" | "credit" | "testpay";
    method_label: string;
    transaction_reference: string;
    meta?: Record<string, unknown>;
  }) => {
    const res = await api.post("/payments/process", payload);
    return unwrap<BackendPayment>(res);
  },

  getScrutinyQueue: async () => {
    const res = await api.get("/scrutiny/queue");
    return unwrap<BackendApplication[]>(res);
  },

  startScrutiny: async (applicationId: number) => {
    const res = await api.post(`/scrutiny/${applicationId}/start`);
    return unwrap<null>(res);
  },

  raiseEds: async (applicationId: number, reason: string) => {
    const res = await api.post(`/scrutiny/${applicationId}/raise-eds`, { reason });
    return unwrap<null>(res);
  },

  referToMom: async (applicationId: number) => {
    const res = await api.post(`/scrutiny/${applicationId}/refer`);
    return unwrap<null>(res);
  },

  getMomQueue: async () => {
    const res = await api.get("/mom/queue");
    return unwrap<BackendApplication[]>(res);
  },

  getGist: async (applicationId: number) => {
    const res = await api.get(`/mom/${applicationId}/gist`);
    return unwrap<BackendGist>(res);
  },

  getApplicationGist: async (applicationId: number) => {
    const res = await api.get(`/applications/${applicationId}/gist`);
    return unwrap<BackendGist>(res);
  },

  updateGist: async (applicationId: number, edited_content: string) => {
    const res = await api.put(`/mom/${applicationId}/gist`, { edited_content });
    return unwrap<BackendGist>(res);
  },

  aiRegenerateGist: async (applicationId: number) => {
    const res = await api.post(`/mom/${applicationId}/gist/ai-regenerate`);
    return unwrap<BackendGist>(res);
  },

  aiGenerateMom: async (applicationId: number) => {
    const res = await api.post(`/mom/${applicationId}/ai-generate-mom`);
    return unwrap<{ id: number; application_id: number; content: string }>(res);
  },

  getMomDocument: async (applicationId: number) => {
    const res = await api.get(`/mom/${applicationId}/document`);
    return unwrap<MomDocumentData>(res);
  },

  updateMomContent: async (applicationId: number, content: string) => {
    const res = await api.put(`/mom/${applicationId}/content`, { content });
    return unwrap<{ id: number; application_id: number; content: string }>(res);
  },

  convertToMomDraft: async (applicationId: number) => {
    const res = await api.post(`/mom/${applicationId}/convert`);
    return unwrap<unknown>(res);
  },

  finalizeMom: async (applicationId: number) => {
    const res = await api.post(`/mom/${applicationId}/finalize`);
    return unwrap<null>(res);
  },

  downloadMomPdf: async (applicationId: number) => {
    return api.get(`/export/applications/${applicationId}/pdf`, { responseType: "blob" });
  },

  downloadMomDocx: async (applicationId: number) => {
    return api.get(`/export/applications/${applicationId}/docx`, { responseType: "blob" });
  },

  listNotifications: async () => {
    const res = await api.get("/notifications");
    return unwrap<BackendNotificationList>(res);
  },

  markNotificationRead: async (notificationId: number) => {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    return unwrap<BackendNotification>(res);
  },

  adminListUsers: async () => {
    const res = await api.get("/admin/users");
    return unwrap<AdminUser[]>(res);
  },

  adminCreateUser: async (payload: {
    name: string;
    loginId: string;
    email: string;
    password: string;
    role: "SCRUTINY" | "MOM";
  }) => {
    const res = await api.post("/admin/users", payload);
    return unwrap<AdminUser>(res);
  },

  adminListApplications: async (page = 1, limit = 100) => {
    const res = await api.get("/admin/applications", { params: { page, limit } });
    return unwrap<PaginationData<AdminApplication>>(res);
  },

  adminListPayments: async (page = 1, limit = 100) => {
    const res = await api.get("/admin/payments", { params: { page, limit } });
    return unwrap<AdminPaymentsResponse>(res);
  },

  adminListAuditLogs: async () => {
    const res = await api.get("/admin/audit-log");
    return unwrap<AdminAuditLog[]>(res);
  },

  adminListLoginActivity: async (page = 1, limit = 50) => {
    const res = await api.get("/admin/login-activity", { params: { page, limit } });
    return unwrap<PaginationData<AdminLoginActivity>>(res);
  },

  listPublicProjects: async (filters?: { sector?: string; status?: string; location?: string }) => {
    const res = await api.get("/public/projects", { params: filters || {} });
    return unwrap<PublicProjectsResponse>(res);
  },

  getPublicProjectDetail: async (applicationId: number) => {
    const res = await api.get(`/public/project/${applicationId}`);
    return unwrap<PublicProjectDetail>(res);
  },
};

export const saveBlobResponse = (response: { data: Blob; headers: Record<string, string> }, fallbackName: string) => {
  const disposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
  const fileNameMatch = disposition?.match(/filename="?([^\"]+)"?/i);
  const fileName = fileNameMatch?.[1] || fallbackName;
  const url = window.URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
};