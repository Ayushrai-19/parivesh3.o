import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Bell, 
  User, 
  LogOut,
  MessageSquare
} from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { GovFooter } from "./GovFooter";
import { useUser } from "../contexts/UserContext";

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useUser();
  const location = useLocation();
  const dashboardPath = `/dashboard/${role}`;
  
  // Mock unread counts - in real app, these would come from API/state
  const unreadNotifications = 3;
  
  const allNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: dashboardPath },
    { icon: FileText, label: "Applications", path: `${dashboardPath}/applications` },
    { icon: FolderOpen, label: "Documents", path: `${dashboardPath}/documents` },
    { icon: MessageSquare, label: "Complaints", path: `${dashboardPath}/complaints` },
    { icon: Bell, label: "Notifications", path: `${dashboardPath}/notifications`, badge: unreadNotifications },
    { icon: User, label: "Profile", path: `${dashboardPath}/profile` },
  ];

  // Filter out Documents for scrutiny team, proponent, and MoM team
  const navItems = (role === 'scrutiny' || role === 'proponent' || role === 'mom')
    ? allNavItems.filter(item => item.label !== 'Documents')
    : allNavItems;
  
  const roleNames = {
    proponent: "Project Proponent",
    scrutiny: "Scrutiny Officer",
    mom: "MoM Team Member",
    admin: "System Administrator"
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader role={role} />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-180px)]">
          <div className="p-4 bg-[#2a7f3e] text-white">
            <div className="text-xs uppercase tracking-wide mb-1">Welcome</div>
            <div className="font-semibold text-sm">{roleNames[role as keyof typeof roleNames]}</div>
          </div>
          
          <nav className="p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded mb-1 transition-colors ${
                    isActive
                      ? "bg-[#e8f5e9] text-[#2a7f3e] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Government Footer */}
      <GovFooter />
    </div>
  );
}