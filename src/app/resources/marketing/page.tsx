import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function MarketingPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/resources", label: "Resources" },
          { label: "Marketing", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">Marketing</h1>
          <p className="text-lead text-white">Strategies to raise awareness and engage your community effectively.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="heading-3 mb-4">Marketing</h2>
        <p className="mb-4">Marketing your Street Support location is important because it spreads awareness that help is available in your area. It can also help with fundraising, recruiting volunteers and connecting with others who might be able to help.</p>
        <p className="mb-4">Firstly and foremostly, we&apos;d recommend you get in touch with Mara, our Marketing and Communications Lead. She can meet with you and your team to guide you on branding and produce a marketing plan that works for you and your budget (even if that&apos;s non-existent!).</p>
        <p className="mb-8">In the past, this has included working with local media, local businesses and billboard companies. We can also work with you to create social media campaigns and print-out assets tailored to you.</p>

        <h2 className="heading-3 mb-4">Other useful marketing resources</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><a href="/resources/marketing/location-marketing-guide.pdf" className="text-brand-a hover:text-brand-a underline">Marketing Guide for Locations</a></li>
          <li><a href="https://www.canva.com/design/DAE3xKEHWus/dqCjR44MnWPYdQ6GLIhOnA/view?utm_content=DAE3xKEHWus&utm_campaign=designshare&utm_medium=link&utm_source=editor" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">SSN&apos;s Tone of Voice Document</a></li>
          <li><a href="/resources/marketing/ssn-poster.pdf" className="text-brand-a hover:text-brand-a underline">Help is Out There poster for public spaces</a></li>
          <li><a href="https://www.canva.com/design/DAFf_eB43B0/diULw0jreJfZZzm415q5Jg/view?utm_content=DAFf_eB43B0&utm_campaign=designshare&utm_medium=link&utm_source=editor" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Social Media Guide for Locations</a></li>
          <li><a href="https://www.canva.com/design/DAE1JPTaABY/i4wsXwutWRydgZibdUYtbg/view?utm_content=DAE1JPTaABY&utm_campaign=designshare&utm_medium=link&utm_source=editor" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Branding Guidelines</a></li>
          <li><a href="https://news.streetsupport.net/2023/04/23/street-support-chelmsford-live-on-the-radio/" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Street Support Chelmsford on the radio</a></li>
          <li><a href="https://www.youtube.com/watch?v=otcbhtOaigM" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Street Support Glasgow on TV</a></li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <h2 className="heading-3 mb-4">Some other useful resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/resources/branding" className="text-brand-a hover:text-brand-a underline">Branding</Link>
          </li>
          <li>
            <Link href="/resources/partnership-comms" className="text-brand-a hover:text-brand-a underline">Partnership Communications</Link>
          </li>
        </ul>
        </div>
        <SocialShare />
      </div>
    </>
  );
}