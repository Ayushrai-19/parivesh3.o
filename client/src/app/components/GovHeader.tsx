import { Link } from "react-router";
import { Bell, Search, Menu, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import logoImage from "figma:asset/04582d5cbcbafd55748615841a24afdf6cfa7d0a.png";
import ashokaEmblem from "figma:asset/d09de3ba78e982abed5ab03d64b5dbaa652c1af6.png";
import lifeLogoImage from "figma:asset/c075961db3daee7ff788be26beebbb6be6fd8f13.png";

const translations = {
  English: {
    skipToContent: "Skip to main content",
    screenReader: "Screen Reader Access",
    fontSize: "Font Size:",
    title: "PARIVESH 3.0 - Environmental Clearance Portal",
    login: "Login",
    home: "Home",
    about: "About PARIVESH",
    apply: "Apply for Clearance",
    dashboard: "Dashboard",
    track: "Track Application",
    guidelines: "Guidelines",
    contact: "Contact Us"
  },
  "हिंदी": {
    skipToContent: "मुख्य सामग्री पर जाएं",
    screenReader: "स्क्रीन रीडर एक्सेस",
    fontSize: "फ़ॉन्ट का आकार:",
    title: "परिवेश 3.0 - पर्यावरण मंजूरी पोर्टल",
    login: "लॉगिन करें",
    home: "मुख्य पृष्ठ",
    about: "परिवेश के बारे में",
    apply: "मंजूरी के लिए आवेदन करें",
    dashboard: "डैशबोर्ड",
    track: "आवेदन ट्रैक करें",
    guidelines: "दिशानिर्देश",
    contact: "संपर्क करें"
  }
};

export function GovHeader() {
  const [language, setLanguage] = useState<"English" | "हिंदी">("English");
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const t = translations[language];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "English" | "हिंदी");
  };

  return (
    <>
      {/* Main Government Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            {/* Government Emblem & Title */}
            <Link to="/" className="flex items-center gap-4">
              {/* Official Logo */}
              <div className="flex-shrink-0">
                <img 
                  src={logoImage}
                  alt="Ministry of Environment, Forest and Climate Change"
                  className="h-16"
                />
              </div>
              
              <div className="border-l-2 border-gray-300 pl-4">
                <div className="text-sm font-semibold text-orange-600 mt-0.5">{t.title}</div>
              </div>
            </Link>
            
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
              
              {/* Search Bar Toggle */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                {showSearchBar ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Search className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              {/* Register Button */}
              <Link
                to="/register"
                className="px-6 py-2 text-sm font-semibold text-green-700 bg-white border-2 border-green-600 rounded hover:bg-green-50 transition-all"
              >
                Register
              </Link>
              
              {/* Login Button */}
              <Link
                to="/login"
                className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-green-600 rounded hover:shadow-lg transition-all"
              >
                {t.login}
              </Link>
            </div>
          </div>
          
          {/* Smart Search Bar */}
          {showSearchBar && (
            <div className="pb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for applications, guidelines, documents..."
                  className="w-full px-4 py-3 pr-12 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 border-b border-green-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 bg-[#130fff00]">
          <div className="flex items-center justify-between bg-[#5405ff00]">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors border-b-2 border-transparent hover:border-white"
              >
                {t.home}
              </Link>
              
              <Link
                to="/track"
                className="px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors border-b-2 border-transparent hover:border-white"
              >
                Track Application
              </Link>
              
              <Link
                to="/projects"
                className="px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors border-b-2 border-transparent hover:border-white"
              >
                Projects
              </Link>
              
              {/* Resources Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowResourcesDropdown(true)}
                onMouseLeave={() => setShowResourcesDropdown(false)}
              >
                <button className="px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors border-b-2 border-transparent hover:border-white flex items-center gap-1">
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showResourcesDropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-2xl rounded-lg mt-0 py-2 min-w-[240px] z-50 border border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Help & Documentation
                    </div>
                    <Link to="/guidelines" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      Guidelines
                    </Link>
                    <Link to="/resources/policies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      Policies
                    </Link>
                    <Link to="/resources/user-manual" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      User Manual
                    </Link>
                    <Link to="/resources/faqs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      FAQs
                    </Link>
                    <Link to="/resources/training-videos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      Training Videos
                    </Link>
                  </div>
                )}
              </div>
              
              <Link
                to="/about"
                className="px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors border-b-2 border-transparent hover:border-white"
              >
                About PARIVESH
              </Link>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center">
              <select 
                className="text-sm border border-white/30 rounded px-3 py-2 bg-white/10 text-white font-medium hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50" 
                value={language} 
                onChange={handleLanguageChange}
              >
                <option className="text-gray-900">English</option>
                <option className="text-gray-900">हिंदी</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}