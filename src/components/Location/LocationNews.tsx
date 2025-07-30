'use client';

import { useState, useEffect } from 'react';

interface LocationNewsProps {
  locationSlug: string;
  locationName: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  date: string;
  author: string;
}

interface NewsData {
  news: NewsItem[];
  isLocationSpecific: boolean;
  location: string;
  error?: string;
}

export default function LocationNews({ locationSlug, locationName }: LocationNewsProps) {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/locations/${locationSlug}/news`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setNewsData(data.data);
        } else {
          throw new Error(data.message || 'Failed to load news');
        }
      } catch (err) {
        console.error('Error fetching location news:', err);
        setError('Unable to load news at this time');
      } finally {
        setLoading(false);
      }
    };

    if (locationSlug) {
      fetchNews();
    }
  }, [locationSlug]);

  if (loading) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-a"></div>
          <span className="ml-2 text-brand-f">Loading news...</span>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        <p className="text-brand-f mb-4">{error || 'News unavailable'}</p>
        <a 
          href="https://news.streetsupport.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-brand-a hover:text-brand-b underline text-sm"
        >
          Visit our news site
        </a>
      </div>
    );
  }

  if (newsData.news.length === 0) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        <p className="text-brand-f mb-4">
          {newsData.isLocationSpecific 
            ? `No recent news for ${locationName}` 
            : 'No recent news available'
          }
        </p>
        <a 
          href="https://news.streetsupport.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-brand-a hover:text-brand-b underline text-sm"
        >
          Visit our news site
        </a>
      </div>
    );
  }

  return (
    <div className="bg-brand-q p-8 h-full flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Latest News</h2>
        {newsData.isLocationSpecific && (
          <p className="text-sm text-brand-f">News from {locationName}</p>
        )}
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        {newsData.news.map((item) => (
          <article key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-2 leading-tight">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-l hover:text-brand-a transition-colors"
              >
                {item.title}
              </a>
            </h3>
            
            {item.excerpt && (
              <p className="text-xs text-brand-f mb-2 line-clamp-2">
                {item.excerpt}
              </p>
            )}
            
            <div className="text-xs text-brand-f">
              <span>{item.date}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <a 
          href={newsData.isLocationSpecific 
            ? `https://news.streetsupport.net/location/${locationSlug}/` 
            : 'https://news.streetsupport.net'
          } 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-brand-a hover:text-brand-b underline text-sm font-medium"
        >
          {newsData.isLocationSpecific 
            ? `View all ${locationName} news` 
            : 'View all news'
          }
        </a>
      </div>
    </div>
  );
}