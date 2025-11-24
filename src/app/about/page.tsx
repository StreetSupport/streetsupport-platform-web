import Link from 'next/link';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import { generateSEOMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'About Street Support',
    description: 'Learn about Street Support Network, our mission to connect people experiencing homelessness with local support services, and meet our team working to tackle homelessness.',
    keywords: [
      'about street support',
      'street support network',
      'homelessness charity',
      'homeless support organisation',
      'our mission',
      'tackle homelessness',
      'charity team'
    ],
    path: 'about',
    image: '/assets/img/og/street-support.jpg',
    imageAlt: 'About Street Support Network'
  });
}

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "About Street Support", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">About Street Support</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-12">
              <section>
                <p className="text-lead mb-8">Street Support Network connects local people and organisations in order to support those who need it the most. This website is an online hub to find out about homelessness, see what support is available, and see what you can do to help.</p>
                
                <div className="bg-brand-q p-8 rounded-lg mb-8">
                  <h3 className="heading-4 mb-6 text-brand-l">The primary reasons you might use our website:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-a rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <p className="text-body">To <Link href="/find-help" className="text-brand-a hover:text-brand-b underline font-semibold">Find Help</Link>: Get advice and see what support services are available near you, how to access them, and where there are gaps.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-a rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <p className="text-body">To <a href="https://news.streetsupport.net/" target="_blank" rel="noreferrer" className="text-brand-a hover:text-brand-b underline font-semibold">Learn</a>: Understand more about homelessness in your area, what is being done, and where the challenges and opportunities are.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-body mb-4">We also work offline, connecting people to co-produce better solutions, facilitating conversation and co-ordinating action.</p>
                <p className="text-body mb-4">We&apos;re a people-led network, where individuals with personal insight into homelessness and poverty, decision makers and people with resources co-create effective solutions together.</p>
                <p className="text-body mb-4">Through research, collaboration, human-centered design and creative technology, we work to develop tools and improve systems.</p>
                <p className="text-body">If you&apos;d like to find out more about why we do what we do, check out this piece that our co-founder, Viv Slack, has written about <Link href="/about/how-this-started/" className="text-brand-a hover:text-brand-b underline">how it all started</Link>.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Our Organisation</h2>
                <p className="text-body mb-4">Street Support Network Ltd is a Registered Charity [1177546]. We have been funded by donations from local philanthropists and friends, small grants, and business sponsorship.</p>
                <p className="text-body">In order to continue developing and growing our network, we&apos;re always on the lookout for businesses to partner with us. If you are interested in learning more about what that might look like, check out our <Link href="/give-help/business-support" className="text-brand-a hover:text-brand-b underline">Business Partnerships</Link> page.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Our Team</h2>
                <p className="text-body mb-4">We have a <Link href="/about/our-team" className="text-brand-a hover:text-brand-b underline">core team</Link> of four people, each with our own specialisms. Each location we are active in has a local co-ordinator, supported by organisations and volunteers.</p>
                <p className="text-body">In addition we have a <Link href="/about/our-trustees" className="text-brand-a hover:text-brand-b underline">board of trustees</Link>, a range of advisors and some dedicated volunteers, bringing different skills and experiences.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Partnerships</h2>
                <p className="text-body mb-4">So much of what we do comes down to our partnerships. We work in partnership with people experiencing homelessness, charities, voluntary groups, public and private sector, and just generally people who care.</p>
                <p className="text-body">Together we co-produce new features to meet different needs, and are continually improving the site based on user feedback. In addition to providing the online network, we also work behind the scenes to connect people and facilitate collaborative workshops with our wider network.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Organisations</h2>
                <p className="text-body mb-6">Our network includes organisations from all over the UK and across loads of different sectors that provide useful services for people who are experiencing, or at risk of experiencing homelessness. Because some of our users can be in quite vulnerable situations, we have to be really careful that where we&apos;re pointing them is the right direction. Because of this, we do have a standards toolkit. If you&apos;re curious, you can see the criteria we use in Manchester.</p>
                <Link 
                  href="/manchester/standards-toolkit/" 
                  className="btn-base btn-primary btn-lg"
                >
                  Information for organisations
                </Link>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Information Quality</h2>
                <p className="text-body">All the service information on the site is provided by organisations in our network, so while we really try to make sure it&apos;s kept up to date, we can&apos;t always guarantee the accuracy of information that is entered by third parties. Please <Link href="/about/contact" className="text-brand-a hover:text-brand-b underline">get in touch</Link> if you spot anything that is incorrect or missing.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Find out more</h2>
                <p className="text-body">You can find out more about our progress on our{' '}
                  <a href="https://www.facebook.com/streetsupport/" className="text-brand-a hover:text-brand-b underline">Facebook page</a>,{' '}
                  <a href="https://bsky.app/profile/streetsupport.net" className="text-brand-a hover:text-brand-b underline">Bluesky feed</a>, or you can{' '}
                  <a href="https://streetsupport.us12.list-manage.com/subscribe?u=da9a1d4bb2b1a69a981456972&id=c966413ba3" className="text-brand-a hover:text-brand-b underline">subscribe to our newsletter</a>.</p>
              </section>
            </div>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}
