import { PolicyLayout } from "../components/PolicyLayout";

export function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated:</strong> March 14, 2026
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Introduction</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The PARIVESH 3.0 Environmental Clearance Portal is committed to protecting the privacy of its users. 
          This Privacy Policy outlines how we collect, use, maintain, and disclose information collected from 
          users of the PARIVESH portal.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Information We Collect</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We collect the following types of information:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li><strong>Personal Information:</strong> Name, email address, phone number, and organization details during registration.</li>
          <li><strong>Project Information:</strong> Details related to environmental clearance applications including project location, sector, and documentation.</li>
          <li><strong>Technical Data:</strong> IP addresses, browser type, device information, and usage statistics.</li>
          <li><strong>Authentication Data:</strong> Login credentials and session information for secure access.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">How We Use Your Information</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The information collected is used for:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Processing environmental clearance applications</li>
          <li>Communicating updates and notifications regarding application status</li>
          <li>Maintaining and improving portal functionality</li>
          <li>Ensuring compliance with regulatory requirements</li>
          <li>Generating reports and analytics for administrative purposes</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Data Security</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We implement appropriate security measures to protect your personal information:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>256-bit SSL encryption for data transmission</li>
          <li>Secure data storage compliant with Government of India IT guidelines</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and authentication mechanisms</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Information Sharing</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Your information may be shared with:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Relevant government departments and regulatory authorities</li>
          <li>Expert appraisal committees for application review</li>
          <li>State pollution control boards and environmental agencies</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-4">
          We do not sell, trade, or otherwise transfer personal information to external parties except as required by law.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">User Rights</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Access and review your personal information</li>
          <li>Request corrections to inaccurate data</li>
          <li>Withdraw consent for data processing (subject to legal requirements)</li>
          <li>Lodge complaints regarding privacy concerns</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Cookies and Tracking</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The portal uses cookies to enhance user experience and maintain session information. 
          Users can configure their browser to refuse cookies, though this may limit portal functionality.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Changes to Privacy Policy</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          This Privacy Policy may be updated periodically to reflect changes in practices or legal requirements. 
          Users will be notified of significant changes through the portal.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact Information</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          For privacy-related queries or concerns, please contact:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
          <p className="text-gray-800 font-semibold">Ministry of Environment, Forest and Climate Change</p>
          <p className="text-gray-700">Indira Paryavaran Bhawan, Jor Bagh Road</p>
          <p className="text-gray-700">New Delhi - 110003</p>
          <p className="text-gray-700 mt-2">Toll Free: 1800 11 9792</p>
          <p className="text-gray-700">Email: support@parivesh.gov.in</p>
        </div>
      </div>
    </PolicyLayout>
  );
}
