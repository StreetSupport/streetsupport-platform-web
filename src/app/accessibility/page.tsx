import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <main>
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
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <span className="text-white">Accessibility</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        <h1>Accessibility Statement</h1>
        <p>Accessibility statement content goes here.</p>
      </div>
    </main>
  );
}
