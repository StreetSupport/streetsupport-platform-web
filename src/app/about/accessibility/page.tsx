import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Accessibility Statement',
    description: 'Street Support Network\'s commitment to digital accessibility and inclusive design. Learn about our accessibility features and how to contact us for support.',
    keywords: [
      'accessibility statement',
      'digital accessibility',
      'WCAG compliance',
      'inclusive design',
      'assistive technology',
      'accessibility support'
    ],
    path: 'about/accessibility',
    image: '/assets/img/og/street-support.jpg',
    imageAlt: 'Street Support Network Accessibility Statement'
  });
}

export default function AccessibilityPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { label: "Accessibility", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">Accessibility Statement</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">

            <div className="space-y-12">
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Our Commitment to Accessibility</h2>
            <p className="mb-6">
              Street Support Network is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
            <p className="mb-6">
              We believe that everyone should have equal access to information and services that help connect people 
              experiencing homelessness with the support they need. Accessibility is not just a legal requirement for us – 
              it&apos;s a fundamental part of our mission to create an inclusive digital platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Accessibility Standards</h2>
            <p className="mb-4">
              We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards, 
              which are recognised internationally as the benchmark for web accessibility.
            </p>
            <p className="mb-6">
              Our platform is designed to be compatible with assistive technologies including screen readers, 
              voice recognition software, and keyboard-only navigation.
            </p>
            
            <h3 className="text-xl font-semibold text-brand-l mb-4">Key Accessibility Features</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Keyboard Navigation:</strong> All interactive elements can be accessed using only a keyboard</li>
              <li><strong>Screen Reader Support:</strong> Proper heading structure, alt text for images, and ARIA labels</li>
              <li><strong>High Contrast:</strong> Text and background colours meet WCAG AA contrast requirements</li>
              <li><strong>Scalable Text:</strong> Text can be enlarged up to 200% without loss of functionality</li>
              <li><strong>Focus Indicators:</strong> Clear visual indicators show which element has keyboard focus</li>
              <li><strong>Descriptive Links:</strong> Link text clearly describes the destination or action</li>
              <li><strong>Error Identification:</strong> Form errors are clearly identified and explained</li>
              <li><strong>Consistent Navigation:</strong> Navigation elements appear in the same location across pages</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Supported Assistive Technologies</h2>
            <p className="mb-4">Our platform has been tested with the following assistive technologies:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Screen Readers:</strong> NVDA, JAWS, VoiceOver (macOS/iOS), TalkBack (Android)</li>
              <li><strong>Voice Recognition:</strong> Dragon NaturallySpeaking, Windows Speech Recognition</li>
              <li><strong>Keyboard Navigation:</strong> Support for standard keyboard shortcuts and tab navigation</li>
              <li><strong>Browser Zoom:</strong> Compatible with browser zoom up to 400% magnification</li>
              <li><strong>High Contrast Mode:</strong> Windows High Contrast themes and browser extensions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Known Issues and Limitations</h2>
            <p className="mb-4">
              We regularly audit our platform for accessibility issues. Currently known limitations include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Some third-party embedded content may not meet full accessibility standards</li>
              <li>Certain complex interactive features are being enhanced for better screen reader support</li>
              <li>We are working to improve mobile accessibility across all features</li>
            </ul>
            <p className="mb-6">
              We are actively working to address these issues and will update this statement as improvements are made.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Feedback and Contact Information</h2>
            <p className="mb-6">
              We welcome your feedback on the accessibility of our platform. If you encounter accessibility barriers 
              or have suggestions for improvement, please contact us:
            </p>
            
            <div className="bg-brand-q p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-brand-l mb-4">Get Accessibility Support</h3>
              <div className="space-y-3">
                <p><strong>Email:</strong> <a href="mailto:accessibility@streetsupport.net" className="text-brand-a hover:text-brand-b underline">accessibility@streetsupport.net</a></p>
                <p><strong>Phone:</strong> Available through our contact page during office hours</p>
              </div>
            </div>

            <p className="mb-6">
              When reporting accessibility issues, please include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>The specific page or feature you were trying to access</li>
              <li>The assistive technology you were using (if applicable)</li>
              <li>Your browser and operating system</li>
              <li>A description of the problem you encountered</li>
            </ul>

            <p className="mb-6">
              We aim to respond to accessibility feedback within <strong>5 working days</strong> and will work with you 
              to provide the information or service you need in an accessible format.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Alternative Access Methods</h2>
            <p className="mb-4">
              If you cannot access our digital services, we offer alternative ways to get the information you need:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Phone Support:</strong> Our team can provide information about services over the phone</li>
              <li><strong>Email Support:</strong> We can send service information via email in your preferred format</li>
              <li><strong>Partner Organisations:</strong> Our local partners can provide in-person assistance</li>
              <li><strong>Large Print:</strong> We can provide information in large print format upon request</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Continuous Improvement</h2>
            <p className="mb-6">
              Accessibility is an ongoing process. We regularly:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Conduct accessibility audits with external specialists</li>
              <li>Test our platform with real users who have disabilities</li>
              <li>Train our development team on accessibility best practices</li>
              <li>Monitor and update our accessibility features as technology evolves</li>
              <li>Review and update this statement annually or when significant changes are made</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-l mb-6">Legal Information</h2>
            <p className="mb-4">
              This accessibility statement applies to the Street Support Network website and platform 
              (streetsupport.net and associated domains).
            </p>
            <p className="mb-6">
              We are committed to meeting our obligations under the Equality Act 2010, the Public Sector Bodies 
              (Websites and Mobile Applications) Accessibility Regulations 2018, and related accessibility legislation.
            </p>
            <p className="mb-6">
              <strong>Last updated:</strong> January 2025
            </p>
          </section>

              <section className="bg-brand-i p-8 rounded-lg">
                <h2 className="text-2xl font-semibold text-brand-l mb-4">Need Help Right Now?</h2>
                <p className="text-brand-l mb-6">
                  If you&apos;re experiencing homelessness or need urgent support, our platform is designed to help you 
                  find services quickly, regardless of how you access the internet.
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/find-help"
                    className="inline-flex items-center justify-center px-6 py-3 bg-brand-a text-white font-semibold rounded-lg hover:bg-brand-b hover:text-white transition-colors"
                  >
                    Find Help Now
                  </Link>
                </div>
              </section>

            </div>
          </div>
          <SocialShare />

        </div>
      </section>
    </>
  );
}