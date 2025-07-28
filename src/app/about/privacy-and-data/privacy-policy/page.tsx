import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-8 px-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-brand-l hover:text-brand-a">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <Link href="/about" className="text-brand-l hover:text-brand-a">
                  About Street Support
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <Link href="/about/privacy-and-data" className="text-brand-l hover:text-brand-a">
                  Privacy and Data
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <span className="text-brand-f">Privacy Policy</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-2 text-white">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="prose max-w-none">
        <p>Your privacy matters. Here's how we handle your data across our website, Virtual Assistant, and other digital tools. We follow UK GDPR and data protection laws to make sure your information is safe and handled properly.</p>

        <h2 className="heading-3 mb-4">What Data We Collect and Why</h2>
        <p>We collect different types of data, depending on how you interact with us:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>When you visit our website,</strong> we track general usage data (like which pages are most popular) to improve the site. We do this through cookies and analytics tools, and you can opt-out anytime.</li>
          <li><strong>If you sign up for updates or contact us,</strong> we may collect your name, email, or phone number to stay in touch.</li>
          <li><strong>When you use the Virtual Assistant,</strong> you answer questions so we can find services that match your needs. But we <strong>don't</strong> collect or store personal details like your name, address, or contact info.</li>
        </ul>
        <p>The only data we keep from the Virtual Assistant is fully anonymised and used to improve services. If you'd rather not provide any details, you can still use our website and interactive map to find support.</p>

        <h2 className="heading-3 mb-4">Our Legal Basis for Processing Your Data</h2>
        <p>We only process your data when we have a valid reason to do so under UK GDPR.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>For the Virtual Assistant, we use legitimate interest as our basis, as this processing is necessary to provide you with relevant support recommendations – which is what you're asking us to do.</li>
          <li>When sensitive information (like health needs) might be shared through the Virtual Assistant, we rely on your explicit consent, even though we don't collect or store personally identifying details.</li>
          <li>If you sign up for updates or newsletters, we'll only send these with your consent, which you can withdraw anytime.</li>
          <li>When you use our services directly, we may process data under the basis of contract to fulfill our agreement with you.</li>
        </ul>
        <p>In all cases, we only collect what's necessary and keep your privacy at the centre of what we do.</p>

        <h2 className="heading-3 mb-4">How We Use Your Information</h2>
        <p>We use the data we collect to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Connect people to relevant services and support.</li>
          <li>Improve our website, Virtual Assistant, and other digital tools.</li>
          <li>Understand service demand through anonymised data to help local authorities and partners plan better support.</li>
          <li>Send updates (if you've chosen to receive them).</li>
          <li>Keep our systems secure and running smoothly.</li>
        </ul>
        <p>We <strong>never</strong> sell, misuse, or share your data for marketing purposes.</p>

        <h2 className="heading-3 mb-4">How We Protect Your Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Any data we collect is stored securely and never shared without permission.</li>
          <li>The Virtual Assistant processes responses in real-time. Session data is automatically deleted when your session ends (or after a period of inactivity).</li>
          <li>We work with IBM Watsonx, which follows strict security standards, including encryption and compliance with UK GDPR.</li>
        </ul>
        <p>For email updates, we use Mailchimp, which processes data on secure servers in the United States. Both IBM and Mailchimp follow the UK Extension to the EU-U.S. Data Privacy Framework, ensuring your data is handled safely.</p>
        <p>You can unsubscribe from updates at any time using the link in our emails or by contacting us.</p>
        <p>Got concerns? Drop us a line at <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a></p>

        <h2 className="heading-3 mb-4">Your Rights and Subject Access Requests (SARs)</h2>
        <p>UK GDPR gives you rights over your data, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The right to access your data.</li>
          <li>The right to request corrections or deletions.</li>
          <li>The right to restrict processing.</li>
          <li>The right to data portability.</li>
          <li>Restricting or objecting to how we use your data</li>
        </ul>
        <p>But since the Virtual Assistant doesn't store personal data, if you submit a Subject Access Request, we'll confirm that no identifiable records exist.</p>
        <p>For other data we hold, contact <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>, and we'll get back to you (within one month at the latest)</p>

        <h2 className="heading-3 mb-4">How Long We Keep Your Data</h2>
        <p>We only keep data as long as we need it:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Subscription data</strong> is stored until you unsubscribe.</li>
          <li><strong>Service-related data</strong> is kept for up to six years or as required by law.</li>
          <li><strong>Website analytics data</strong> is retained for 26 months and anonymised where possible.</li>
        </ul>

        <h2 className="heading-3 mb-4">Data Transfers and Security</h2>
        <p>We take security seriously. Here's what we do:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Strict access controls</strong> so only authorised staff can handle sensitive information.</li>
          <li><strong>Regular privacy reviews</strong> to make sure we're always compliant.</li>
          <li><strong>Data is stored within the UK/EU,</strong> and we don't transfer personal data outside these regions unless it's protected under recognised frameworks.</li>
        </ul>

        <p>We use <strong>Google Analytics</strong> to understand how visitors interact with our site. This includes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The website you came from to reach ours.</li>
          <li>How long you stayed on our site.</li>
          <li>The type of device you used.</li>
        </ul>
        <p>This data isn't linked to anything that can personally identify you. If you'd rather not be tracked, you can turn off cookies in your browser or use a plugin to opt-out.</p>

        <h3 className="text-xl font-semibold mb-4">Questions or Concerns?</h3>
        <p>If you've got questions about this policy or your data, let us know. We're here to help.</p>
        <p>While Street Support Network is not required to have a designated Data Protection Officer under UK GDPR regulations, we take your privacy seriously. For any data protection concerns or inquiries, please contact our team at <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a> and we'll look into it.</p>
        <p>You can also raise concerns with the Information Commissioner's Office (ICO) at <a href="https://www.ico.org.uk" className="text-blue-600 hover:text-blue-800 underline">www.ico.org.uk</a>.</p>
        <p>We review this policy regularly to keep it up to date. If we make big changes, we'll let you know.</p>
        <p className="font-semibold">Last updated: 2nd April 2025</p>
        </div>
      </div>
    </>
  );
}