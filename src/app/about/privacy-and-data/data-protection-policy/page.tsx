import Link from 'next/link';

export default function DataProtectionPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">
                  About Street Support
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/about/privacy-and-data" className="text-gray-700 hover:text-blue-600">
                  Privacy and Data
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Data Protection Policy</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Data Protection Policy</h1>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">1. Purpose</h2>
        <p>Street Support Network (Street Support Network) is committed to protecting the personal data of its employees, volunteers, partners, and service users. This policy outlines how we comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, ensuring that personal data is handled lawfully, transparently, and securely.</p>

        <h2 className="text-2xl font-semibold mb-4">2. Scope</h2>
        <p>This policy applies to all personal data processed by Street Support Network, including data relating to employees, volunteers, partners, and service users. It covers both electronic and physical records across all Street Support Network operations, including data processed through the Street Support Network Virtual Assistant (VA).</p>

        <h2 className="text-2xl font-semibold mb-4">3. Key Principles</h2>
        <p>Street Support Network processes personal data in line with the following principles:</p>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>Lawfulness, Fairness, and Transparency:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Personal data is processed lawfully and in a transparent manner.</li>
            </ul>
          </li>
          <li>
            <strong>Purpose Limitation:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Data is collected for specific, explicit, and legitimate purposes and not further processed in a way incompatible with those purposes.</li>
            </ul>
          </li>
          <li>
            <strong>Data Minimisation:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Only data necessary for the purposes described is collected and processed.</li>
            </ul>
          </li>
          <li>
            <strong>Accuracy:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Data is accurate and kept up-to-date. Inaccurate data is rectified or deleted promptly.</li>
            </ul>
          </li>
          <li>
            <strong>Storage Limitation:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Personal data is retained only for as long as necessary and securely destroyed thereafter.</li>
            </ul>
          </li>
          <li>
            <strong>Security:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Appropriate measures protect data against unauthorized access, loss, or destruction.</li>
            </ul>
          </li>
          <li>
            <strong>Accountability:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>Street Support Network demonstrates compliance with data protection obligations through appropriate policies, training, and documentation.</li>
            </ul>
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">4. Roles and Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-4">
          <li>
            <strong>Employees and Volunteers:</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>All staff and volunteers must handle personal data responsibly and in line with this policy.</li>
              <li>Report any data breaches or concerns to the designated contact immediately.</li>
            </ul>
          </li>
          <li>
            <strong>Data Protection Lead (DPL):</strong>
            <ul className="list-disc pl-6 mt-2">
              <li>As a small charity, Street Support Network does not require a Data Protection Officer but designates a member of staff as the Data Protection Lead. The DPL oversees compliance, manages data requests, and handles data breaches. The DPL is the Managing Director of Street Support Network.</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">5. Lawful Basis for Processing</h2>
        <p>Street Support Network processes personal data under one or more of the following lawful bases:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Consent: Individuals have given clear consent.</li>
          <li>Contract: Data is necessary to fulfill a contract or agreement.</li>
          <li>Legal Obligation: Processing is necessary to comply with legal requirements.</li>
          <li>Legitimate Interests: Processing is necessary for Street Support Network's legitimate interests and does not override individuals' rights.</li>
        </ul>
        <p>For the Virtual Assistant, processing is based on legitimate interest (for matching individuals with services) and explicit consent (for special category data such as health or support needs).</p>

        <h2 className="text-2xl font-semibold mb-4">6. Data Transfers & Third-Party Processing</h2>
        <p>Street Support Network works with third-party providers to ensure the highest level of data security and compliance. This includes our partnership with IBM Watsonx, which powers the Virtual Assistant (VA).</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>No personally identifiable information (PII) is collected or stored by the VA.</li>
          <li>Any data processed is handled using private variables and is deleted after the session ends.</li>
          <li>Anonymised data may be retained for statistical analysis but cannot be linked back to individuals.</li>
          <li>IBM Watsonx follows the UK extension of the Data Privacy Framework, ensuring compliance with UK GDPR and international data protection laws.</li>
          <li>Data is stored securely within the UK/EU, and no personal data is transferred outside these jurisdictions.</li>
        </ul>
        <p>Street Support Network reviews third-party compliance documentation regularly to ensure ongoing adherence to data protection standards.</p>

        <h2 className="text-2xl font-semibold mb-4">7. Data Subject Rights & Subject Access Requests (SARs)</h2>
        <p>Individuals have the following rights regarding their personal data:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Right to Access:</strong> Request access to their personal data (Subject Access Requests must be responded to within one month).</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Right to Erasure:</strong> Request deletion of data where it is no longer necessary.</li>
          <li><strong>Right to Restrict Processing:</strong> Request limited processing in specific circumstances.</li>
          <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
          <li><strong>Data Portability:</strong> Request transfer of their data to another organisation, if applicable.</li>
        </ul>
        <p>For the Virtual Assistant, as no personally identifiable data is stored, SAR requests will be met with confirmation that Street Support Network does not retain user data from the VA. This will be clearly communicated in the privacy notice and VA interface.</p>

        <h2 className="text-2xl font-semibold mb-4">8. Data Security</h2>
        <p>Street Support Network implements strong security measures, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Street Support Network uses appropriate technical and organizational measures to safeguard personal data.</li>
          <li>Access to data is restricted to authorised personnel only.</li>
          <li>Employees are responsible for keeping their workspaces and devices secure.</li>
          <li>Two-factor authentication is used where available.</li>
        </ul>
        <p>For any concerns related to data security or compliance, please contact the Data Protection Lead (DPL) at <a href="mailto:admin@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">admin@streetsupport.net</a>.</p>

        <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
        <p>Street Support Network retains personal data only as long as necessary for the purposes for which it was collected. A detailed retention schedule is maintained below and reviewed regularly.</p>
        
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Data Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Retention Period</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Legal Basis / Guidance</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Reason for Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Employee Records</td>
                <td className="border border-gray-300 px-4 py-2">6 years after employment ends</td>
                <td className="border border-gray-300 px-4 py-2">Limitation Act 1980, ACAS guidance</td>
                <td className="border border-gray-300 px-4 py-2">Defence against potential claims</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Payroll and Tax Records</td>
                <td className="border border-gray-300 px-4 py-2">6 years</td>
                <td className="border border-gray-300 px-4 py-2">HMRC guidelines</td>
                <td className="border border-gray-300 px-4 py-2">Taxation and audit purposes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Service User Records</td>
                <td className="border border-gray-300 px-4 py-2">6 years after last interaction</td>
                <td className="border border-gray-300 px-4 py-2">Limitation Act 1980, safeguarding best practice</td>
                <td className="border border-gray-300 px-4 py-2">Record of services provided, safeguarding</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Complaints Records</td>
                <td className="border border-gray-300 px-4 py-2">6 years after resolution</td>
                <td className="border border-gray-300 px-4 py-2">Limitation Act 1980</td>
                <td className="border border-gray-300 px-4 py-2">Defence against potential claims</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Health and Safety Records</td>
                <td className="border border-gray-300 px-4 py-2">3 years after the date of incident</td>
                <td className="border border-gray-300 px-4 py-2">Health and Safety at Work Act 1974</td>
                <td className="border border-gray-300 px-4 py-2">Legal defence in case of incident claims</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Financial Records</td>
                <td className="border border-gray-300 px-4 py-2">6 years</td>
                <td className="border border-gray-300 px-4 py-2">Companies Act 2006, HMRC</td>
                <td className="border border-gray-300 px-4 py-2">Statutory reporting and audit</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Marketing Preferences</td>
                <td className="border border-gray-300 px-4 py-2">Until consent is withdrawn</td>
                <td className="border border-gray-300 px-4 py-2">UK GDPR</td>
                <td className="border border-gray-300 px-4 py-2">Ongoing communication management</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mb-4">10. Data Breaches</h2>
        <p>In the event of a data breach:</p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Notify the DPL immediately.</li>
          <li>The DPL will assess the breach and, if required, report it to the Information Commissioner's Office (ICO) within 72 hours.</li>
          <li>Affected individuals will be informed if the breach poses a significant risk to their rights.</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">11. Training</h2>
        <p>All employees and volunteers are provided with basic data protection training to ensure they understand their responsibilities.</p>

        <h2 className="text-2xl font-semibold mb-4">12. Privacy Notices</h2>
        <p>Street Support Network provides clear and accessible privacy notices explaining how personal data is collected, used, and stored.</p>

        <h2 className="text-2xl font-semibold mb-4">13. Monitoring and Review</h2>
        <p>This policy is reviewed annually or when significant changes to data protection laws occur.</p>
        <p>For any questions or concerns, please contact <a href="mailto:admin@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">admin@streetsupport.net</a>.</p>
        <p>This policy ensures that Street Support Network remains compliant with UK GDPR while protecting the privacy and security of all individuals interacting with our services, including the Virtual Assistant.</p>
        <p className="italic mt-6">Last updated: 2nd April 2025</p>
      </div>
    </div>
  );
}