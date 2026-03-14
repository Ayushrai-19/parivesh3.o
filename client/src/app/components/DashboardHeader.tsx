import { Link } from "react-router";
import { Bell, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import logoImage from "figma:asset/04582d5cbcbafd55748615841a24afdf6cfa7d0a.png";
import ashokaEmblem from "figma:asset/d09de3ba78e982abed5ab03d64b5dbaa652c1af6.png";
import lifeLogoImage from "figma:asset/c075961db3daee7ff788be26beebbb6be6fd8f13.png";

interface DashboardHeaderProps {
  role: string;
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [language, setLanguage] = useState<"English" | "हिंदी">("English");
  const { user, logout } = useUser();

  // Get the first name for avatar initial
  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  const roleNames = {
    proponent: "Project Proponent",
    scrutiny: "Scrutiny Officer",
    mom: "MoM Team Member",
    admin: "System Administrator"
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "English" | "हिंदी");
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b-4 border-orange-500 shadow-md sticky top-0 z-50">
      <div className="w-full px-6">
        <div className="flex items-center justify-between py-3">
          {/* Government Emblem & Title */}
          <div className="flex items-center gap-4">
            {/* Official Logo */}
            <div className="flex-shrink-0">
              <img 
                src={logoImage}
                alt="Ministry of Environment, Forest and Climate Change"
                className="h-16"
              />
            </div>
            
            <div className="border-l-2 border-gray-300 pl-4">
              <div className="text-sm font-semibold text-orange-600 mt-0.5">
                PARIVESH 3.0 - Environmental Clearance Portal
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {roleNames[role as keyof typeof roleNames]} Dashboard
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Government Logos */}
            <div className="flex items-center gap-3 mr-4 border-r pr-4 border-gray-300">
              <img 
                src={ashokaEmblem}
                alt="Emblem of India - Satyameva Jayate"
                className="h-14 opacity-90 hover:opacity-100 transition-opacity"
              />
              <img 
                src={lifeLogoImage}
                alt="LiFE - Lifestyle for Environment"
                className="h-16 opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            
            {/* Notifications */}
            <Link
              to={`/dashboard/${role}/notifications`}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Language Selector */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="English">English</option>
              <option value="हिंदी">हिंदी</option>
            </select>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#2a7f3e] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getInitial()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || "User"}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <Link
                    to={`/dashboard/${role}/profile`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}