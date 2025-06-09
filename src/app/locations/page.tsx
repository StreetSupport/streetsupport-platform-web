export default function LocationsPage() {
  const locations = [
    { name: "Birmingham", slug: "birmingham" },
    { name: "Manchester", slug: "manchester" },
    { name: "London", slug: "london" },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
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
    </main>
  );
}
