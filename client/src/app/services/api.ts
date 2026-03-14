import axios from "axios";

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
const apiBaseUrl = viteEnv?.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("parivesh_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type BackendRole = "ADMIN" | "PROPONENT" | "SCRUTINY" | "MOM";

export interface BackendUser {
  id: number;
  name: string;
  loginId: string;
  email: string;
  role: BackendRole;
}

export interface LoginResponse {
  token: string;
  user: BackendUser;
}

export const authApi = {
  login: async (payload: {
    role: BackendRole;
    password: string;
    email?: string;
    loginId?: string;
    faceImage?: string;
    faceImages?: string[];
  }): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", payload);
    return res.data.data;
  },

  registerProponent: async (payload: {
    name: string;
    loginId: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  adminPrecheck: async (payload: { loginId: string; password: string }) => {
    const res = await api.post("/auth/admin/precheck", payload);
    return res.data.data as {
      preAuthToken: string;
      admin: { id: number; name: string; loginId: string };
    };
  },

  adminFaceLogin: async (payload: {
    preAuthToken: string;
    faceImage?: string;
    faceImages?: string[];
  }): Promise<LoginResponse> => {
    const res = await api.post("/auth/admin/face-login", payload);
    return res.data.data;
  },

  quickLogin: async (payload: {
    role: BackendRole;
    loginId?: string;
    email?: string;
  }): Promise<LoginResponse> => {
    const res = await api.post("/auth/quick-login", payload);
    return res.data.data;
  },
};
