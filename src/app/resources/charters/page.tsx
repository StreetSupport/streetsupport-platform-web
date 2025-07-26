import Link from 'next/link';

export default function ChartersPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/resources" className="text-gray-700 hover:text-blue-600">
                  Resources
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Charters</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Homelessness Charters</h1>
        <p className="text-xl text-gray-700">What is a Homelessness Charter, and do you need one?</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">So what is a homelessness charter?</h2>
        <p className="mb-4">A homelessness charter is an agreement to abide by a set of principles to work towards achieving a shared mission.</p>
        <p className="mb-6">It's a location-specific, public commitment that is written up and then signed by voluntary, faith, private and public sector organisations in the same location.</p>

        <h2 className="text-2xl font-semibold mb-4">How might my location benefit from having a homelessness charter?</h2>
        <p className="mb-4">Simply - to make sure everyone is on the same page (literally!).</p>
        <p className="mb-4">A charter facilitates everyone working together 'nicely'</p>
        <p className="mb-4">A charter might ask organisations to commit to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Setting out to achieve the aims outlined in the charter</li>
          <li>Adopting the values of the charter (eg. safety, respect, equal hiring opportunities)</li>
          <li>Agreeing to a specific code of conduct</li>
        </ul>
        <p className="mb-4">It's a way of getting people together to ensure a focused approach to tackling homelessness in a location.</p>
        <p className="mb-6">Another reason you might have a charter is to clearly set out your locations ambitions for tackling homelessness. Are you setting out to end homelessness, or are you setting out to end rough sleeping? Where the scope is so broad, it's important to be specific about the task in hand.</p>

        <h2 className="text-2xl font-semibold mb-4">How do I go about producing one for my location?</h2>
        <p className="mb-4">Well we reckon there's not much point in reinventing the wheel.</p>
        <p className="mb-4">Having said that, locations vary, and charters do, too.</p>
        <p className="mb-4">We suggest rifling through these. Be a magpie, pick and choose aspects (feel free to copy and paste) to pull together something that you think will work best for your location.</p>
        <p className="mb-6">Nobody knows your location as well as you, but we're always here if you'd like a second opinion.</p>

        <hr className="my-8 border-gray-300" />

        <p className="font-semibold mb-6">Some charters that we have supported:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <a href="https://mhp.org.uk/charter/" target="_blank" rel="noopener noreferrer" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Manchester Charter</h3>
            </article>
          </a>
          <a href="/leeds/charter" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Leeds Charter</h3>
            </article>
          </a>
          <a href="/southampton/charter" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Southampton Charter</h3>
            </article>
          </a>
          <a href="/derbyshire/derbyshire-homelessness-charter.pdf" className="block">
            <article className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
              <h3 className="text-xl font-semibold">Derbyshire Charter</h3>
            </article>
          </a>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Some other useful resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/resources/alternative-giving" className="text-blue-600 hover:text-blue-800 underline">Alternative Giving</Link>
          </li>
          <li>
            <Link href="/resources/effective-volunteering" className="text-blue-600 hover:text-blue-800 underline">Effective Volunteering</Link>
          </li>
          <li>
            <Link href="/resources/street-feeding-groups" className="text-blue-600 hover:text-blue-800 underline">Street Feeding Groups</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}