import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function BrandingPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/resources", label: "Resources" },
          { label: "Branding", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">Street Support Branding</h1>
          <p className="text-lead text-white">Guidelines to adapt and align with the Street Support Network identity.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

      {/* Content */}
      <div className="prose max-w-none">
        <p className="mb-4">Street Support Network's brand centres around our values - objectivity, quality, love, integrity, sustainability and communication. For more about each, please see the document below.</p>
        <p className="mb-4">We like our branding to be simple to maximise its accessibility to all. When we produce presentations and graphics, they have as few words as possible and are in Museo Sans - our clear to read font. If you're looking at producing anything like this yourself, please use our Brand Guideline's document to help you. It talks about what should be included in external communications, how we use imagery and a brief guide on our tone of voice.</p>
        <p className="mb-4">Whether we're writing emails or social media posts, the way we speak to people is really important to us, so we've produced a detailed document with hows and whys. Again, it all comes back to our values.</p>
        <p className="mb-6">All the work we produce has our logo on it. There are two versions of this, one with Street Support Network's name and the other just the Street Support Network icon.</p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
          <Image 
            src="/assets/img/StreetSupport_logo_land.png" 
            alt="Street Support name logo" 
            width={300} 
            height={200} 
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 300px"
          />
          <Image 
            src="/assets/img/logo.png" 
            alt="Street Support logo" 
            width={200} 
            height={200} 
            className="object-contain"
            priority
            sizes="(max-width: 768px) 50vw, 200px"
          />
        </div>

        <hr className="my-8 border-gray-300" />

        <p className="font-semibold mb-6">Some useful branding resources:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a href="https://www.canva.com/design/DAFuiMajX10/_3f7uzlnKt9qSAiVMWCbeg/view?utm_content=DAFuiMajX10&utm_campaign=designshare&utm_medium=link&utm_source=viewer" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
            <article className="card bg-brand-i text-white hover:bg-brand-n transition-all duration-200 p-6 h-full flex items-center justify-center text-center shadow-lg rounded-lg">
              <h3 className="heading-5 text-white">Brand Values</h3>
            </article>
          </a>
          <a href="https://www.canva.com/design/DAE1JPTaABY/ybCmN4o1SFTZWZC8BZ7cKw/edit?utm_content=DAE1JPTaABY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
            <article className="card bg-brand-i text-white hover:bg-brand-n transition-all duration-200 p-6 h-full flex items-center justify-center text-center shadow-lg rounded-lg">
              <h3 className="heading-5 text-white">Basic Brand Guidelines</h3>
            </article>
          </a>
          <a href="https://www.canva.com/design/DAE3xKEHWus/39m9xn1mNO63x5A8Tt2-mA/view?utm_content=DAE3xKEHWus&utm_campaign=designshare&utm_medium=link&utm_source=homepage_design_menu" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
            <article className="card bg-brand-i text-white hover:bg-brand-n transition-all duration-200 p-6 h-full flex items-center justify-center text-center shadow-lg rounded-lg">
              <h3 className="heading-5 text-white">Tone of Voice</h3>
            </article>
          </a>
          <a href="https://www.canva.com/design/DAFf_eB43B0/YLzIVzZVEjHyj7X6REIE4Q/view?utm_content=DAFf_eB43B0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
            <article className="card bg-brand-i text-white hover:bg-brand-n transition-all duration-200 p-6 h-full flex items-center justify-center text-center shadow-lg rounded-lg">
              <h3 className="heading-5 text-white">Location's Guide to Social Media</h3>
            </article>
          </a>
        </div>

        <hr className="my-8 border-gray-300" />

        <h2 className="heading-3 mb-4">Some other useful resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/resources/partnership-comms" className="text-brand-a hover:text-brand-a underline">Partnership Communications</Link>
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