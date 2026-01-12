'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  date: string;
  author: string;
  category?: string;
  imageUrl?: string;
}

interface NewsGridProps {
  title?: string;
  showSearch?: boolean;
  maxItems?: number;
  className?: string;
}

// Category color mapping based on WordPress categories
const getCategoryColor = (category: string) => {
  const categoryMap: Record<string, string> = {
    'stories': 'bg-brand-a text-white',
    'articles': 'bg-brand-d text-brand-l',
    'latest-news': 'bg-brand-h text-white',
    'partnerships': 'bg-brand-b text-white',
    'events': 'bg-brand-j text-brand-l',
    'policy': 'bg-brand-g text-white',
    'research': 'bg-brand-g text-white',
    'announcements': 'bg-brand-s text-brand-l',
    'default': 'bg-brand-f text-white'
  };
  
  const lowerCategory = category?.toLowerCase() || '';
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerCategory.includes(key)) {
      return value;
    }
  }
  return categoryMap.default;
};

export default function NewsGrid({ 
  title = "Latest News", 
  showSearch = true, 
  maxItems = 12,
  className = ""
}: NewsGridProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from general RSS feed for main news page
        const response = await fetch('/api/news/general');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          const newsItems = data.data.news.slice(0, maxItems);
          setNews(newsItems);
          setFilteredNews(newsItems);
        } else {
          throw new Error(data.message || 'Failed to load news');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Unable to load news at this time. Please visit our news site directly.');
        setNews([]);
        setFilteredNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [maxItems]);

  // Filter news based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchTerm, news]);

  if (loading) {
    return (
      <div className={`max-w-6xl mx-auto px-6 py-12 ${className}`}>
        {title && <h2 className="text-3xl font-bold text-brand-l mb-8 text-center">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto px-6 py-12 ${className}`}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-l mb-4">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-d to-brand-a mx-auto rounded-full"></div>
        </div>
      )}

      {showSearch && (
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-a focus:border-transparent transition-colors"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <p className="mb-4">{error}</p>
            <a 
              href="https://news.streetsupport.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand-a hover:text-brand-b font-semibold transition-colors"
            >
              Visit News Site
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {!error && filteredNews.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm ? (
              <>
                <p className="mb-4">No articles found matching &ldquo;{searchTerm}&rdquo;</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-brand-a hover:text-brand-b font-semibold transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No news articles available at the moment.</p>
            )}
          </div>
        </div>
      )}

      {!error && filteredNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article 
              key={item.id} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group"
            >
              {item.category && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              )}
              
              <h3 className="text-xl font-semibold mb-3 text-brand-l group-hover:text-brand-a transition-colors">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              </h3>
              
              {item.excerpt && (
                <p className="text-brand-f mb-4 leading-relaxed text-sm">
                  {item.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-brand-f">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{item.date}</span>
                </div>
                
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-a hover:text-brand-b font-medium transition-colors inline-flex items-center"
                >
                  Read more
                  <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {!error && filteredNews.length > 0 && (
        <div className="text-center mt-12">
          <a
            href="https://news.streetsupport.net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-brand-a text-white font-semibold rounded-lg hover:bg-brand-b transition-colors duration-300"
          >
            View All News
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      )}

      {searchTerm && filteredNews.length > 0 && (
        <div className="text-center mt-8 text-sm text-brand-f">
          Showing {filteredNews.length} of {news.length} articles
        </div>
      )}
    </div>
  );
}