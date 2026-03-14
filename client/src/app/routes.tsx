import { createBrowserRouter, Navigate, useParams } from "react-router";
import type { ReactElement } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProponentDashboard } from "./pages/ProponentDashboard";
import { ScrutinyDashboard } from "./pages/ScrutinyDashboard";
import { ScrutinyReviewPage } from "./pages/ScrutinyReviewPage";
import { MoMDashboard } from "./pages/MoMDashboard";
import { MoMViewPage } from "./pages/MoMViewPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ApplicationForm } from "./pages/ApplicationForm";
import { ApplicationDetail } from "./pages/ApplicationDetail";
import { AboutPage } from "./pages/AboutPage";
import { EnhancedTrackApplication } from "./pages/EnhancedTrackApplication";
import { SectorGuidelinesPage } from "./pages/SectorGuidelinesPage";
import { GuidelinesPage } from "./pages/GuidelinesPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFound } from "./pages/NotFound";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ComplaintsPage } from "./pages/ComplaintsPage";
import { EnvironmentalMapPage } from "./pages/EnvironmentalMapPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { PublicProjectDetailPage } from "./pages/PublicProjectDetailPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ClearanceInfoPage } from "./pages/ClearanceInfoPage";
import { useUser } from "./contexts/UserContext";

function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireRole({ role, children }: { role: "proponent" | "scrutiny" | "mom" | "admin"; children: ReactElement }) {
  const { isAuthenticated, roleKey } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roleKey !== role) {
    return <Navigate to={`/dashboard/${roleKey || "proponent"}`} replace />;
  }

  return children;
}

function RequireSelfRolePath({ children }: { children: ReactElement }) {
  const { isAuthenticated, roleKey } = useUser();
  const { role } = useParams();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roleKey || role !== roleKey) {
    return <Navigate to={`/dashboard/${roleKey || "proponent"}`} replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/track",
    Component: EnhancedTrackApplication,
  },
  {
    path: "/map",
    Component: EnvironmentalMapPage,
  },
  {
    path: "/projects",
    Component: ProjectsPage,
  },
  {
    path: "/projects/:id",
    Component: PublicProjectDetailPage,
  },
  {
    path: "/guidelines",
    Component: SectorGuidelinesPage,
  },
  {
    path: "/guidelines/:sector",
    Component: GuidelinesPage,
  },
  {
    path: "/resources/:type",
    Component: ResourcesPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/dashboard/proponent",
    Component: () => (
      <RequireRole role="proponent">
        <ProponentDashboard />
      </RequireRole>
    ),
  },
  {
    path: "/dashboard/scrutiny",
    Component: () => (
      <RequireRole role="scrutiny">
        <ScrutinyDashboard />
      </RequireRole>
    ),
  },
  {
    path: "/dashboard/scrutiny/review/:id",
    Component: () => (
      <RequireRole role="scrutiny">
        <ScrutinyReviewPage />
      </RequireRole>
    ),
  },
  {
    path: "/dashboard/mom",
    Component: () => (
      <RequireRole role="mom">
        <MoMDashboard />
      </RequireRole>
    ),
  },
  {
    path: "/dashboard/admin",
    Component: () => (
      <RequireRole role="admin">
        <AdminDashboard />
      </RequireRole>
    ),
  },
  {
    path: "/mom/:id/view",
    Component: () => (
      <RequireAuth>
        <MoMViewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/application/new",
    Component: () => (
      <RequireRole role="proponent">
        <ApplicationForm />
      </RequireRole>
    ),
  },
  {
    path: "/application/:id",
    Component: () => (
      <RequireAuth>
        <ApplicationDetail />
      </RequireAuth>
    ),
  },
  {
    path: "/dashboard/:role/applications",
    Component: () => (
      <RequireSelfRolePath>
        <ApplicationsPage />
      </RequireSelfRolePath>
    ),
  },
  {
    path: "/dashboard/:role/documents",
    Component: () => (
      <RequireSelfRolePath>
        <DocumentsPage />
      </RequireSelfRolePath>
    ),
  },
  {
    path: "/dashboard/:role/notifications",
    Component: () => (
      <RequireSelfRolePath>
        <NotificationsPage />
      </RequireSelfRolePath>
    ),
  },
  {
    path: "/dashboard/:role/profile",
    Component: () => (
      <RequireSelfRolePath>
        <ProfilePage />
      </RequireSelfRolePath>
    ),
  },
  {
    path: "/dashboard/:role/complaints",
    Component: () => (
      <RequireSelfRolePath>
        <ComplaintsPage />
      </RequireSelfRolePath>
    ),
  },
  {
    path: "/clearance/:type",
    Component: ClearanceInfoPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);