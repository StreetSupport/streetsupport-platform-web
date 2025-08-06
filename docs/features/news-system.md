# News System Integration

## Overview

The Street Support Platform includes a comprehensive news system that integrates with the WordPress-powered news site at `news.streetsupport.net`. This system provides real-time news updates across the platform through RSS feed integration.

## Architecture

### WordPress Integration
- **News Source**: `https://news.streetsupport.net/feed/`
- **Integration Method**: RSS feed parsing via serverless API route
- **Update Frequency**: Real-time with caching for performance
- **Fallback Strategy**: Graceful degradation when RSS feed unavailable

### API Implementation

#### Endpoint: `GET /api/news/general`
Located at: `src/app/api/news/general/route.ts`

**Key Features:**
- RSS feed parsing with robust error handling
- HTML entity decoding for proper text display
- Automatic excerpt generation (200 character limit)
- Image extraction from RSS content
- Category and author information extraction
- Date formatting for British English display

**Caching Strategy:**
```typescript
// Browser cache: 30 minutes
// CDN cache: 1 hour
newsResponse.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
```

## Implementation Details

### RSS Parsing System

The system includes comprehensive RSS parsing that handles:

1. **Multiple Content Patterns**: Supports various RSS formats and CDATA sections
2. **HTML Entity Decoding**: Converts entities like `&#8217;` to proper characters
3. **Content Sanitisation**: Strips HTML tags and normalises whitespace
4. **Image Extraction**: Finds featured images from multiple RSS patterns
5. **Excerpt Generation**: Creates readable summaries with proper word boundaries

### Error Handling

```typescript
// Graceful fallback strategy
try {
  const response = await fetch(feedUrl, {
    headers: { 'User-Agent': 'StreetSupport-Platform/1.0' },
    signal: AbortSignal.timeout(8000),
  });
} catch (error) {
  // Returns empty array instead of error for graceful degradation
  return NextResponse.json({
    status: 'success',
    data: { news: [], total: 0, error: 'Unable to fetch news at this time' }
  });
}
```

## Frontend Integration

### Components

#### NewsletterCard (`src/components/NewsletterCard.tsx`)
Displays latest news articles in a card format with:
- Article title and excerpt
- Publication date
- Featured image (when available)
- Category tags
- External link to full article

**Styling Features:**
- Brand-consistent colour scheme using `brand-i` (cream) background
- Accessible contrast ratios
- Responsive design for mobile-first approach
- Hover effects with subtle transformations

#### Implementation Example:
```tsx
const { data } = await fetch('/api/news/general');
const newsItems = data?.news || [];

return (
  <div className="news-grid">
    {newsItems.map(item => (
      <NewsCard key={item.id} article={item} />
    ))}
  </div>
);
```

## Content Processing

### HTML Entity Handling
The system handles various HTML entities commonly found in WordPress RSS feeds:

**Numeric Entities:**
- `&#8211;` → `–` (en dash)
- `&#8217;` → `'` (right single quotation mark)
- `&#8220;` → `"` (left double quotation mark)
- `&#8221;` → `"` (right double quotation mark)

**Named Entities:**
- `&amp;` → `&`
- `&lt;` → `<`
- `&gt;` → `>`
- `&nbsp;` → ` ` (non-breaking space)

### Excerpt Generation
- **Length Limit**: 200 characters maximum
- **Word Boundary**: Cuts at last complete word before 150 characters
- **Ellipsis**: Adds "..." for truncated content
- **HTML Stripping**: Removes all HTML tags for clean text display

## Performance Optimisations

### Caching Strategy
1. **Browser Caching**: 30 minutes for frequent updates
2. **CDN Caching**: 1 hour for global distribution
3. **Timeout Handling**: 8-second timeout prevents hanging requests
4. **Request Deduplication**: Single RSS feed source prevents redundant calls

### Error Recovery
- **Timeout Handling**: Prevents indefinite hanging
- **Network Error Recovery**: Graceful fallback to empty state
- **Malformed RSS Handling**: Continues processing with partial data
- **User Experience**: Never shows error states to end users

## Testing Strategy

### Unit Tests
Located in `tests/__tests__/api/news.test.ts`:
- RSS parsing validation
- HTML entity decoding
- Error handling scenarios
- Cache header verification

### E2E Tests
- News display on homepage
- External link functionality
- Responsive design validation
- Loading state handling

## Security Considerations

### Content Sanitisation
- HTML tag stripping prevents XSS attacks
- URL validation for external links
- Content length limiting prevents memory issues
- User-Agent identification for responsible scraping

### Rate Limiting
- Standard API rate limits apply (100 requests/minute)
- RSS source respects robots.txt and reasonable request intervals
- CDN caching reduces origin server load

## WordPress CMS Integration

### Content Management
- **Editorial Control**: All content managed through WordPress admin
- **SEO Optimisation**: WordPress handles meta tags and structured data
- **Media Management**: Images and attachments hosted on WordPress
- **Categories**: Automatic category extraction and display

### RSS Feed Configuration
WordPress RSS feed includes:
- Full content with images
- Category classifications
- Author attribution
- Publication dates
- GUID for unique identification

## Deployment Considerations

### Environment Variables
No additional environment variables required - RSS feed URL is publicly accessible.

### Build Process
- Static generation not used due to dynamic content
- API route deployed as serverless function
- No build-time dependencies on external services

### Monitoring
- Failed RSS fetch attempts logged for monitoring
- Performance metrics tracked through Vercel analytics
- User engagement metrics available through frontend analytics

## Future Enhancements

### Planned Improvements
1. **Category Filtering**: Filter news by category or topic
2. **Search Functionality**: Full-text search across news content
3. **Pagination**: Handle large numbers of articles efficiently
4. **Local Caching**: Redis or similar for improved performance
5. **Push Notifications**: Real-time updates for critical news

### Content Strategy
- **Local News Integration**: Location-specific news filtering
- **Emergency Alerts**: Priority messaging system for urgent updates
- **Multi-language Support**: Content translation for diverse communities
- **Accessibility Enhancement**: Enhanced screen reader support and audio content

## Troubleshooting

### Common Issues

**RSS Feed Unavailable:**
```typescript
// Check network connectivity and RSS source
curl https://news.streetsupport.net/feed/
```

**Parsing Errors:**
- Validate RSS XML structure
- Check for malformed HTML entities
- Verify character encoding (UTF-8)

**Performance Issues:**
- Monitor cache hit rates
- Check RSS feed response times
- Validate CDN configuration

### Debugging
Enable detailed logging by setting `NODE_ENV=development`:
```typescript
console.warn(`Failed to fetch general news feed:`, error);
console.error('RSS parsing error:', error);
```

## Related Documentation
- [API Documentation](../api/README.md) - Complete API reference
- [Design System](../design-system/cards-and-content.md) - Card component guidelines
- [Performance Optimisation](../development/IMAGE_OPTIMISATION.md) - General optimisation strategies

---

*Last Updated: August 2025*
*System Status: Production Ready ✅*