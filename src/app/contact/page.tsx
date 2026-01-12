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
          <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>.</p>

        <h2 className="heading-4">For organisations</h2>
        <p className="mb-4">If your organisation provides services to people experiencing homelessness and you would like to be listed on Street Support, you can{' '}
          <Link href="/organisation-request-form" className="text-brand-a hover:text-brand-b underline">submit an organisation request</Link>.</p>
        <p className="mb-8">If you are interested in partnering with Street Support Network, you can find out more and apply via our{' '}
          <Link href="/partnership-application-form" className="text-brand-a hover:text-brand-b underline">partnership application form</Link>.</p>

        <h2 className="heading-4">Join the conversation</h2>
        <p>You can join the conversation on{' '}
          <a href="https://x.com/streetsupportuk" className="text-brand-a hover:text-brand-b underline">X</a>,{' '}
          <a href="https://www.facebook.com/streetsupport/" className="text-brand-a hover:text-brand-b underline">Facebook</a> or subscribe to our <a href="http://eepurl.com/gvtAjT" className="text-brand-a hover:text-brand-b underline">UK Network mailing list</a>.</p>
      </div>
      </div>
    </>
  );
}
