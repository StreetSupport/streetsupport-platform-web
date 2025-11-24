# Image Optimization Guide

This document outlines the image optimization strategy implemented for the Street Support platform, which manages 364+ images totaling 56MB.

## Overview

The project uses Next.js's built-in Image component with the following optimizations:

### Configuration (next.config.ts)

- **Modern Formats**: Automatic conversion to AVIF and WebP
- **Quality**: Set to 75 for optimal balance of quality and file size
- **Responsive Breakpoints**: Multiple device sizes for optimal delivery
- **Placeholder**: Blur placeholders for smooth loading experience

### Image Component Usage

All images use the Next.js `<Image>` component with proper attributes:

```tsx
import Image from 'next/image';

// Example: Resource icon
<Image
  src="/assets/img/resource-icons/icon.png"
  alt="Description"
  width={55}
  height={55}
  sizes="55px"
/>

// Example: Team photo
<Image
  src="/assets/img/mugshots/person.jpg"
  alt="Person Name"
  width={200}
  height={200}
  sizes="(max-width: 768px) 128px, 200px"
/>

// Example: Critical logo
<Image
  src="/assets/img/logo.png"
  alt="Street Support Logo"
  width={300}
  height={200}
  priority
  sizes="(max-width: 768px) 100vw, 300px"
/>
```

## Image Categories and Optimization

### 1. Critical Images (Priority Loading)
- **Logos on branding page**: Use `priority={true}`
- **Hero images**: Load immediately for better UX
- **Above-the-fold content**: Prevent layout shift

### 2. Standard Images (Lazy Loading)
- **Team photos**: Responsive sizing based on viewport
- **Resource icons**: Fixed size with proper dimensions
- **Gallery images**: Load as they enter viewport

### 3. Large Collections
- **Location logos (34MB)**: Largest image directory
- **Open Graph images (5.4MB)**: Social sharing optimization
- **Mugshots (2.9MB)**: Team and trustee photos

## Performance Benefits

### Expected Improvements:
- **50-70% file size reduction** through modern formats (AVIF/WebP)
- **Faster page loads** via lazy loading and responsive images
- **Better Core Web Vitals** scores
- **Improved SEO** rankings
- **Reduced bandwidth** usage for mobile users

### Technical Benefits:
- **Automatic format selection** based on browser support
- **Responsive image delivery** matching device capabilities  
- **Layout shift prevention** with proper dimensions
- **Optimized caching** with appropriate TTL settings

## Utility Functions

The project includes helpful utilities in `src/utils/imageOptimization.ts`:

- **Common image sizes** for consistent usage
- **Responsive breakpoint helpers**
- **Blur placeholder generation**
- **Size string builders**

## Best Practices

### When Adding New Images:

1. **Use Next.js Image component** instead of `<img>` tags
2. **Set explicit width/height** to prevent layout shift
3. **Add appropriate sizes attribute** for responsive delivery
4. **Use priority={true}** only for critical above-the-fold images
5. **Optimize source images** before adding to project
6. **Consider image necessity** - remove unused images

### Image Organization:

- **Keep images under 1MB** when possible
- **Use descriptive alt text** for accessibility
- **Group related images** in logical directories
- **Use modern formats** (WebP, AVIF) for new images
- **Compress images** before adding to repository

## Monitoring Performance

### Tools to Monitor:
- **Lighthouse** for Core Web Vitals
- **Next.js Analytics** for real user metrics
- **Network tab** for image loading analysis
- **WebPageTest** for detailed performance insights

### Key Metrics to Watch:
- **Largest Contentful Paint (LCP)**: Should be under 2.5s
- **Cumulative Layout Shift (CLS)**: Should be under 0.1
- **First Input Delay (FID)**: Should be under 100ms
- **Total image payload**: Monitor for regression

## Future Considerations

### CDN Integration (Optional):
- **Cloudinary** or **ImageKit** for advanced transformations
- **Dynamic image optimization** based on user context
- **Automatic format and quality optimization**
- **Global edge delivery** for improved performance

### Advanced Optimizations:
- **Progressive loading** for image galleries
- **Intersection Observer** for custom lazy loading
- **Image preloading** for critical user paths
- **Service Worker caching** for repeat visits

## Implementation Status

✅ **Completed:**
- Next.js image configuration optimized
- All images converted to Next.js Image components
- Responsive sizing implemented
- Critical images prioritized

📋 **Ongoing:**
- Performance monitoring
- Image optimization audits
- User experience improvements

This optimization strategy ensures the 364+ image library loads efficiently while maintaining high visual quality and excellent user experience.