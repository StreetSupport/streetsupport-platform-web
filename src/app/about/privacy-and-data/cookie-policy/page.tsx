'use client';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function CookiePolicyPage() {
  const { openPreferences } = useCookieConsent();

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { href: "/about/privacy-and-data", label: "Privacy and Data" },
          { label: "Cookie Policy", current: true }
        ]}
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">Cookie Policy</h1>
          <p className="mt-2 text-white"><span className="italic">Effective date: 7 February 2026</span></p>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            {/* Manage Preferences Button */}
            <div className="mb-8 p-4 bg-brand-n rounded-lg">
              <p className="mb-3 text-white">
                You can manage your cookie preferences at any time using the button below.
              </p>
              <button
                type="button"
                onClick={openPreferences}
                className="btn-base btn-secondary btn-sm"
              >
                Manage Cookie Preferences
              </button>
            </div>

            <section className="mb-8">
              <p className="text-body mb-4">The UK Data (Use and Access) Act 2025, which came into force on 5 February 2026, introduced a statutory exception allowing the use of analytics cookies without prior consent, provided that users are clearly informed and given a straightforward way to opt out. We rely on this lawful basis for our analytics cookies.</p>
              <p className="text-body">Functional cookies (such as the Watson Assistant chat widget) continue to require your explicit consent before being set.</p>
            </section>

            <h2 className="heading-2 mb-6 text-brand-l">Types of Cookies We Use</h2>

            {/* Necessary Cookies */}
            <section className="mb-8">
              <h3 className="heading-3 mb-4">1. Necessary Cookies</h3>
              <p className="text-body mb-4">These cookies are essential for the operation of our website and cannot be turned off. They are usually set in response to actions you take, such as setting your privacy preferences or using core site features. Necessary cookies do not require your consent.</p>

              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-brand-f text-sm">
                  <thead className="bg-brand-n text-white">
                    <tr>
                      <th className="border border-brand-f px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Provider</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Purpose</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">ss_cookie_consent</td>
                      <td className="border border-brand-f px-4 py-2">Street Support</td>
                      <td className="border border-brand-f px-4 py-2">Stores your cookie consent preferences</td>
                      <td className="border border-brand-f px-4 py-2">Persistent (localStorage)</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">findHelpSearchState</td>
                      <td className="border border-brand-f px-4 py-2">Street Support</td>
                      <td className="border border-brand-f px-4 py-2">Remembers your search filters during the session</td>
                      <td className="border border-brand-f px-4 py-2">Session (sessionStorage)</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">Google Maps cookies</td>
                      <td className="border border-brand-f px-4 py-2">Google</td>
                      <td className="border border-brand-f px-4 py-2">Required for the interactive &quot;Find Help&quot; map functionality</td>
                      <td className="border border-brand-f px-4 py-2">Varies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Analytics Cookies */}
            <section className="mb-8">
              <h3 className="heading-3 mb-4">2. Analytics Cookies</h3>
              <p className="text-body mb-4">These cookies help us analyse website traffic and user behaviour, allowing us to improve the performance and functionality of our site. We use Google Analytics for this purpose.</p>
              <p className="text-body mb-4">Under the UK Data (Use and Access) Act 2025, analytics cookies are active by default as they fall within the statutory exception for audience measurement. You do not need to give prior consent for these cookies, but you can opt out at any time via the cookie notice banner or by clicking &quot;Manage Cookie Preferences&quot; above.</p>

              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-brand-f text-sm">
                  <thead className="bg-brand-n text-white">
                    <tr>
                      <th className="border border-brand-f px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Provider</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Purpose</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">_ga</td>
                      <td className="border border-brand-f px-4 py-2">Google Analytics</td>
                      <td className="border border-brand-f px-4 py-2">Distinguishes unique users by assigning a randomly generated number</td>
                      <td className="border border-brand-f px-4 py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">_ga_*</td>
                      <td className="border border-brand-f px-4 py-2">Google Analytics</td>
                      <td className="border border-brand-f px-4 py-2">Maintains session state across page requests</td>
                      <td className="border border-brand-f px-4 py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">_gid</td>
                      <td className="border border-brand-f px-4 py-2">Google Analytics</td>
                      <td className="border border-brand-f px-4 py-2">Distinguishes users for analytics purposes</td>
                      <td className="border border-brand-f px-4 py-2">24 hours</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">_gat</td>
                      <td className="border border-brand-f px-4 py-2">Google Analytics</td>
                      <td className="border border-brand-f px-4 py-2">Throttles request rate to limit data collection on high-traffic sites</td>
                      <td className="border border-brand-f px-4 py-2">1 minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Functional Cookies */}
            <section className="mb-8">
              <h3 className="heading-3 mb-4">3. Functional Cookies</h3>
              <p className="text-body mb-4">These cookies enable additional features and functionality on our website, such as the Watson Assistant chat widget that provides automated help for users in certain locations.</p>
              <p className="text-body mb-4">Unlike analytics cookies, functional cookies are not covered by the DUAA statutory exception and require your explicit consent before being set. They are disabled by default.</p>

              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-brand-f text-sm">
                  <thead className="bg-brand-n text-white">
                    <tr>
                      <th className="border border-brand-f px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Provider</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Purpose</th>
                      <th className="border border-brand-f px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-brand-f px-4 py-2">Watson Assistant cookies</td>
                      <td className="border border-brand-f px-4 py-2">IBM</td>
                      <td className="border border-brand-f px-4 py-2">Powers the chat assistant feature for West Midlands locations</td>
                      <td className="border border-brand-f px-4 py-2">Varies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="heading-2 mb-6 text-brand-l">Managing Your Cookie Preferences</h2>
              <p className="text-body mb-4">When you first visit our site, a cookie notice banner informs you that analytics cookies are active by default. From the banner you can:</p>
              <ul className="list-disc pl-6 space-y-2 text-body mb-4">
                <li><strong>OK</strong> — accept the defaults (analytics on, functional off) and dismiss the notice</li>
                <li><strong>Opt Out</strong> — disable all optional cookies and dismiss the notice</li>
                <li><strong>Manage Preferences</strong> — open a dialog to choose exactly which cookie categories to enable or disable</li>
              </ul>
              <p className="text-body">You can revisit your preferences at any time by clicking the &quot;Manage Cookie Preferences&quot; button at the top of this page, or via the &quot;Cookie Settings&quot; link in the footer of our website.</p>
            </section>

            <section className="mb-8">
              <h2 className="heading-2 mb-6 text-brand-l">How to Control Cookies in Your Browser</h2>
              <p className="text-body mb-4">Most web browsers allow you to control cookies through their settings. You can set your browser to block all cookies or to alert you when cookies are being sent. However, please note that blocking all cookies may affect the functionality of our website.</p>
              <p className="text-body mb-4">For more information on how to manage cookies, you can visit the following links based on your browser:</p>
              <ul className="list-disc pl-6 space-y-2 text-body">
                <li><a href="https://support.google.com/chrome/answer/95647?hl=en" className="text-brand-a hover:text-brand-b underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-brand-a hover:text-brand-b underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-brand-a hover:text-brand-b underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-and-site-data-in-microsoft-edge-bf24c7f4-4f60-4fc7-bc10-124fa8b7d44d" className="text-brand-a hover:text-brand-b underline">Microsoft Edge</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="heading-2 mb-6 text-brand-l">Changes to This Cookie Policy</h2>
              <p className="text-body">We may update our Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the &quot;Effective Date&quot; at the top of this page. Please review this policy periodically for any updates.</p>
            </section>

            <section>
              <h2 className="heading-2 mb-6 text-brand-l">Contact Us</h2>
              <p className="text-body">If you have any questions about this Cookie Policy or how we use cookies, please contact us at: <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a></p>
            </section>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}
