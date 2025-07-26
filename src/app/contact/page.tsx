import Link from 'next/link';

export default function ContactPage() {
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
                <Link href="/about" className="text-gray-700 hover:text-blue-600">
                  About
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Contact</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Us</h1>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <div className="text-center mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold">
            <strong>Please note that we do not run any frontline services. Please check for suitable organisations in the
              <Link href="/find-help/" className="text-blue-600 hover:text-blue-800 underline"> Find Help</Link> section if you are experiencing homelessness and need support.</strong>
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">General enquiries</h2>
        <p className="mb-8">If you have any questions, ideas, or would like to know more about us, you can get in touch at
          <a href="mailto:info@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline"> info@streetsupport.net</a>.</p>

        <h2 className="text-2xl font-semibold mb-4">Locations</h2>
        <p className="mb-4">For questions specific to one of our locations, please contact our city admins at one of the following addresses:</p>

        <ul className="list-disc pl-6 space-y-1 mb-8">
          <li>
            <a href="mailto:bournemouth@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">bournemouth@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:brightonandhove@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">brightonandhove@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:cambridge@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">cambridge@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:edinburgh@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">edinburgh@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:luton@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">luton@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:nottingham@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">nottingham@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:reading@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">reading@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:southampton@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">southampton@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:wakefield@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">wakefield@streetsupport.net</a>
          </li>
          <li>
            <a href="mailto:westmidlands@streetsupport.net" className="text-blue-600 hover:text-blue-800 underline">westmidlands@streetsupport.net</a>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Join the conversation</h2>
        <p>You can join the conversation on
          <a href="https://x.com/streetsupportuk" className="text-blue-600 hover:text-blue-800 underline"> X</a>,
          <a href="https://www.facebook.com/streetsupport/" className="text-blue-600 hover:text-blue-800 underline"> Facebook</a> or subscribe to our <a href="http://eepurl.com/gvtAjT" className="text-blue-600 hover:text-blue-800 underline">UK Network mailing list</a>.</p>
      </div>
    </div>
  );
}
