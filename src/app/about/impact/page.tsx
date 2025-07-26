import Link from 'next/link';

export default function ImpactPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
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
                <span className="text-gray-500">Impact</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Impact</h1>
      </div>

      {/* Content */}
      <div className="text-center">
        <p className="text-lg mb-8">
          Our mission is to make it easier for anyone experiencing homelessness to get the help they need. We connect organisations that provide services, with individuals and businesses that want to do something to help. Here are the latest key facts and examples of how Street Support is making an impact.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Impact Report</h2>
          <p className="mb-2">
            <a 
              href="https://drive.google.com/file/d/16nsU03iAbJH_T0mpc_eUGkiK0ZiDgNzR/view" 
              target="_blank" 
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Key highlights of Street Support Network Impact Report 2016-2019
            </a>.
          </p>
          <p>
            <a 
              href="https://drive.google.com/file/d/14T4Wq7FINX0Je2YQ3kW9jPh4bQ6aVStS/view" 
              target="_blank" 
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Impact Report 2016-2019 (full report)
            </a>.
          </p>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300" />

        {/* Latest Statistics */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-8">Latest Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2" id="totalServiceProviders">
                {/* This would be dynamically loaded in the original */}
                850+
              </div>
              <div className="text-gray-600 font-medium">Service Providers listed</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2" id="totalServices">
                {/* This would be dynamically loaded in the original */}
                3,200+
              </div>
              <div className="text-gray-600 font-medium">Services listed</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">2607163</div>
              <div className="text-gray-600 font-medium">Views to date</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">961360</div>
              <div className="text-gray-600 font-medium">Users to date</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">31</div>
              <div className="text-gray-600 font-medium">Local Partnerships Supported</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">7</div>
              <div className="text-gray-600 font-medium">Comprehensive Resource Guides</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">17</div>
              <div className="text-gray-600 font-medium">Network Events Hosted</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">618</div>
              <div className="text-gray-600 font-medium">News Items Shared</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}