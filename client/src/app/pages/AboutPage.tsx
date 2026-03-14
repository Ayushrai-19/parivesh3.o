import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { Link } from "react-router";
import { CheckCircle2, Target, Users, FileCheck, Globe, Shield, Zap, TrendingUp } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GovHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">About PARIVESH</h1>
            <p className="text-xl text-green-50">
              Pro-Active and Responsive facilitation by Interactive, Virtuous and Environmental Single-window Hub
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-green-600" />
            What is PARIVESH?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            PARIVESH is a web-based, role-based workflow application developed by the Ministry of Environment, Forest and Climate Change (MoEF&CC), Government of India. It acts as a single-window integrated environmental clearance system for various approvals required under different environmental acts and regulations.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The portal facilitates online submission and monitoring of proposals for seeking Environment, Forest, Wildlife and CRZ Clearances from Central, State and district level authorities. PARIVESH 3.0 represents the latest evolution of this system with enhanced features, improved user experience, and streamlined processes.
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
            <p className="text-sm text-gray-700">
              <strong>Ministry:</strong> Ministry of Environment, Forest and Climate Change (MoEF&CC)<br />
              <strong>Version:</strong> PARIVESH 3.0<br />
              <strong>Status:</strong> Operational since 2018, continuously upgraded
            </p>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            Key Objectives
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Streamline Process</h3>
                <p className="text-gray-600 text-sm">
                  Simplify and expedite the environmental clearance process through digitalization and automation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">
                  Ensure complete transparency in the clearance process with real-time tracking and status updates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Single Window</h3>
                <p className="text-gray-600 text-sm">
                  Provide a unified platform for all environmental clearances, reducing the need for multiple submissions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Ease of Business</h3>
                <p className="text-gray-600 text-sm">
                  Promote ease of doing business while ensuring environmental sustainability and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600" />
            Key Features of PARIVESH 3.0
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Online Application Submission",
                description: "Submit proposals online with comprehensive document upload facility and auto-validation of required information."
              },
              {
                title: "Real-time Application Tracking",
                description: "Track your application status in real-time with detailed workflow stages and expected timelines."
              },
              {
                title: "Integrated Payment Gateway",
                description: "Make online payments for application fees, processing charges, and other statutory fees securely."
              },
              {
                title: "Role-based Access Control",
                description: "Different user interfaces for Project Proponents, Scrutiny Teams, Expert Committee Members, and Administrators."
              },
              {
                title: "Document Management System",
                description: "Upload, manage, and track all project-related documents with version control and secure storage."
              },
              {
                title: "Multi-level Scrutiny Workflow",
                description: "Automated workflow management for scrutiny at Central, State, and District levels with commenting facility."
              },
              {
                title: "Public Consultation Integration",
                description: "Facilitation of public hearing processes with online notification and feedback mechanism."
              },
              {
                title: "Compliance Monitoring",
                description: "Post-clearance compliance monitoring with periodic reporting and verification mechanisms."
              },
              {
                title: "Analytics & Reports",
                description: "Comprehensive dashboards with analytics, performance metrics, and customizable reports."
              },
              {
                title: "Mobile Responsive Design",
                description: "Access the portal from any device with a fully responsive interface optimized for mobile and tablet."
              }
            ].map((feature, index) => (
              <div key={index} className="flex gap-3 items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clearances Covered */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Types of Clearances</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5 hover:border-green-500 transition-colors">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Environment Clearance (EC)</h3>
              <p className="text-gray-600 text-sm mb-3">
                Required under EIA Notification 2006 for developmental projects and activities.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mining Projects</li>
                <li>• Thermal Power Plants</li>
                <li>• Infrastructure Development</li>
                <li>• Industrial Projects</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 hover:border-green-500 transition-colors">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Forest Clearance (FC)</h3>
              <p className="text-gray-600 text-sm mb-3">
                Required under Forest Conservation Act, 1980 for diversion of forest land.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stage I Approval</li>
                <li>• Stage II (Final) Approval</li>
                <li>• Compensatory Afforestation</li>
                <li>• Net Present Value Payment</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 hover:border-green-500 transition-colors">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Wildlife Clearance</h3>
              <p className="text-gray-600 text-sm mb-3">
                Required under Wildlife Protection Act, 1972 for projects affecting wildlife habitats.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Projects in Protected Areas</li>
                <li>• Eco-Sensitive Zones</li>
                <li>• Wildlife Corridors</li>
                <li>• Critical Wildlife Habitats</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 hover:border-green-500 transition-colors">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">CRZ Clearance</h3>
              <p className="text-gray-600 text-sm mb-3">
                Required under CRZ Notification 2019 for projects in Coastal Regulation Zones.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Coastal Development Projects</li>
                <li>• Port and Harbor Activities</li>
                <li>• Tourism Infrastructure</li>
                <li>• Industrial Activities in CRZ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">PARIVESH Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-green-100 text-sm">Applications Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-green-100 text-sm">States/UTs Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">60%</div>
              <div className="text-green-100 text-sm">Processing Time Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100 text-sm">Digital Transparency</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Apply for environmental clearance or track your existing applications through our secure portal.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all"
            >
              Login to Portal
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <GovFooter />
    </div>
  );
}