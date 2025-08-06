'use client';

interface NewsHeaderProps {
  title: string;
  description?: string;
  showCategories?: boolean;
}

const categories = [
  { 
    name: 'Stories', 
    slug: 'stories',
    description: 'Personal experiences and impact stories from our community',
    color: 'bg-brand-a'
  },
  { 
    name: 'Articles', 
    slug: 'articles',
    description: 'In-depth analysis and insights on homelessness and housing',
    color: 'bg-yellow-600'
  },
  { 
    name: 'Latest News', 
    slug: 'latest-news',
    description: 'Platform updates and sector developments',
    color: 'bg-purple-700'
  }
];

export default function NewsHeader({ title, description, showCategories = true }: NewsHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-brand-a via-brand-b to-brand-c text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          {description && (
            <p className="text-xl text-brand-q opacity-90 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {showCategories && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`https://news.streetsupport.net/category/${category.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${category.color} text-white p-6 rounded-lg hover:opacity-90 transition-all duration-300 group shadow-lg`}
              >
                <h3 className="font-semibold text-lg mb-2 text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-white opacity-90 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-sm font-medium text-white">
                  Explore category
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="https://news.streetsupport.net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-white !text-brand-l font-semibold rounded-lg hover:bg-brand-q transition-colors duration-300"
          >
            Visit Full News Site
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}