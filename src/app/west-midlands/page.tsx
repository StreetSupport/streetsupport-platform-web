import Breadcrumbs from '@/components/ui/Breadcrumbs';
import GetInTouchBanner from '@/components/ui/GetInTouchBanner';
import NewsGrid from '@/components/News/NewsGrid';
import Link from 'next/link';
import Image from 'next/image';
import { generateSEOMetadata } from '@/utils/seo';
import WatsonXChat from '@/components/ui/WatsonXChat';

export const metadata = generateSEOMetadata({
  title: 'Street Support West Midlands',
  description: 'A home for Street Support Network in the West Midlands. Find homelessness support services across Birmingham, Coventry, Dudley, Sandwell, Solihull, Walsall, and Wolverhampton.',
  keywords: [
    'West Midlands homelessness support',
    'Birmingham homeless help',
    'Coventry street support',
    'Dudley homeless services',
    'Sandwell homelessness',
    'Solihull street support',
    'Walsall homeless help',
    'Wolverhampton homelessness services',
    'WMCA homelessness taskforce'
  ],
  path: 'west-midlands',
  image: '/assets/img/og/street-support.jpg'
});

const westMidlandsLocations = [
  { name: 'Birmingham', slug: 'birmingham' },
  { name: 'Coventry', slug: 'coventry' },
  { name: 'Dudley', slug: 'dudley' },
  { name: 'Sandwell', slug: 'sandwell' },
  { name: 'Solihull', slug: 'solihull' },
  { name: 'Walsall', slug: 'walsall' },
  { name: 'Wolverhampton', slug: 'wolverhampton' }
];

const giveHelpOptions = [
  {
    title: 'Give Items',
    description: 'Donate items that services near you are asking for.',
    href: '/give-help/offer-items'
  },
  {
    title: 'Volunteer',
    description: 'Volunteer at one of the local charities across the West Midlands.',
    href: '/give-help/volunteer'
  },
  {
    title: 'Donate Money',
    description: 'Make a donation locally.',
    href: '/give-help/donate'
  },
  {
    title: 'Learn More',
    description: 'Learn more about what you can do to help in the West Midlands.',
    href: '#'
  }
];

export default function WestMidlandsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "West Midlands", current: true }
        ]} 
      />

      {/* Hero Section */}
      <div className="block block--west-mids-header">
        <div className="container">
          <h1 className="h1 block__header">Street Support West Midlands</h1>
          <p className="block__content">
            Supporting people experiencing homelessness across the West Midlands region 
            through collaboration, resources, and community action.
          </p>
        </div>
      </div>

      {/* Location Grid */}
      <div className="block">
        <div className="block--west-mids-locations">
          <div className="west-mids-location">
            {westMidlandsLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/${location.slug}`}
                className="btn btn--west-mids-locations"
              >
                <span className="btn__text">{location.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* WMCA Homelessness Taskforce */}
      <div className="block block--highlight block--wmca-taskforce">
        <div className="container text-center">
          <h1 className="h1">WMCA Homelessness Taskforce</h1>
          <p>
            In 2017 the first Mayor of the West Midlands, Andy Street, established the WMCA Homelessness 
            Taskforce with the explicit commitment to bring together organisations, people and resources 
            to tackle homelessness in partnership with the 7 Local Authorities in the region. Since its 
            inception the Homelessness Taskforce has worked on a wide range of issues and initiatives 
            ranging from Housing First through to research work on Families in Temporary Accommodation.
          </p>
          <p>
            The Taskforce has developed new tools and resources to help organisations and service 
            systems maximise the impact they can have on homelessness prevention, which you can find by 
            following the link below. All our work focuses on Designing out Homelessness from policy, 
            practice and planning by Designing in Prevention so that we collectively make homelessness 
            rare, brief and non-recurring.
          </p>
          <Link
            href="https://www.wmca.org.uk/what-we-do/wmca-homelessness-taskforce/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--brand-d"
          >
            <span className="btn__text">Learn more</span>
          </Link>
        </div>
      </div>

      {/* Ways to Help */}
      <div className="block block--grey-highlight">
        <div className="container">
          <div className="block__content">
            <h2 className="h2">Do you want to help?</h2>
            <p>
              There are various ways to support people experiencing homelessness in the West Midlands. 
              Organisations, public services and voluntary groups work closely together to share resources 
              and maximise the donations made.
            </p>
          </div>
          <div className="block__content">
            {giveHelpOptions.map((option, index) => (
              <article key={index} className="card card--cta card--grid-1-of-4">
                <Link href={option.href} className="full-size-link">
                  <h2 className="h2 card__title card__title--kettle">{option.title}</h2>
                  <p>{option.description}</p>
                  <button className="btn btn--brand-e btn--always-full">
                    <span className="btn__text">{option.title}</span>
                  </button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Change into Action */}
      <div className="block block--change-into-action">
        <div className="container">
          <div className="block__change-into-action">
            <Image
              src="/assets/img/coventry-logos/cia-logo.png"
              alt="Change into Action logo"
              width={400}
              height={200}
              className="w-full h-auto"
            />
          </div>
          <div className="home__copy home__copy--change-into-action">
            <h1>Change into Action</h1>
            <p>
              <Link href="https://changeintoaction.org.uk/" target="_blank" rel="noopener noreferrer">
                Change into Action
              </Link> is an alternative giving scheme that provides a safe, easy and secure way for you to donate 
              money to fund practical support for people who are or have been rough sleeping in the West Midlands. 
              The scheme is administered and managed locally and brings together partners from key local 
              organisations, such as specialist homelessness charities and street teams that work with individuals 
              to identify those things that can really make a difference and help to move away from the streets. 
              Your donation will directly benefit a person sleeping rough or at risk.
            </p>
            <p>
              Change into action is available in{' '}
              <Link href="https://changeintoaction.org.uk/birmingham" target="_blank" rel="noopener noreferrer">Birmingham</Link>, {' '}
              <Link href="https://changeintoaction.org.uk/coventry" target="_blank" rel="noopener noreferrer">Coventry</Link>, {' '}
              <Link href="https://changeintoaction.org.uk/dudley" target="_blank" rel="noopener noreferrer">Dudley</Link>, {' '}
              <Link href="https://changeintoaction.org.uk/sandwell" target="_blank" rel="noopener noreferrer">Sandwell</Link>, {' '}
              <Link href="https://changeintoaction.org.uk/solihull" target="_blank" rel="noopener noreferrer">Solihull</Link> and {' '}
              <Link href="https://changeintoaction.org.uk/walsall" target="_blank" rel="noopener noreferrer">Walsall</Link>.
            </p>
            <Link
              href="https://changeintoaction.org.uk/donate/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--brand-e"
            >
              <span className="btn__text">Donate now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alternative Giving CIO - Wolverhampton */}
      <div className="block block--alternative-giving-campaign">
        <div className="container">
          <div className="block__alternative-giving-campaign">
            <Image
              src="/assets/img/wolverhampton-logos/agc.png"
              alt="Alternative Giving Campaign logo"
              width={400}
              height={200}
              className="w-full h-auto"
            />
          </div>
          <div className="home__copy home__copy--change-into-action">
            <h1>Alternative Giving CIO - Wolverhampton</h1>
            <p>
              <Link href="https://wolverhamptonchange.co.uk/" target="_blank" rel="noopener noreferrer">
                Alternative Giving CIO
              </Link> (Charity No. 1186415) is an opportunity for everyone and anyone to make the choice to give, 
              donate and support those in need. Your donation will help to change the way in which we help people 
              at risk of homelessness in the city by ensuring all funds raised reach those currently in severe hardship.
            </p>
            <Link
              href="https://www.justgiving.com/alternativegiving"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--brand-e"
            >
              <span className="btn__text">Donate now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div id="js-news-output">
        <NewsGrid 
          title="Latest News from the West Midlands"
          showSearch={false}
          maxItems={3}
        />
      </div>

      <GetInTouchBanner email="westmidlands@streetsupport.net" />

      {/* WatsonX Chat for West Midlands */}
      <WatsonXChat />

    </>
  );
}