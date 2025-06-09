export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">About Street Support Network</h1>
      <p className="text-lg mb-6">
        Street Support Network connects people experiencing homelessness with essential services and
        resources in their local area—quickly, easily, and free of charge.
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>Up-to-date directory of shelters, drop-in centres, and meal programs</li>
        <li>Real-time availability and contact information</li>
        <li>Volunteer opportunities and donation guidelines</li>
      </ul>
      <a
        href="/find-help"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Find Help Now
      </a>
    </main>
)
}
