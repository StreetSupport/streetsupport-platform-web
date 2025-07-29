import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function OurTrusteesPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { label: "Our Trustees and Advisors", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-2 text-white">Our Trustees and Advisors</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="prose max-w-none">
        <p className="text-lead mb-8">
          Alongside our core team, we have fantastic Trustees and Advisors with a range of skills & experiences to guide our decisions.
        </p>
        
        {/* Trustees Section */}
        <h2 className="heading-3 mb-6">Trustees</h2>
        
        <article className="mb-8 card card-compact">
          <div className="flex items-start">
            <Image
              src="/assets/img/mugshots/catherine.jpg"
              alt="Catherine Lynagh"
              width={150}
              height={150}
              className="rounded-lg mr-6 flex-shrink-0"
              sizes="(max-width: 768px) 100px, 150px"
            />
            <div>
              <h2 className="heading-5 mb-4">Catherine Lynagh</h2>
              <p className="text-brand-l leading-relaxed">
                I provide support to Viv and Gary on business matters such as legal and finance, raising funds and strategy. Previously I was finance director for a housing association and more recently I provided consultancy services in that sector. My experience of the challenges around tackling homelessness attracted me to the great work that Street Support does and in particular it's inclusive and collaborative approach.
              </p>
            </div>
          </div>
        </article>

        <article className="mb-8 card card-compact">
          <div className="flex items-start">
            <Image
              src="/assets/img/mugshots/julie.png"
              alt="Julie Cook"
              width={150}
              height={150}
              className="rounded-lg mr-6 flex-shrink-0"
              sizes="(max-width: 768px) 100px, 150px"
            />
            <div>
              <h2 className="heading-5 mb-4">Julie Cook</h2>
              <p className="text-brand-l leading-relaxed">
                I have worked in the housing & homelessness sector for over 30 years after graduating with a Housing Degree from Sheffield Hallam way back in the 80's, starting out as a front line Homelessness Officer and progressing in local government to heading up a Housing & Benefits Service. I am now enjoying part time work in the charitable sector, most recently with Homeless Link. I'm still passionate about tackling homelessness and the need for collaboration and partnership amongst all those in the sector. I am also a Trustee of Housing Justice.
              </p>
            </div>
          </div>
        </article>

        {/* Divider */}
        <hr className="my-8 border-brand-q" />

        {/* Advisors Section */}
        <h2 className="heading-3 mb-6">Advisors</h2>
        
        <article className="mb-8 card card-compact">
          <div className="flex items-start">
            <Image
              src="/assets/img/mugshots/charles.jpg"
              alt="Charles Gray"
              width={150}
              height={150}
              className="rounded-lg mr-6 flex-shrink-0"
              sizes="(max-width: 768px) 100px, 150px"
            />
            <div>
              <h2 className="heading-5 mb-4">Charles Gray - Finance & Business Admin</h2>
              <div className="text-brand-l leading-relaxed space-y-4">
                <p>
                  I'm responsible for managing the Finances and Business Admininstration for Street Support. This includes producing the management accounts, processing invoices and making payments. I get involved with Grant applications and the admin associated with our charitable status. I also assist the directors and trustees with business advice.
                </p>
                <p>
                  I was previously Managing Director and Finance Director for a logistics company and come from a finance background having qualified as a Chartered Accountant.
                </p>
                <p>
                  For some time I have wanted to step back from corporate life and apply my experience to more charitable purposes. I was delighted to get the opportunity to assist Street Support from its inception. I was really impressed with the founders' enthusiasm and dedication to deliver real solutions to relieve the hardships caused by homelessness. They have achieved so much from such a low level of resources and it has been a pleasure to support them along the way.
                </p>
              </div>
            </div>
          </div>
        </article>
        </div>
        <SocialShare />
      </div>
    </>
  );
}