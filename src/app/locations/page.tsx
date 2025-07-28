import Link from 'next/link';

export default function LocationsPage() {
  const locations = [
    { name: "Birmingham", slug: "birmingham" },
    { name: "Manchester", slug: "manchester" },
    { name: "London", slug: "london" },
  ];

  return (
    <main>
      {/* Breadcrumbs */}
      <div className="bg-brand-n py-4">
        <div className="container mx-auto px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-white hover:text-brand-q">
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <span className="text-white">Locations</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold mb-6">Our Locations</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <li key={loc.slug}>
            <a
              href={`/locations/${loc.slug}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{loc.name}</h2>
              <p className="text-sm text-gray-600">View services in {loc.name}</p>
            </a>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
