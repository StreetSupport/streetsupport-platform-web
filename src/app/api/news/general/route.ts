import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    // Use main RSS feed from WordPress news site
    const feedUrl = 'https://news.streetsupport.net/feed/';

    let news: NewsItem[] = [];

    try {
      const response = await fetch(feedUrl, {
        headers: { 'User-Agent': 'StreetSupport-Platform/1.0' },
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const xml = await response.text();
        news = parseRSSFeed(xml);
      }
    } catch (error) {
      console.warn(`Failed to fetch general news feed:`, error);
    }

    // Remove duplicates and sort by date
    const uniqueNews = news.filter((item, index, arr) => 
      arr.findIndex(i => i.link === item.link) === index
    ).sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    const newsResponse = NextResponse.json({
      status: 'success',
      data: {
        news: uniqueNews.slice(0, 20), // Limit to 20 most recent
        total: uniqueNews.length
      }
    });

    // Add cache headers
    newsResponse.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600'); // 30 min browser, 1 hour CDN
    
    return newsResponse;
  } catch (error) {
    console.error('[API ERROR] /api/news/general:', error);
    
    // Return empty data instead of error to gracefully handle failures
    return NextResponse.json({
      status: 'success',
      data: {
        news: [],
        total: 0,
        error: 'Unable to fetch news at this time'
      }
    });
  }
}

function parseRSSFeed(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  
  try {
    // Enhanced XML parsing for RSS items with better category extraction
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    
    let match;
    let id = 1;
    
    while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
      const itemContent = match[1];
      
      // Enhanced pattern matching for better content extraction
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

      const categoryPatterns = [
        /<category><!\[CDATA\[(.*?)\]\]><\/category>/,
        /<category>(.*?)<\/category>/,
        /<category[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/,
        /<category[^>]*>(.*?)<\/category>/
      ];

      const imagePatterns = [
        /<media:content[^>]*url="([^"]*)"[^>]*>/,
        /<enclosure[^>]*url="([^"]*)"[^>]*type="image/,
        /<image[^>]*url="([^"]*)"[^>]*>/,
        /<content:encoded><!\[CDATA\[.*?<img[^>]*src="([^"]*)".*?\]\]><\/content:encoded>/,
        /<description><!\[CDATA\[.*?<img[^>]*src="([^"]*)".*?\]\]><\/description>/
      ];
      
      // Extract data using the first matching pattern
      let title = '', link = '', description = '', pubDate = '', author = '', category = '', imageUrl = '';
      
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

      // Extract first category
      for (const pattern of categoryPatterns) {
        const categoryMatch = pattern.exec(itemContent);
        if (categoryMatch) {
          category = categoryMatch[1].trim();
          break;
        }
      }

      // Extract featured image
      for (const pattern of imagePatterns) {
        const imageMatch = pattern.exec(itemContent);
        if (imageMatch) {
          imageUrl = imageMatch[1].trim();
          break;
        }
      }
      
      if (title && link) {
        // Helper function to decode HTML entities
        const decodeHtmlEntities = (text: string): string => {
          let decoded = text;
          
          // Specific numeric entities
          const specificNumericEntities: Record<string, string> = {
            '&#8211;': '–', '&#8212;': '—', '&#8217;': "'", 
            '&#8220;': '"', '&#8221;': '"', '&#8216;': "'",
            '&#8230;': '…', '&#038;': '&', '&#039;': "'", '&#160;': ' ',
          };
          
          Object.entries(specificNumericEntities).forEach(([entity, char]) => {
            decoded = decoded.replace(new RegExp(entity, 'g'), char);
          });
          
          // Named entities
          const namedEntities: Record<string, string> = {
            '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
            '&nbsp;': ' ', '&ndash;': '–', '&mdash;': '—', '&lsquo;': "'",
            '&rsquo;': "'", '&ldquo;': '"', '&rdquo;': '"', '&hellip;': '…',
          };
          
          Object.entries(namedEntities).forEach(([entity, char]) => {
            decoded = decoded.replace(new RegExp(entity, 'g'), char);
          });
          
          // Remaining numeric entities
          decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
            const code = parseInt(num);
            return code < 128 ? String.fromCharCode(code) : match;
          });
          
          // Hex entities
          decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
            const code = parseInt(hex, 16);
            return code < 128 ? String.fromCharCode(code) : match;
          });
          
          return decoded;
        };

        // Decode and clean title
        title = decodeHtmlEntities(title);

        // Clean and decode description
        let excerpt = '';
        if (description) {
          excerpt = description
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          excerpt = decodeHtmlEntities(excerpt);
          
          // Limit length
          excerpt = excerpt.substring(0, 200);
          if (excerpt.length === 200) {
            // Find last complete word
            const lastSpace = excerpt.lastIndexOf(' ');
            if (lastSpace > 150) {
              excerpt = excerpt.substring(0, lastSpace) + '...';
            } else {
              excerpt += '...';
            }
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

        // Clean category
        if (category) {
          category = decodeHtmlEntities(category);
        }

        items.push({
          id: `news-${Date.now()}-${id++}`,
          title: title,
          excerpt,
          link: link,
          date: formattedDate,
          author: author || 'Street Support',
          category: category || undefined,
          imageUrl: imageUrl || undefined
        });
      }
    }
  } catch (error) {
    console.error('RSS parsing error:', error);
  }
  
  return items;
}