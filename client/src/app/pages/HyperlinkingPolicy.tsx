import { PolicyLayout } from "../components/PolicyLayout";

export function HyperlinkingPolicy() {
  return (
    <PolicyLayout title="Hyperlinking Policy">
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Version:</strong> 1.0 | <strong>Last Updated:</strong> March 14, 2026
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Introduction</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          This Hyperlinking Policy governs the creation of hyperlinks to and from the PARIVESH 3.0 Environmental 
          Clearance Portal. The policy is designed to protect the integrity of government information and ensure 
          appropriate use of Portal content.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Links to PARIVESH Portal</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          External websites may link to the PARIVESH Portal without prior permission, subject to the following conditions:
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Permitted Linking Practices</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Links should direct to the Portal's homepage (https://parivesh.gov.in) or specific public pages</li>
          <li>The link should clearly identify the PARIVESH Portal as the destination</li>
          <li>Links should open in a new browser window or tab</li>
          <li>The appearance and content of the Portal must not be altered through framing or other methods</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Prohibited Linking Practices</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Deep linking to restricted or password-protected pages without authorization</li>
          <li>Framing the Portal content within another website</li>
          <li>Implying endorsement or affiliation with the Ministry without proper authorization</li>
          <li>Using Portal logos or official emblems without permission</li>
          <li>Linking from websites containing illegal, offensive, or misleading content</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Links from PARIVESH Portal</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Portal may contain hyperlinks to external websites operated by government agencies, research institutions, 
          or other relevant organizations. These links are provided for user convenience and informational purposes.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Disclaimer for External Links</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>The Ministry does not control or endorse the content of linked external websites</li>
          <li>Users access external websites at their own risk</li>
          <li>The Ministry is not responsible for the accuracy, legality, or content of external sites</li>
          <li>External links do not constitute an official endorsement or approval</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Use of Government Emblems and Logos</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The following symbols and logos are protected by law and may not be used without proper authorization:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>State Emblem of India (Ashoka Emblem)</li>
          <li>PARIVESH logo and branding</li>
          <li>Ministry of Environment, Forest and Climate Change logos</li>
          <li>Government of India official emblems</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-4">
          Unauthorized use of these symbols may result in legal action under the State Emblem of India (Prohibition 
          of Improper Use) Act, 2005, and other applicable laws.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Content Reproduction and Attribution</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          When linking to or reproducing Portal content:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Proper attribution must be provided citing the PARIVESH Portal and the Ministry</li>
          <li>Content should not be altered or presented out of context</li>
          <li>Commercial use of Portal content requires prior written permission</li>
          <li>The source URL should be clearly mentioned</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Link Monitoring and Removal</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Ministry reserves the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Request removal of links that violate this policy</li>
          <li>Remove or modify external links from the Portal at any time</li>
          <li>Take legal action against unauthorized or improper linking</li>
          <li>Update this policy without prior notice</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Permission Requests</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          For special linking arrangements, use of logos, or commercial purposes, please submit a formal request to:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
          <p className="text-gray-800 font-semibold">Web Information Manager</p>
          <p className="text-gray-800 font-semibold">Ministry of Environment, Forest and Climate Change</p>
          <p className="text-gray-700">Indira Paryavaran Bhawan, Jor Bagh Road</p>
          <p className="text-gray-700">New Delhi - 110003</p>
          <p className="text-gray-700 mt-2">Email: webmaster@parivesh.gov.in</p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Compliance</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          This policy is formulated in accordance with the Government of India's guidelines on hyperlinking and 
          follows the Framework of Websites of the Government of India issued by the Department of Administrative 
          Reforms and Public Grievances.
        </p>
      </div>
    </PolicyLayout>
  );
}
