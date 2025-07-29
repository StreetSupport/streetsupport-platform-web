import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function TermsAndConditionsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { href: "/about/privacy-and-data", label: "Privacy and Data" },
          { label: "Terms and Conditions", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-16">
        <div className="content-container">
          <h1 className="heading-1 text-white mb-6">Terms and Conditions</h1>
          <h2 className="heading-3 text-white mb-4">Using the Street Support Network Virtual Assistant</h2>
          <p className="text-lead text-white opacity-90">We built the Virtual Assistant to make it easier for you to find the right support when you need it. It asks a few simple questions and points you toward services that might be able to help. But there are a few things you should know before using it.</p>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Finding Services, Not Guarantees</h2>
                <p className="text-body mb-4">The Virtual Assistant does its best to match you with services based on the information you provide. But:</p>
                <ul className="list-disc pl-6 space-y-3 text-body">
                  <li>It can't guarantee that a service will be available or meet your exact needs.</li>
                  <li>Some services change their criteria, availability, or policies, and we might not have the latest updates.</li>
                  <li>If something isn't quite right, we encourage you to contact the service directly to check.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">We Don't Run These Services</h2>
                <p className="text-body mb-4">The organisations we recommend are independent. That means:</p>
                <ul className="list-disc pl-6 space-y-3 text-body">
                  <li>We don't control how they operate or the decisions they make.</li>
                  <li>We can't promise they'll offer support, and we're not responsible for their actions.</li>
                  <li>If you have a concern about a service, it's best to raise it with them directly.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Your Privacy Matters</h2>
                <ul className="list-disc pl-6 space-y-3 text-body">
                  <li>We don't ask for or store personal details like your name, address, or contact info.</li>
                  <li>Your answers help us find the best services for you, but they're not saved once your session ends.</li>
                  <li>We do keep anonymised data to understand what support people are looking for and improve services over time.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">If You Need Urgent Help</h2>
                <div className="bg-red-50 border-l-4 border-red-400 p-6 my-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium mb-2">Emergency Services</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-red-700">
                        <li>The Virtual Assistant is a guide, not an emergency service.</li>
                        <li>If you or someone else is in immediate danger, call <a href="tel:999" className="text-red-800 hover:text-red-900 underline font-semibold">999</a> or reach out to emergency support services.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Your Choice, Always</h2>
                <ul className="list-disc pl-6 space-y-3 text-body">
                  <li>Using the Virtual Assistant is completely optional. If you'd rather not answer questions, you can still use our interactive map to find services on your own.</li>
                  <li>By using the Virtual Assistant, you agree to these terms. If you don't want to continue, just close the chat. We hope this tool helps you find the support you need.</li>
                </ul>
              </section>

              <div className="mt-16 pt-8 border-t border-brand-q">
                <p className="text-sm text-brand-f italic">Last updated: 2nd April 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}