import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { BackendRole, BackendUser, LoginResponse } from "../services/api";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  organization: string;
  designation: string;
  address: string;
  registeredDate: string;
  role: string;
  roleDescription: string;
  // Role-specific stats
  totalApplications?: number;
  approvedApplications?: number;
  pendingApplications?: number;
  applicationsReviewed?: number;
  edsRequested?: number;
  applicationsReferred?: number;
  gistsGenerated?: number;
  momsFinalized?: number;
  meetingsAttended?: number;
  totalUsers?: number;
  templatesManaged?: number;
  systemUptime?: string;
}

interface UserContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  roleKey: string;
  setUser: (user: UserProfile) => void;
  loginWithBackend: (payload: LoginResponse) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default profiles by role
const defaultProfilesByRole: Record<string, UserProfile> = {
  proponent: {
    name: "Rajesh Kumar",
    email: "proponent@demo.com",
    phone: "+91 98765 43210",
    organization: "Green Energy Ltd.",
    designation: "Project Manager",
    address: "A-123, Sector 18, Noida, Uttar Pradesh - 201301",
    registeredDate: "2025-12-15",
    role: "Project Proponent",
    roleDescription: "Submit and track environmental clearance applications",
    totalApplications: 12,
    approvedApplications: 5,
    pendingApplications: 7,
  },
  scrutiny: {
    name: "Dr. Priya Sharma",
    email: "scrutiny@demo.com",
    phone: "+91 98765 43211",
    organization: "Ministry of Environment",
    designation: "Scrutiny Officer",
    address: "Indira Paryavaran Bhawan, Jor Bagh Road, New Delhi - 110003",
    registeredDate: "2024-06-20",
    role: "Scrutiny Officer",
    roleDescription: "Review applications and verify compliance documents",
    applicationsReviewed: 245,
    edsRequested: 32,
    applicationsReferred: 198,
  },
  mom: {
    name: "Amit Patel",
    email: "mom@demo.com",
    phone: "+91 98765 43212",
    organization: "Ministry of Environment",
    designation: "MoM Team Member",
    address: "Indira Paryavaran Bhawan, Jor Bagh Road, New Delhi - 110003",
    registeredDate: "2024-08-10",
    role: "MoM Team Member",
    roleDescription: "Generate and finalize meeting minutes",
    gistsGenerated: 67,
    momsFinalized: 45,
    meetingsAttended: 89,
  },
  admin: {
    name: "Sunita Verma",
    email: "admin@demo.com",
    phone: "+91 98765 43213",
    organization: "Ministry of Environment",
    designation: "System Administrator",
    address: "Indira Paryavaran Bhawan, Jor Bagh Road, New Delhi - 110003",
    registeredDate: "2023-03-05",
    role: "System Administrator",
    roleDescription: "Manage users, templates, and system settings",
    totalUsers: 1247,
    templatesManaged: 18,
    systemUptime: "99.8%",
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("parivesh_token"));
  const [user, setUserState] = useState<UserProfile | null>(null);

  // Initialize user from localStorage or use default
  useEffect(() => {
    const storedUser = localStorage.getItem("parivesh_user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    } else {
      setUserState(null);
    }
  }, []);

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    localStorage.setItem("parivesh_user", JSON.stringify(newUser));
  };

  const backendRoleToRouteKey = (role: BackendRole): string => {
    if (role === "ADMIN") return "admin";
    if (role === "PROPONENT") return "proponent";
    if (role === "SCRUTINY") return "scrutiny";
    if (role === "MOM") return "mom";
    return "proponent";
  };

  const mapBackendUserToProfile = (backendUser: BackendUser): UserProfile => {
    const roleKey = backendRoleToRouteKey(backendUser.role);
    const defaults = defaultProfilesByRole[roleKey] || defaultProfilesByRole.proponent;

    return {
      ...defaults,
      name: backendUser.name,
      email: backendUser.email,
      role:
        backendUser.role === "ADMIN"
          ? "System Administrator"
          : backendUser.role === "PROPONENT"
            ? "Project Proponent"
            : backendUser.role === "SCRUTINY"
              ? "Scrutiny Officer"
              : "MoM Team Member",
    };
  };

  const loginWithBackend = (payload: LoginResponse) => {
    const mappedProfile = mapBackendUserToProfile(payload.user);
    setToken(payload.token);
    localStorage.setItem("parivesh_token", payload.token);
    setUser(mappedProfile);
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem("parivesh_token");
    localStorage.removeItem("parivesh_user");
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUserState(updatedUser);
      localStorage.setItem("parivesh_user", JSON.stringify(updatedUser));
    }
  };

  const roleKey = user?.role?.toLowerCase().includes("admin")
    ? "admin"
    : user?.role?.toLowerCase().includes("scrutiny")
      ? "scrutiny"
      : user?.role?.toLowerCase().includes("mom")
        ? "mom"
        : "proponent";

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        roleKey,
        setUser,
        loginWithBackend,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper function to get default profile by role
export function getDefaultProfileByRole(role: string): UserProfile {
  return defaultProfilesByRole[role] || defaultProfilesByRole.proponent;
}
