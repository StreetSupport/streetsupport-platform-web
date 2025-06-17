import Link from 'next/link';
import locations from '@/data/locations.json';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// @ts-expect-error Next dynamic param inference workaround
export default async function LocationPage(props) {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    notFound();
  }

  return (
    <main className="space-y-12">
      {/* ✅ Breadcrumbs */}
      <nav className="bg-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <ol className="flex space-x-2 text-sm text-gray-700">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">/</span>
            </li>
            <li>{location.name}</li>
          </ol>
        </div>
      </nav>

      {/* ✅ Location Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Street Support {location.name}
          </h1>
          <h2 className="text-xl text-gray-700 mb-4">
            Connecting people and organisations locally, to tackle homelessness in {location.name}.
          </h2>
          <Link
            href="/find-help"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
          >
            Find Help
          </Link>
        </div>
      </section>

      {/* ✅ Emergency Highlight Block */}
      <section className="bg-yellow-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
          </div>
          <h2 className="text-2xl font-bold mb-2">Help someone sleeping rough</h2>
          <p className="mb-2">
            If you are worried about someone you’ve seen sleeping rough anywhere in {location.name}, you can inform 
            <a href="https://thestreetlink.org.uk" className="text-blue-600 hover:underline"> StreetLink</a>.
          </p>
          <p className="mb-4">
            If the person is in immediate danger or needs urgent care, please call 
            <a href="tel:999" className="text-blue-600 hover:underline"> 999</a>.
          </p>
          <Link
            href={`/${location.slug}/advice`}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700 transition"
          >
            See more emergency advice
          </Link>
        </div>
      </section>

      {/* ✅ Main Intro & Find Help Placeholder */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            You’re in {location.name}
          </h2>
          <p className="text-gray-700 mb-6">
            This section will include search and support tools for finding help in {location.name}.
          </p>
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
            [ Find Help Component Placeholder ]
          </div>
        </div>
      </section>

      {/* ✅ Map Placeholder */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Map</h2>
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500">
            [ Map Placeholder ]
          </div>
        </div>
      </section>

      {/* ✅ Statistics & News Placeholders */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Impact Statistics</h2>
            <p>[ Statistics Placeholder ]</p>
          </div>
          <div className="bg-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Latest News</h2>
            <p>[ News Placeholder ]</p>
          </div>
        </div>
      </section>

      {/* ✅ Partners & CTA */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="mb-4">
            If you’d like to get involved or have suggestions, please contact us at 
            <a href={`mailto:${slug}@streetsupport.net`} className="text-blue-600 hover:underline"> {slug}@streetsupport.net</a>.
          </p>
          <p>
            We are looking for businesses and organisations to 
            <Link href="/give-help/business-support/" className="text-blue-600 hover:underline"> support us</Link> so we can keep improving this resource.
          </p>
        </div>
      </section>
    </main>
  );
}
