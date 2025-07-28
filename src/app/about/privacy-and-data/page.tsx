import Link from 'next/link';

export default function PrivacyAndDataPage() {
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
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <span className="text-brand-f">Our Policies</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-2">Your Privacy, Your Data, and Responsible AI</h1>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <p>At Street Support Network, we believe that trust is everything. If you're using our platform, you should know exactly what happens with your data, how we keep it safe, and how we use AI in a fair and responsible way. No complicated jargon, no hidden details—just clear, honest information about what we do and why it matters.</p>

        <h2 className="heading-3 mb-4">How We Handle Your Data</h2>
        <p>When you use our website or digital tools, we might collect some information about you. That could be your name and contact details if you sign up for updates, or general website activity data that helps us understand how people use our services. Here's what you need to know:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>We only collect what we need.</strong> If we don't need it, we don't store it.</li>
          <li><strong>We keep it safe.</strong> Your data is securely stored and only accessed by people who need it to provide services.</li>
          <li><strong>We never sell or misuse your information.</strong> We don't share your details with third-party advertisers or anyone who doesn't have a legitimate reason to access it.</li>
          <li><strong>You're in control.</strong> You can ask us to update, delete, or send you a copy of your data anytime. Just get in touch.</li>
        </ul>
        <p>Want a bit more detail? Check out our <Link href="/about/privacy-and-data/privacy-policy" className="text-brand-a hover:text-brand-b underline">Privacy Policy</Link> and <Link href="/about/privacy-and-data/data-protection-policy" className="text-brand-a hover:text-brand-b underline">Data Protection Policy</Link>.</p>

        <h2 className="heading-3 mb-4">How the Virtual Assistant Works</h2>
        <p>Our Virtual Assistant is designed to help people find the right support quickly and easily. It asks a few simple questions about your situation, like what kind of help you need and your general circumstances, then suggests services that match.</p>
        <p>Here's what you need to know:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>No personal details are collected or stored.</strong> You don't need to provide a name, address, or contact details to use the assistant.</li>
          <li><strong>It works in real time.</strong> Your answers help find relevant services, but nothing is saved after your session ends.</li>
          <li><strong>Anonymised data is used to improve services.</strong> We track overall trends (like how many people are looking for food support) to help organisations plan better, but we don't track individuals.</li>
          <li><strong>If you prefer, you can use our interactive map.</strong> The Virtual Assistant is just one way to find support, and you're always in control.</li>
        </ul>
        <p>For full details, check out the <Link href="/about/privacy-and-data/terms-and-conditions" className="text-brand-a hover:text-brand-b underline">Terms & Conditions</Link>.</p>

        <h2 className="heading-3 mb-4">Keeping Your Information Secure</h2>
        <p>We take security seriously. Whether it's making sure our systems are protected from cyber threats or ensuring that only the right people have access to your data, we follow strict security measures:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Strong encryption</strong> keeps your data safe when it's stored and sent.</li>
          <li><strong>Regular security checks</strong> help us spot and fix any potential issues.</li>
          <li><strong>Strict access controls</strong> mean only authorised staff can handle sensitive data.</li>
        </ul>
        <p>If you ever have questions or concerns about your data security, just reach out—we're happy to help.</p>

        <h2 className="heading-3 mb-4">How We Use AI - Ethically and Responsibly</h2>
        <p>We use artificial intelligence (AI) in some of our digital tools, like our Virtual Assistant, to help connect people with the right support faster. But we don't just use AI—we use it responsibly. Our AI follows five key principles:</p>
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <strong>Fairness</strong>
            <p>Our AI is designed to treat everyone equally. We work hard to remove bias and ensure that no one is left out.</p>
          </li>
          <li>
            <strong>Transparency</strong>
            <p>You have the right to know how our AI works and why it makes certain recommendations. We keep things clear and explain decisions in simple terms.</p>
          </li>
          <li>
            <strong>Explainability</strong>
            <p>If the AI suggests something, we make sure there's an understandable reason behind it. No black boxes, no mystery—just straightforward answers.</p>
          </li>
          <li>
            <strong>Robustness</strong>
            <p>AI needs to be reliable. We test our systems regularly to make sure they're working as they should and aren't making harmful mistakes.</p>
          </li>
          <li>
            <strong>Privacy</strong>
            <p>Your personal information is yours. Our AI respects that by only using necessary data and keeping it anonymous where possible.</p>
          </li>
        </ol>

        <p>Want to learn more about how we manage AI responsibly? Check out our <Link href="/about/privacy-and-data/ai-governance" className="text-brand-a hover:text-brand-b underline">AI Governance Plan</Link> and our <Link href="/about/privacy-and-data/ai-and-environment" className="text-brand-a hover:text-brand-b underline">AI Environmental Impact Report</Link>.</p>

        <h3 className="heading-5 mb-4">Got Questions? We're Here to Help.</h3>
        <p>Your data and privacy matter to us, and we want to make sure you feel confident and informed. If you have any questions about how we handle your information, just drop us a message at <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>.</p>
        <p>We're committed to making our platform as safe, fair, and accessible as possible—because that's what you deserve.</p>
      </div>
    </div>
  );
}