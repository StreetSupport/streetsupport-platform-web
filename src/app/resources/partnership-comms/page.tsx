import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function PartnershipCommsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/resources", label: "Resources" },
          { label: "Partnership Communications", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">Partnership Communications</h1>
          <p className="text-lead text-white">How to make the most of being part of Street Support Network.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="heading-3 mb-4">Partnership Communications</h2>
        <p className="mb-4">We love the 'network' aspect of what we do and we hope you will too. Working in this sector can be frustrating and isolating, but by joining us you'll also be joining a ready-made support network.</p>
        <p className="mb-4">Street Support is active in 31 locations across the UK, and we encourage everyone to play an active part in our Network. Whether that's connecting with each other on LinkedIn, featuring in our newsletter or attending and speaking in our quarterly Network Meetings, we're here to facilitate it.</p>
        <p className="mb-8">We're always looking for opportunities to engage with and support our locations, so if there's something you'd like to work together on, just say the word.</p>

        <h2 className="heading-3 mb-4">Other useful partnership communications resources</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><a href="https://streetsupport.us12.list-manage.com/subscribe?u=da9a1d4bb2b1a69a981456972&id=c966413ba3" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Newsletter Sign Up</a></li>
          <li><a href="https://us12.campaign-archive.com/home/?u=da9a1d4bb2b1a69a981456972&id=c966413ba3" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Newsletter Archive</a></li>
          <li><a href="https://www.linkedin.com/groups/14055957/" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">LinkedIn closed community group</a></li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <h2 className="heading-3 mb-4">Some other useful resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/resources/branding" className="text-brand-a hover:text-brand-a underline">Branding</Link>
          </li>
          <li>
            <Link href="/resources/marketing" className="text-brand-a hover:text-brand-a underline">Marketing</Link>
          </li>
        </ul>
        </div>
        <SocialShare />
      </div>
    </>
  );
}