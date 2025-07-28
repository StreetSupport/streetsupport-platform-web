import Link from 'next/link';

export default function AlternativeGivingPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-brand-l hover:text-brand-a">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <Link href="/resources" className="text-brand-l hover:text-brand-a">
                  Resources
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <span className="text-brand-f">Alternative Giving</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 mb-4">Alternative Giving Funds</h1>
        <p className="text-lead">What it means to give differently, and why you should be thinking about it.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="heading-3 mb-4">What is an alternative giving fund?</h2>
        <p className="mb-6">An Alternative Giving fund is a pot of money used to invest in the futures of people experiencing, or at risk of experiencing homelessness. It's a way for members of the public to give money knowing that it will help someone who is vulnerable or experiencing homelessness.</p>

        <h2 className="heading-3 mb-4">Why is it important?</h2>
        <p className="mb-4">Giving money to people on the street isn't always the best option, because although it may buy them dinner, it also means they can survive longer without permanent accommodation.</p>
        <p className="mb-6">Alternative Giving is about helping people break the cycle of homelessness for good by providing long-term support on the journey to independent living. Examples of how the funding can be used include a contribution towards utility bills, a training course, clothes for a job interview or furnishing a new home.</p>

        <h2 className="heading-3 mb-4">How does it work?</h2>
        <p className="mb-6">The schemes differ from location to location but in general, people who need access to the money will work with someone frontline to submit a funding application. The application will then be seen by the committee who sit over the fund. Ideally the committee will be made up of a diverse team, often including people with lived experience of homelessness.</p>

        <h2 className="heading-3 mb-4">How do you set up an alternative giving fund?</h2>
        <p className="mb-4">Each city has its own formula to success - what works well for one doesn't necessarily work for them all. Because of this, your alternative giving fund needs to begin with trial and error. Luckily, we have a whole network who have done exactly the same before you and are happy to share their blueprints and experiences.</p>
        <p className="mb-4">What all successful Alternative Giving schemes have in common is a strong partnership. Alternative Giving has benefits for lots of different sectors including BIDs, police, and councils. Assembling those people to decide on your scheme's purposes is the first step.</p>
        <p className="mb-6">Then - talk to us. Whether you're in Street Support Network or not, let's chat and we'll connect you with people who can guide and advise you in your Alternative Giving journey.</p>

        <p className="font-semibold mb-4">Additional alternative giving Resources:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><a href="/resources/alternative-giving/ag-wins.pdf" className="text-brand-a hover:text-brand-a underline">SSN's Alternative Giving Easy Wins sheet</a></li>
          <li><a href="https://youtu.be/afNgjl3g92g?si=eTnbEfmiz4VwluNP" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">SSN's 2023 Network Meeting on Alternative Giving</a></li>
          <li><a href="/resources/alternative-giving/notes-from-ag-event.pdf" className="text-brand-a hover:text-brand-a underline">The notes from the above event</a></li>
          <li><a href="https://youtu.be/YoNlXuUoHaM" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Real Change MCR's PR video with examples of where the fund goes</a></li>
          <li><a href="https://youtu.be/25Hw0nsr0J0" target="_blank" rel="noopener noreferrer" className="text-brand-a hover:text-brand-a underline">Cambridge PR video</a></li>
        </ul>

        <p className="font-semibold mb-6">Alternative giving funds we have supported:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/luton" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Big Change Luton</h3>
            </article>
          </Link>
          <Link href="/liverpool" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Change Liverpool</h3>
            </article>
          </Link>
          <Link href="/manchester/realchangemcr" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Real Change Manchester</h3>
            </article>
          </Link>
          <Link href="/cambridgeshire" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Street Aid Cambridge</h3>
            </article>
          </Link>
          <Link href="/nottingham/street-aid" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Street Aid Nottingham</h3>
            </article>
          </Link>
        </div>

        <hr className="my-8 border-gray-300" />

        <h2 className="heading-3 mb-4">Some other useful resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/resources/charters" className="text-brand-a hover:text-brand-a underline">Charters</Link>
          </li>
          <li>
            <Link href="/resources/effective-volunteering" className="text-brand-a hover:text-brand-a underline">Effective Volunteering</Link>
          </li>
          <li>
            <Link href="/resources/street-feeding-groups" className="text-brand-a hover:text-brand-a underline">Street Feeding Groups</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}