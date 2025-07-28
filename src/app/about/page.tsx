import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="content-container p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-brand-k hover:text-brand-a">
                Home
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <span className="text-brand-f">About Street Support</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-2">About Street Support</h1>
      </div>

      {/* Main Content */}
      <div className="prose max-w-none">
        <p>Street Support Network connects local people and organisations in order to support those who need it the most.</p>
        <p>This website is an online hub to find out about homelessness, see what support is available, and see what you can do to help.</p>
        <p>There are three primary reasons you might use our website:</p>
        <ul>
          <li>
            <p>To <Link href="/find-help" target="_blank" className="text-brand-a hover:text-brand-b underline">Find Help</Link>: Get advice and see what support services are available near you, how to access them, and where there are gaps.</p>
          </li>
          <li>
            <p>To <a href="https://news.streetsupport.net/" target="_blank" className="text-brand-a hover:text-brand-b underline">Learn</a>: Understand more about homelessness in your area, what is being done, and where the challenges and opportunities are.</p>
          </li>
        </ul>
        <p>We also work offline, connecting people to co-produce better solutions, facilitating conversation and co-ordinating action.</p>
        <p>We're a people-led network, where individuals with personal insight into homelessness and poverty, decision makers and people with resources co-create effective solutions together.</p>
        <p>Through research, collaboration, human-centered design and creative technology, we work to develop tools and improve systems.</p>
        <p>If you'd like to find out more about why we do what we do, check out this piece that our co-founder, Viv Slack, has written about <Link href="/about/how-this-started/" className="text-brand-a hover:text-brand-b underline">how it all started</Link>.</p>

        {/* Divider */}
        <hr className="my-8 border-brand-q" />

        <h2 className="heading-4">Our Organisation</h2>
        <p>Street Support Network Ltd is a Registered Charity [1177546]. We have been funded by donations from local philanthropists and friends, small grants, and business sponsorship. In order to continue developing and growing our network, we're always on the lookout for businesses to partner with us. If you are interested in learning more about what that might look like, check out our <Link href="/give-help/business-support" className="text-brand-a hover:text-brand-b underline">Business Partnerships</Link> page.</p>

        <h2 className="heading-4">Our Team</h2>
        <p>We have a <Link href="/about/our-team" className="text-brand-a hover:text-brand-b underline">core team</Link> of four people, each with our own specialisms. Each location we are active in has a local co-ordinator, supported by organisations and volunteers.</p>
        <p>In addition we have a <Link href="/about/our-trustees" className="text-brand-a hover:text-brand-b underline">board of trustees</Link>, a range of advisors and some dedicated volunteers, bringing different skills and experiences.</p>

        <h2 className="heading-4">Partnerships</h2>
        <p>So much of what we do comes down to our partnerships. We work in partnership with people experiencing homelessness, charities, voluntary groups, public and private sector, and just generally people who care.</p>
        <p>Together we co-produce new features to meet different needs, and are continually improving the site based on user feedback. In addition to providing the online network, we also work behind the scenes to connect people and facilitate collaborative workshops with our wider network.</p>

        <h2 className="heading-4">Organisations</h2>
        <p>Our network includes organisations from all over the UK and across loads of different sectors that provide useful services for people who are experiencing, or at risk of experiencing homelessness. Because some of our users can be in quite vulnerable situations, we have to be really careful that where we're pointing them is the right direction. Because of this, we do have a standards toolkit. If you're curious, you can see the criteria we use in Manchester.</p>
        <Link 
          href="/manchester/standards-toolkit/" 
          className="btn-base btn-warning btn-md mt-4 mb-6"
        >
          Information for organisations
        </Link>

        <h2 className="heading-4">Information Quality</h2>
        <p>All the service information on the site is provided by organisations in our network, so while we really try to make sure it's kept up to date, we can't always guarantee the accuracy of information that is entered by third parties. Please <Link href="/about/contact" className="text-brand-a hover:text-brand-b underline">get in touch</Link> if you spot anything that is incorrect or missing.</p>

        {/* Divider */}
        <hr className="my-8 border-brand-q" />

        <h2 className="heading-4">Find out more</h2>
        <p>You can find out more about our progress on our
          <a href="https://www.facebook.com/streetsupport/" className="text-brand-a hover:text-brand-b underline"> Facebook page</a>,
          <a href="https://bsky.app/profile/streetsupport.net" className="text-brand-a hover:text-brand-b underline"> Bluesky feed</a>, or you can
          <a href="https://streetsupport.us12.list-manage.com/subscribe?u=da9a1d4bb2b1a69a981456972&id=c966413ba3" className="text-brand-a hover:text-brand-b underline"> subscribe to our newsletter</a>.</p>
      </div>
    </div>
  );
}
