import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function StreetFeedingGroupsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/resources", label: "Resources" },
          { label: "Street Feeding Groups", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">Street Feeding Groups</h1>
          <p className="text-lead text-white">Our stance on Street Feeding for sustainable support and change.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

      {/* Content */}
      <div className="prose max-w-none">
        <p className="mb-4">'Street Feeding' groups are volunteer-led groups that provide food/hot drinks to people on the street.</p>
        <p className="mb-4">Street Support Network doesn't list or advocate for street feeding groups. This is a decision that has been informed over time and over many conversations with organisations and individuals in the sector.</p>
        <p className="mb-4">It's a really tricky one because street feeding groups are born out of the very best of human nature. It's people sacrificing time, energy and often money to help others.</p>
        <p className="mb-6">There are two main reasons why we feel we can't support street feeding groups:</p>

        <ol className="list-decimal pl-6 space-y-6 mb-8">
          <li>
            <p>People who access our site to look for support services are often in very vulnerable situations. We need to make sure that every organisation that's on there is a registered charity with a safeguarding policy. This means the staff will be DBS checked, trained to deal with clients with complex needs, and be well-informed of what might be that client's next best steps.</p>
            <p>That's how we can ensure that we've done everything on our end to provide our users with the safest, most reliable support.</p>
          </li>
          <li>
            <p>As you may know from our work in helping to set up Alternative Giving campaigns around the country, we're big on supporting solutions that help people break the cycle of street homelessness.</p>
            <p>The way street feeding affects individuals is nuanced but there comes a point at which we have to decide if enabling them to stay where they are is preventing them from accessing support.</p>
            <p>We're so lucky that there are <a href="https://streetsupport.net/find-help/all-service-providers" className="text-brand-a hover:text-brand-a underline">thousands of brilliant organisations across the country</a> that work to support clients in their journey out of homelessness. Many of these organisations practise a well-researched, lived experience-informed, holistic approach - and for that reason we're leaning away from advocating for short-term solutions.</p>
          </li>
        </ol>

        <h2 className="heading-3 mb-4">Other routes</h2>
        <p className="mb-4">If you're a street-feeding group and you're thinking about how you could reshuffle your efforts into a longer-term solution, there's a bunch of things you can try!</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Donating your food to front-line charities and drop-in centres</li>
          <li>Working with hostels and temporary accommodation to provide meals for residents</li>
          <li>Volunteering for local organisations</li>
          <li>Setting up as a registered charity yourselves</li>
        </ul>

        <p className="mb-8">We'd really recommend sending an email to your local homelessness partnership expressing your interest in helping out. The sector is consistently under-resourced and under-funded so you really could make an invaluable difference.</p>

        <hr className="my-8 border-gray-300" />

        <h2 className="heading-3 mb-4">Some other useful resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/resources/alternative-giving" className="text-brand-a hover:text-brand-a underline">Alternative Giving</Link>
          </li>
          <li>
            <Link href="/resources/charters" className="text-brand-a hover:text-brand-a underline">Charters</Link>
          </li>
          <li>
            <Link href="/resources/effective-volunteering" className="text-brand-a hover:text-brand-a underline">Effective Volunteering</Link>
          </li>
        </ul>
        </div>
      </div>
    </>
  );
}