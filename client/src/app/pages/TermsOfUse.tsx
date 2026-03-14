import { PolicyLayout } from "../components/PolicyLayout";

export function TermsOfUse() {
  return (
    <PolicyLayout title="Terms of Use">
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Effective Date:</strong> March 14, 2026
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Acceptance of Terms</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By accessing and using the PARIVESH 3.0 Environmental Clearance Portal ("the Portal"), you accept and agree 
          to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Portal.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Portal Purpose</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The PARIVESH Portal is an official platform of the Ministry of Environment, Forest and Climate Change (MoEFCC), 
          Government of India, designed to facilitate:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Online submission of environmental clearance applications</li>
          <li>Application tracking and status monitoring</li>
          <li>Document management and verification</li>
          <li>Communication between applicants and regulatory authorities</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">User Obligations</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Users agree to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Provide accurate, complete, and current information</li>
          <li>Maintain the confidentiality of login credentials</li>
          <li>Use the Portal only for lawful purposes</li>
          <li>Not attempt unauthorized access or disruption of services</li>
          <li>Submit only genuine documents and information</li>
          <li>Comply with all applicable environmental laws and regulations</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Prohibited Activities</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The following activities are strictly prohibited:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Submitting false, misleading, or fraudulent information</li>
          <li>Attempting to hack, compromise, or breach security measures</li>
          <li>Using automated systems to access the Portal</li>
          <li>Sharing login credentials with unauthorized persons</li>
          <li>Interfering with other users' access to the Portal</li>
          <li>Uploading malicious software or viruses</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All content on the Portal, including text, graphics, logos, and software, is the property of the 
          Government of India and protected by intellectual property laws. Users may not reproduce, distribute, 
          or create derivative works without proper authorization.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Liability Disclaimer</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Portal is provided "as is" without warranties of any kind. The Ministry of Environment, Forest and Climate Change:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Does not guarantee uninterrupted or error-free service</li>
          <li>Is not liable for technical failures or data loss</li>
          <li>Reserves the right to modify or discontinue services</li>
          <li>Is not responsible for third-party links or content</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Data Submission and Processing</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By submitting an application, users acknowledge that:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>All submitted information may be shared with relevant authorities</li>
          <li>Application data may be used for regulatory and statistical purposes</li>
          <li>Processing times may vary based on application complexity</li>
          <li>Payments made through the Portal are non-refundable unless specified otherwise</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Account Termination</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Portal administrators reserve the right to suspend or terminate user accounts for:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Violation of these Terms of Use</li>
          <li>Fraudulent or illegal activities</li>
          <li>Extended periods of inactivity</li>
          <li>Security concerns</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Governing Law</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          These Terms of Use are governed by the laws of India. Any disputes arising from the use of the Portal 
          shall be subject to the exclusive jurisdiction of courts in New Delhi, India.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Amendments</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Ministry reserves the right to modify these Terms of Use at any time. Continued use of the Portal 
          after such modifications constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact Information</h2>
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
