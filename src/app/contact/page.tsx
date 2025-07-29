import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { label: "Contact", current: true }
        ]} 
      />

      <div className="content-container px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-2">Contact Us</h1>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <div className="text-center mb-8 p-4 bg-brand-e border border-brand-j rounded">
          <p className="font-semibold">
            <strong>Please note that we do not run any frontline services. Please check for suitable organisations in the{' '}
              <Link href="/find-help/" className="text-brand-a hover:text-brand-b underline">Find Help</Link> section if you are experiencing homelessness and need support.</strong>
          </p>
        </div>

        <h2 className="heading-4">General enquiries</h2>
        <p className="mb-8">If you have any questions, ideas, or would like to know more about us, you can get in touch at{' '}
          <a href="mailto:info@streetsupport.net" className="text-brand-a hover:text-brand-b underline">info@streetsupport.net</a>.</p>

        <h2 className="heading-4">Locations</h2>
        <p className="mb-4">For questions specific to one of our locations, please contact our city admins at one of the following addresses:</p>

        <ul className="list-disc pl-6 space-y-1 mb-8">
          <li>
            <a href="mailto:bournemouth@streetsupport.net" className="text-brand-a hover:text-brand-b underline">bournemouth@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:brightonandhove@streetsupport.net" className="text-brand-a hover:text-brand-b underline">brightonandhove@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:cambridge@streetsupport.net" className="text-brand-a hover:text-brand-b underline">cambridge@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:edinburgh@streetsupport.net" className="text-brand-a hover:text-brand-b underline">edinburgh@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:luton@streetsupport.net" className="text-brand-a hover:text-brand-b underline">luton@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:nottingham@streetsupport.net" className="text-brand-a hover:text-brand-b underline">nottingham@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:reading@streetsupport.net" className="text-brand-a hover:text-brand-b underline">reading@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:southampton@streetsupport.net" className="text-brand-a hover:text-brand-b underline">southampton@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:wakefield@streetsupport.net" className="text-brand-a hover:text-brand-b underline">wakefield@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:westmidlands@streetsupport.net" className="text-brand-a hover:text-brand-b underline">westmidlands@streetsupport.net</a>
          </li>
        </ul>

        <h2 className="heading-4">Join the conversation</h2>
        <p>You can join the conversation on{' '}
          <a href="https://x.com/streetsupportuk" className="text-brand-a hover:text-brand-b underline">X</a>,{' '}
          <a href="https://www.facebook.com/streetsupport/" className="text-brand-a hover:text-brand-b underline">Facebook</a> or subscribe to our <a href="http://eepurl.com/gvtAjT" className="text-brand-a hover:text-brand-b underline">UK Network mailing list</a>.</p>
      </div>
      </div>
    </>
  );
}
