import Link from 'next/link';

export default function EffectiveVolunteeringPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-brand-n py-4">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-white hover:text-brand-q">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <Link href="/resources" className="text-white hover:text-brand-q">
                    Resources
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <span className="text-white">Effective Volunteering</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">Effective Volunteering</h1>
          <p className="text-lead text-white">How to make the most impact with your volunteering.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

      {/* Content */}
      <div className="prose max-w-none">
        <p className="mb-6">In this short guide, we will explain about different types of volunteering roles, the difference volunteers can make to charity, and how converting your short-term volunteering into a long-term fixture can create real, lasting change.</p>

        <h2 className="heading-3 mb-4">Why should I volunteer in the homelessness sector?</h2>
        <p className="mb-4">The number of people experiencing homelessness in the UK is constantly increasing which means that organisations in the sector are under more pressure than ever.</p>
        <p className="mb-6">Because of this, a huge amount of these organisations wouldn't be able to exist without their volunteers.</p>

        <h2 className="heading-3 mb-4">How can I make the most impact with my volunteering?</h2>
        <p className="mb-4">The really simple answer to this is <strong>skills-based volunteering</strong>.</p>
        <p className="mb-4">If you know how to get followers on social media, get in touch with a charity of your choice and offer to build them an online presence.</p>
        <p className="mb-4">If you know your way around a kitchen, see if any frontline walk-in centres near you need a chef to help them provide hot meals in the evenings.</p>
        <p className="mb-6">Charities are often unable to afford the business services that companies in other sectors can. Just like other organisations, charities really benefit from accountants, cleaners, solicitors, HR support and pretty much anything else you can think of.</p>

        <h2 className="heading-3 mb-4">What if I want to use different skills from my day job?</h2>
        <p className="mb-4">Another really simple answer here - <strong>make your volunteering long term</strong>.</p>
        <p className="mb-4">We get lots of people asking how best to spend a day volunteering, but the problem with that is that many volunteering roles in the sector require preparation and training. That's half the day gone already, both for you and whoever is training you.</p>
        <p className="mb-4">If you're looking for a mutually beneficial arrangement that will have a real, lasting impact, spread out your volunteering sessions. If you were able to give a few hours a week to a charity shop, or a food pantry, or delivering goods to organisations, it could be the difference that a charity or initiative needs to keep running.</p>
        <p className="mb-6">It could also have a greater impact on you in terms of learning and retaining skills and building relationships.</p>

        <h2 className="heading-3 mb-4">How can my company volunteer effectively?</h2>
        <p className="mb-4">Much like volunteering as an individual, to maximise the impact volunteering as part of a company the key is <strong>skills-based and long-term volunteering</strong>.</p>
        <p className="mb-4">What are your company's specialties? Marketing, Law, IT, Laundry, Driving?</p>
        <p className="mb-4">A great way to make a huge difference is to partner with one or two charities who otherwise might not be able to afford your services and support them in the same way you do with your other customers.</p>
        <p className="mb-6">This can be incredibly rewarding for you as well as them. You know you're making a difference to your community, ticking your social corporate responsibility box and building valuable lasting relationships.</p>

        <h2 className="heading-3 mb-4">What if long-term volunteering isn't realistic for me or my company?</h2>
        <p className="mb-4">If you're a corporate team and you really do just have a day to spare, you could make much more of an <strong>impact by fundraising</strong>.</p>
        <p className="mb-6">Whether it's a sponsored cycle or a bake sale, the money you raise could really make a real difference to homelessness charities.</p>

        <h2 className="heading-3 mb-4">Where do I start?</h2>
        <p className="mb-4">If you're based in a <a href="https://streetsupport.net/locations/" className="text-brand-a hover:text-brand-a underline">Street Support location</a>, go to <a href="https://streetsupport.net/find-help/" className="text-brand-a hover:text-brand-a underline">Find Help</a>, type in your postcode and you'll be presented with organisations near you and their contact details.</p>
        <p className="mb-4">If you're not in a Street Support Location, it's as simple as a web search.</p>
        <p className="mb-6">When you've found a charity you'd like to support, pop them an email with your intentions and any skills. It really is as easy as that!</p>

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
            <Link href="/resources/street-feeding-groups" className="text-brand-a hover:text-brand-a underline">Street Feeding Groups</Link>
          </li>
        </ul>
        </div>
      </div>
    </>
  );
}