import { NextResponse } from 'next/server';

interface LocationNewsParams {
  params: Promise<{ slug: string }>;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  date: string;
  author: string;
}

export async function GET(req: Request, context: LocationNewsParams) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      return NextResponse.json(
        { status: 'error', message: 'Location slug is required' },
        { status: 400 }
      );
    }

    // Use location taxonomy feed which includes all categories for that location
    const locationFeedUrl = `https://news.streetsupport.net/location/${slug}/feed/`;
    const generalFeedUrl = 'https://news.streetsupport.net/feed/';

    let allNews: NewsItem[] = [];
    let hasLocationSpecificContent = false;

    // Try location-specific feed first
    try {
      const locationResponse = await fetch(locationFeedUrl, {
        headers: { 'User-Agent': 'StreetSupport-Platform/1.0' },
        signal: AbortSignal.timeout(6000),
      });

      if (locationResponse.ok) {
        const xml = await locationResponse.text();
        const news = parseRSSFeed(xml, undefined, `location-${slug}`);
        if (news.length > 0) {
          allNews = news;
          hasLocationSpecificContent = true;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch location-specific feed:`, error);
    }

    // If no location-specific content, fetch general feed as fallback
    if (allNews.length === 0) {
      try {
        const generalResponse = await fetch(generalFeedUrl, {
          headers: { 'User-Agent': 'StreetSupport-Platform/1.0' },
          signal: AbortSignal.timeout(6000),
        });

        if (generalResponse.ok) {
          const xml = await generalResponse.text();
          const news = parseRSSFeed(xml, undefined, 'general');
          allNews = news;
        }
      } catch (error) {
        console.warn(`Failed to fetch general feed:`, error);
      }
    }

    // Remove duplicates based on link and sort by date (most recent first)
    const uniqueNews = allNews.filter((item, index, arr) => 
      arr.findIndex(i => i.link === item.link) === index
    ).sort((a, b) => {
      // Handle date parsing more robustly
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    const newsResponse = NextResponse.json({
      status: 'success',
      data: {
        news: uniqueNews.slice(0, 3), // Limit to 3 most recent
        isLocationSpecific: hasLocationSpecificContent,
        location: slug
      }
    });

    // Add cache headers
    newsResponse.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600'); // 30 min browser, 1 hour CDN
    
    return newsResponse;
  } catch (error) {
    console.error('[API ERROR] /api/locations/[slug]/news:', error);
    
    // Return fallback data instead of error
    return NextResponse.json({
      status: 'success',
      data: {
        news: [],
        isLocationSpecific: false,
        location: 'unknown',
        error: 'Unable to fetch news at this time'
      }
    });
  }
}

function parseRSSFeed(xml: string, locationSlug?: string, feedId?: string): NewsItem[] {
  const items: NewsItem[] = [];
  
  try {
    // Simple XML parsing for RSS items - handle multiple title and description formats
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    
    let match;
    let id = 1;
    
    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      const itemContent = match[1];
      
      // Location filtering is now handled by WordPress taxonomy feeds
      // No need to filter by location tags since /location/{slug}/feed/ already filters
      
      // Try multiple title formats
      const titlePatterns = [
        /<title><!\[CDATA\[(.*?)\]\]><\/title>/,
        /<title>(.*?)<\/title>/
      ];
      
      const linkPatterns = [
        /<link>(.*?)<\/link>/,
        /<link><!\[CDATA\[(.*?)\]\]><\/link>/
      ];
      
      const descriptionPatterns = [
        /<description><!\[CDATA\[(.*?)\]\]><\/description>/,
        /<description>(.*?)<\/description>/,
        /<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/
      ];
      
      const pubDatePatterns = [
        /<pubDate>(.*?)<\/pubDate>/,
        /<dc:date>(.*?)<\/dc:date>/
      ];
      
      const authorPatterns = [
        /<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/,
        /<dc:creator>(.*?)<\/dc:creator>/,
        /<author>(.*?)<\/author>/
      ];
      
      // Extract data using the first matching pattern
      let title = '', link = '', description = '', pubDate = '', author = '';
      
      for (const pattern of titlePatterns) {
        const titleMatch = pattern.exec(itemContent);
        if (titleMatch) {
          title = titleMatch[1].trim();
          break;
        }
      }
      
      for (const pattern of linkPatterns) {
        const linkMatch = pattern.exec(itemContent);
        if (linkMatch) {
          link = linkMatch[1].trim();
          break;
        }
      }
      
      for (const pattern of descriptionPatterns) {
        const descMatch = pattern.exec(itemContent);
        if (descMatch) {
          description = descMatch[1].trim();
          break;
        }
      }
      
      for (const pattern of pubDatePatterns) {
        const dateMatch = pattern.exec(itemContent);
        if (dateMatch) {
          pubDate = dateMatch[1].trim();
          break;
        }
      }
      
      for (const pattern of authorPatterns) {
        const authorMatch = pattern.exec(itemContent);
        if (authorMatch) {
          author = authorMatch[1].trim();
          break;
        }
      }
      
      if (title && link) {
        // Helper function to decode HTML entities
        const decodeHtmlEntities = (text: string): string => {
          let decoded = text;
          
          // First decode specific numeric entities that have special characters
          const specificNumericEntities: Record<string, string> = {
            '&#8211;': '–', // en dash
            '&#8212;': '—', // em dash
            '&#8217;': '\'', // right single quote  
            '&#8220;': '"', // left double quote
            '&#8221;': '"', // right double quote
            '&#8216;': '\'', // left single quote
            '&#8230;': '…', // ellipsis
            '&#038;': '&', // ampersand
            '&#039;': '\'', // apostrophe
            '&#160;': ' ', // non-breaking space
          };
          
          // Replace specific numeric entities first
          Object.entries(specificNumericEntities).forEach(([entity, char]) => {
            decoded = decoded.replace(new RegExp(entity, 'g'), char);
          });
          
          // Then handle named entities
          const namedEntities: Record<string, string> = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&apos;': '\'',
            '&nbsp;': ' ',
            '&ndash;': '–',
            '&mdash;': '—',
            '&lsquo;': '\'',
            '&rsquo;': '\'',
            '&ldquo;': '"',
            '&rdquo;': '"',
            '&hellip;': '…',
          };
          
          Object.entries(namedEntities).forEach(([entity, char]) => {
            decoded = decoded.replace(new RegExp(entity, 'g'), char);
          });
          
          // Finally handle any remaining numeric entities
          decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
            const code = parseInt(num);
            return code < 128 ? String.fromCharCode(code) : match;
          });
          
          // Handle hex entities
          decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
            const code = parseInt(hex, 16);
            return code < 128 ? String.fromCharCode(code) : match;
          });
          
          return decoded;
        };

        // Decode title
        title = decodeHtmlEntities(title);

        // Clean up description by removing HTML tags and limiting length
        let excerpt = '';
        if (description) {
          excerpt = description
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          // Decode HTML entities after removing tags
          excerpt = decodeHtmlEntities(excerpt);
          
          // Limit length
          excerpt = excerpt.substring(0, 150);
          if (excerpt.length === 150) {
            excerpt += '...';
          }
        }

        // Format date
        let formattedDate = '';
        if (pubDate) {
          try {
            const date = new Date(pubDate);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
            } else {
              formattedDate = pubDate;
            }
          } catch {
            formattedDate = pubDate;
          }
        }

        // Create unique ID using feed identifier and counter
        const uniqueId = feedId ? `${feedId}-${id++}` : `news-${Date.now()}-${id++}`;
        
        items.push({
          id: uniqueId,
          title: title,
          excerpt,
          link: link,
          date: formattedDate,
          author: author || 'Street Support'
        });
      }
    }
  } catch (error) {
    console.error('RSS parsing error:', error);
  }
  
  return items;
}