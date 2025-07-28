import Link from 'next/link';

export default function TermsAndConditionsPage() {
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
                <span className="text-brand-f">Terms and Conditions of Virtual Assistant</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-2 text-white">Using the Street Support Network Virtual Assistant – What You Need to Know</h1>
          <p className="mt-4 text-lead text-white">We built the Virtual Assistant to make it easier for you to find the right support when you need it. It asks a few simple questions and points you toward services that might be able to help. But there are a few things you should know before using it.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="prose max-w-none">
        <h2 className="heading-3 mb-4">Finding Services, Not Guarantees</h2>
        <p>The Virtual Assistant does its best to match you with services based on the information you provide. But:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>It can't guarantee that a service will be available or meet your exact needs.</li>
          <li>Some services change their criteria, availability, or policies, and we might not have the latest updates.</li>
          <li>If something isn't quite right, we encourage you to contact the service directly to check.</li>
        </ul>

        <h2 className="heading-3 mb-4">We Don't Run These Services</h2>
        <p>The organisations we recommend are independent. That means:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>We don't control how they operate or the decisions they make.</li>
          <li>We can't promise they'll offer support, and we're not responsible for their actions.</li>
          <li>If you have a concern about a service, it's best to raise it with them directly.</li>
        </ul>

        <h2 className="heading-3 mb-4">Your Privacy Matters</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>We don't ask for or store personal details like your name, address, or contact info.</li>
          <li>Your answers help us find the best services for you, but they're not saved once your session ends.</li>
          <li>We do keep anonymised data to understand what support people are looking for and improve services over time.</li>
        </ul>

        <h2 className="heading-3 mb-4">If You Need Urgent Help</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Virtual Assistant is a guide, not an emergency service.</li>
          <li>If you or someone else is in immediate danger, call <a href="tel:999" className="text-brand-a hover:text-brand-b underline">999</a> or reach out to emergency support services.</li>
        </ul>

        <h2 className="heading-3 mb-4">Your Choice, Always</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Using the Virtual Assistant is completely optional. If you'd rather not answer questions, you can still use our interactive map to find services on your own.</li>
          <li>By using the Virtual Assistant, you agree to these terms. If you don't want to continue, just close the chat. We hope this tool helps you find the support you need.</li>
        </ul>

        <p className="italic mt-8">Last updated: 2nd April 2025</p>
        </div>
      </div>
    </>
  );
}