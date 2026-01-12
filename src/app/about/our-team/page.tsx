import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function OurTeamPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { label: "Our Team", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="heading-2 text-white mb-4">The Street Support Network Team</h1>
        </div>
      </div>

      {/* Core Team Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-16">
          <h1 className="heading-3 text-white mb-4">Our Core Team of 2</h1>
          <p className="text-lead mb-8">
            We&apos;re your everyday people, your first port of call. We cover a fair bit between us, so please get in touch with whatever you need.
          </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card card-compact text-center">
            <Image
              src="/assets/img/mugshots/matt.jpg"
              alt="Matt Lambert, Managing Director at Street Support Network"
              width={200}
              height={200}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              sizes="(max-width: 768px) 128px, 200px"
            />
            <h2 className="heading-5 mb-2">Matt Lambert</h2>
            <h3 className="heading-6 text-brand-a mb-3">Managing Director</h3>
            <p className="text-brand-l mb-4">
              Matt works closely with partners and local organisations to strengthen collaboration, develop new opportunities, and ensure tailored support for locations across the UK.
            </p>
            <a 
              href="mailto:matt@streetsupport.net"
              className="text-brand-a hover:text-brand-b underline"
            >
              Contact Matt
            </a>
          </div>

          <div className="card card-compact text-center">
            <Image
              src="/assets/img/mugshots/mara.jpg"
              alt="Mara Airoldi, Head of Partnerships at Street Support Network"
              width={200}
              height={200}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              sizes="(max-width: 768px) 128px, 200px"
            />
            <h2 className="heading-5 mb-2">Mara Patraiko</h2>
            <h3 className="heading-6 text-brand-a mb-3">Comms & Engagement</h3>
            <p className="text-brand-l mb-4">
              Mara designs and delivers all things communication and content, as well as supporting our locations to do the same.
            </p>
            <a 
              href="mailto:mara@streetsupport.net"
              className="text-brand-a hover:text-brand-b underline"
            >
              Contact Mara
            </a>
          </div>
        </div>
      </div>

      {/* Partnership Coordinators Section */}
      <div className="mb-16">
        <h1 className="heading-3 mb-4">Our Partnership Co-ordinators</h1>
        <p className="text-lead mb-8">
          Based within their respective areas but with one foot in our door, our partnership coordinators work alongside us to build local networks and continually support the homelessness sector in their locations.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card card-compact text-center">
            <Image
              src="/assets/img/mugshots/eliz.jpg"
              alt="Eliz Hopkins, West Midlands Partnership Coordinator at Street Support Network"
              width={200}
              height={200}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              sizes="(max-width: 768px) 128px, 200px"
            />
            <h2 className="heading-5 mb-2">Eliz Hopkins</h2>
            <h3 className="heading-6 text-brand-a mb-3">West Midlands</h3>
            <p className="text-brand-l mb-4">
              Eliz has been working in an administrative capacity for the homelessness charity Crisis at their Skylight service in Birmingham since 2018. Eliz took on the role of Street Support Network Coordinator for the West Midlands in August 2021
            </p>
            <a 
              href="mailto:westmidlands@streetsupport.net"
              className="text-brand-a hover:text-brand-b underline"
            >
              Contact Eliz
            </a>
          </div>
        </div>
      </div>

      {/* Location Contacts Section */}
      <div className="mb-16">
        <h1 className="heading-3 mb-4">Our location&apos;s contacts</h1>
        <p className="text-lead mb-8">
          We&apos;re so lucky to be supported by a host of brilliant people who manage their local Street Support networks. If your query is about a specific location, get in touch with them - you&apos;ll be in great hands.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card card-compact text-center">
            <Image
              src="/assets/img/mugshots/tim-a.jpg"
              alt="Tim Archibold, Luton Location Administrator at Street Support Network"
              width={200}
              height={200}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              sizes="(max-width: 768px) 128px, 200px"
            />
            <h2 className="heading-5 mb-2">Tim Archibold</h2>
            <h3 className="heading-6 text-brand-a mb-3">Luton</h3>
            <p className="text-brand-l mb-4">
              Tim joined Signposts in July 2016 as Operations Manager and took over as CEO in July 2020. He brings with him over 13 year&apos;s experience working in the sector, having held a senior leadership role with NOAH Enterprise and Luton Borough Council prior to joining the Signposts team.
            </p>
            <a 
              href="mailto:luton@streetsupport.net"
              className="text-brand-a hover:text-brand-b underline"
            >
              Contact Tim
            </a>
          </div>

          <div className="card card-compact text-center">
            <Image
              src="/assets/img/mugshots/paul.jpg"
              alt="Paul Woodward, Reading Location Administrator at Street Support Network"
              width={200}
              height={200}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              sizes="(max-width: 768px) 128px, 200px"
            />
            <h2 className="heading-5 mb-2">Paul Scotting</h2>
            <h3 className="heading-6 text-brand-a mb-3">Nottingham</h3>
            <p className="text-brand-l mb-4">
              After a career as a lecturer in Genetics, Paul is using his retirement to volunteer with several organisations working with homeless people. This has led to his roles in coordinating activities across the homelessness sector in Nottingham.
            </p>
            <a 
              href="mailto:nottingham@streetsupport.net"
              className="text-brand-a hover:text-brand-b underline"
            >
              Contact Paul
            </a>
          </div>
        </div>
      </div>

      {/* Additional Contributors Section */}
      <div className="mb-16">
        <hr className="my-8 border-brand-q" />
        
        <p className="text-lead mb-8">
          We also have help from some amazing digital experts as needed. Here are a few of the people that have helped us along the way…
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="heading-3 mb-2">Vince Lee - Lead Developer</h2>
            <p className="text-brand-l">
              Vince is an experienced full stack developer who has led the development of Street Support Network from the start. He is a safe pair of hands, always reliable and dedicated to social change.
            </p>
          </div>

          <div>
            <h2 className="heading-3 mb-2">Oleksandr Seliuchenko - Freelance Developer</h2>
            <p className="text-brand-l">
              In recent years, Sasha has helped us out with a lot specific development tasks and projects. He always seems to be there when we need him and we&apos;re hugely grateful for his support.
            </p>
          </div>

          <div>
            <h2 className="heading-3 mb-2">Alex Atkinson - Designer</h2>
            <p className="text-brand-l">
              Alex is an experienced designer, generously giving his time for free to Street Support Network - we couldn&apos;t have done this without him!
            </p>
          </div>

          <div>
            <h2 className="heading-3 mb-2">Liam Roughley - Designer</h2>
            <p className="text-brand-l">
              Liam is the creativity behind the fantastic illustrations that you see at the top of our location homepages. His artwork really captures the unique nature of each location.
            </p>
          </div>
        </div>
      </div>
        <SocialShare />
      </div>
    </>
  );
}