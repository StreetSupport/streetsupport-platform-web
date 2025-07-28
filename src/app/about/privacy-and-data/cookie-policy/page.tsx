import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
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
                <span className="text-brand-f">Cookie Policy</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-2">Cookie Policy</h1>
        <p className="mt-2"><span className="italic">Effective date: 25/04/2025</span></p>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="heading-3 mb-4">Types of Cookies We Use</h2>
        <ol className="list-decimal pl-6 space-y-6">
          <li>
            <h3 className="heading-5 mb-3">Necessary Cookies</h3>
            <p>These cookies are essential for the operation of our website and cannot be turned off. They are usually set in response to actions you take, such as logging in or filling out forms. Necessary cookies do not require your consent.</p>
            <p className="font-semibold">Examples</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Session cookies for authentication</li>
              <li>Security cookies to protect against fraudulent activities</li>
            </ul>
          </li>
          <li>
            <h3 className="heading-5 mb-3">Analytics Cookies</h3>
            <p>These cookies help us analyse website traffic and user behaviour, allowing us to improve the performance and functionality of our site. We use Google Analytics and other similar services for this purpose.</p>
            <p>You can choose to accept or reject these cookies.</p>
            <p className="font-semibold">Examples:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Analytics</li>
            </ul>
          </li>
          <li>
            <h3 className="heading-5 mb-3">Advertisement Cookies</h3>
            <p>These cookies are used to track your browsing activities across websites to deliver targeted advertising tailored to your interests. We may use third-party services for this purpose.</p>
            <p>You can choose to accept or reject these cookies.</p>
            <p className="font-semibold">Examples:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Ads</li>
              <li>Social media advertising tools</li>
            </ul>
          </li>
          <li>
            <h3 className="heading-5 mb-3">Other Cookies</h3>
            <p>These cookies are used for various purposes, such as remembering your preferences or enabling specific functionalities.</p>
            <p>You can choose to accept or reject these cookies.</p>
            <p className="font-semibold">Examples:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Embedded content cookies (e.g., YouTube videos)</li>
              <li>Third-party integrations (e.g., chat support)</li>
            </ul>
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 mt-8">Managing Your Cookie Preferences</h2>
        <p>You can control your cookie preferences through our cookie banner or through your browser settings. The cookie banner will appear when you first visit our site, giving you the option to accept or reject non-essential cookies.</p>
        <p>If you wish to adjust your preferences at any time, you can do so by clicking the "Cookie Settings" link in the footer of our website or through your browser settings.</p>

        <h2 className="heading-3 mb-4">How to Control Cookies in Your Browser</h2>
        <p>Most web browsers allow you to control cookies through their settings. You can set your browser to block all cookies or to alert you when cookies are being sent. However, please note that blocking all cookies may affect the functionality of our website.</p>
        <p>For more information on how to manage cookies, you can visit the following links based on your browser:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><a href="https://support.google.com/chrome/answer/95647?hl=en" className="text-brand-a hover:text-brand-b underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-brand-a hover:text-brand-b underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-brand-a hover:text-brand-b underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-and-site-data-in-microsoft-edge-bf24c7f4-4f60-4fc7-bc10-124fa8b7d44d" className="text-brand-a hover:text-brand-b underline">Microsoft Edge</a></li>
        </ul>

        <h2 className="heading-3 mb-4">Changes to This Cookie Policy</h2>
        <p>We may update our Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Effective Date" at the top of this page. Please review this policy periodically for any updates.</p>

        <h2 className="heading-3 mb-4">Contact Us</h2>
        <p>If you have any questions about this Cookie Policy or how we use cookies, please contact us at: <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a></p>
      </div>
    </div>
  );
}