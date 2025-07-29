import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function PrivacyAndDataPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { label: "Privacy and Data", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">Your Privacy, Your Data, and Responsible AI</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-12">
              <section>
                <p className="text-lead mb-8">At Street Support Network, we believe that trust is everything. If you're using our platform, you should know exactly what happens with your data, how we keep it safe, and how we use AI in a fair and responsible way. No complicated jargon, no hidden details—just clear, honest information about what we do and why it matters.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">How We Handle Your Data</h2>
                <p className="text-body mb-6">When you use our website or digital tools, we might collect some information about you. That could be your name and contact details if you sign up for updates, or general website activity data that helps us understand how people use our services. Here's what you need to know:</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h3 className="heading-5 mb-3 text-brand-l">We only collect what we need</h3>
                    <p className="text-body text-sm">If we don't need it, we don't store it.</p>
                  </div>
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h3 className="heading-5 mb-3 text-brand-l">We keep it safe</h3>
                    <p className="text-body text-sm">Your data is securely stored and only accessed by people who need it to provide services.</p>
                  </div>
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h3 className="heading-5 mb-3 text-brand-l">We never sell or misuse your information</h3>
                    <p className="text-body text-sm">We don't share your details with third-party advertisers or anyone who doesn't have a legitimate reason to access it.</p>
                  </div>
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h3 className="heading-5 mb-3 text-brand-l">You're in control</h3>
                    <p className="text-body text-sm">You can ask us to update, delete, or send you a copy of your data anytime. Just get in touch.</p>
                  </div>
                </div>
                
                <p className="text-body">Want a bit more detail? Check out our <Link href="/about/privacy-and-data/privacy-policy" className="text-brand-a hover:text-brand-b underline">Privacy Policy</Link> and <Link href="/about/privacy-and-data/data-protection-policy" className="text-brand-a hover:text-brand-b underline">Data Protection Policy</Link>.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">How the Virtual Assistant Works</h2>
                <p className="text-body mb-4">Our Virtual Assistant is designed to help people find the right support quickly and easily. It asks a few simple questions about your situation, like what kind of help you need and your general circumstances, then suggests services that match.</p>
                <p className="text-body mb-4">Here's what you need to know:</p>
                <ul className="list-disc pl-6 space-y-3 text-body mb-6">
                  <li><strong>No personal details are collected or stored.</strong> You don't need to provide a name, address, or contact details to use the assistant.</li>
                  <li><strong>It works in real time.</strong> Your answers help find relevant services, but nothing is saved after your session ends.</li>
                  <li><strong>Anonymised data is used to improve services.</strong> We track overall trends (like how many people are looking for food support) to help organisations plan better, but we don't track individuals.</li>
                  <li><strong>If you prefer, you can use our interactive map.</strong> The Virtual Assistant is just one way to find support, and you're always in control.</li>
                </ul>
                <p className="text-body">For full details, check out the <Link href="/about/privacy-and-data/terms-and-conditions" className="text-brand-a hover:text-brand-b underline">Terms & Conditions</Link>.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Keeping Your Information Secure</h2>
                <p className="text-body mb-4">We take security seriously. Whether it's making sure our systems are protected from cyber threats or ensuring that only the right people have access to your data, we follow strict security measures:</p>
                <ul className="list-disc pl-6 space-y-3 text-body mb-6">
                  <li><strong>Strong encryption</strong> keeps your data safe when it's stored and sent.</li>
                  <li><strong>Regular security checks</strong> help us spot and fix any potential issues.</li>
                  <li><strong>Strict access controls</strong> mean only authorised staff can handle sensitive data.</li>
                </ul>
                <p className="text-body">If you ever have questions or concerns about your data security, just reach out—we're happy to help.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">How We Use AI - Ethically and Responsibly</h2>
                <p className="text-body mb-4">We use artificial intelligence (AI) in some of our digital tools, like our Virtual Assistant, to help connect people with the right support faster. But we don't just use AI—we use it responsibly. Our AI follows five key principles:</p>
                <div className="space-y-6 mb-8">
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">Fairness</h3>
                    <p className="text-body">Our AI is designed to treat everyone equally. We work hard to remove bias and ensure that no one is left out.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">Transparency</h3>
                    <p className="text-body">You have the right to know how our AI works and why it makes certain recommendations. We keep things clear and explain decisions in simple terms.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">Explainability</h3>
                    <p className="text-body">If the AI suggests something, we make sure there's an understandable reason behind it. No black boxes, no mystery—just straightforward answers.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">Robustness</h3>
                    <p className="text-body">AI needs to be reliable. We test our systems regularly to make sure they're working as they should and aren't making harmful mistakes.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">Privacy</h3>
                    <p className="text-body">Your personal information is yours. Our AI respects that by only using necessary data and keeping it anonymous where possible.</p>
                  </div>
                </div>
                <p className="text-body mb-6">Want to learn more about how we manage AI responsibly? Check out our <Link href="/about/privacy-and-data/ai-governance" className="text-brand-a hover:text-brand-b underline">AI Governance Plan</Link> and our <Link href="/about/privacy-and-data/ai-and-environment" className="text-brand-a hover:text-brand-b underline">AI Environmental Impact Report</Link>.</p>
                
                <div className="bg-brand-q p-6 rounded-lg">
                  <h3 className="heading-4 mb-4 text-brand-l">Got Questions? We're Here to Help.</h3>
                  <p className="text-body mb-4">Your data and privacy matter to us, and we want to make sure you feel confident and informed. If you have any questions about how we handle your information, just drop us a message at <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>.</p>
                  <p className="text-body">We're committed to making our platform as safe, fair, and accessible as possible—because that's what you deserve.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}