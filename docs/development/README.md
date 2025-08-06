# Development Guide

This directory contains comprehensive technical documentation for developing and maintaining the Street Support Platform Web application.

## 🚀 Getting Started

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/streetsupport/streetsupport-platform-web.git
cd streetsupport-platform-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 📚 Core Documentation

### Architecture & Implementation
- [**Next.js 15 Implementation Guide**](./nextjs-implementation.md) - Complete Next.js patterns, dynamic routing, and performance optimisation
- [**State Management Architecture**](./state-management.md) - React Context providers, custom hooks, and URL state synchronisation
- [**API Scaffold & Database Helper Summary**](./api-scaffold-and-db-helper-summary.md) - API implementation patterns and database utilities
- [**MongoDB Connection Guide**](./confirm-and-test-mongo-db.md) - Database setup, testing, and connection management

### Performance & Optimisation
- [**Image Optimisation**](./IMAGE_OPTIMISATION.md) - Performance optimisation strategies for images and assets

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # Serverless API routes
│   ├── [location]/               # Dynamic location pages
│   ├── about/                    # Static pages
│   ├── find-help/                # Service discovery
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable UI components
│   ├── Banners/                  # Campaign banner system
│   ├── partials/                 # Layout components
│   └── ui/                       # Base UI components
├── contexts/                     # React Context providers
│   ├── LocationContext.tsx       # Location state management
│   ├── FilterContext.tsx         # Search filters
│   └── PreferencesContext.tsx    # User preferences
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript definitions
├── utils/                        # Utility functions
└── data/                         # Static data files
```

## 🛠️ Development Workflow

### 1. Branch Strategy

```bash
# Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/your-feature-name

# Make your changes
git add .
git commit -m "feat: add new feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Code Standards

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Implement proper error handling with try-catch blocks
- Use discriminated unions for type safety

```typescript
// Good: Proper interface definition
interface Service {
  _id: string;
  ServiceProviderName: string;
  Info: string;
  Address: Address;
  OpeningTimes: OpeningTime[];
}

// Good: Error handling
try {
  const services = await getServices(lat, lng);
  return services;
} catch (error) {
  console.error('Failed to fetch services:', error);
  throw new APIError(500, 'Unable to fetch services');
}
```

#### React Components
- Use functional components with hooks
- Implement proper prop types with TypeScript
- Include accessibility attributes (ARIA labels, roles)
- Use semantic HTML elements

```tsx
// Good: Accessible component structure
export function ServiceCard({ service, headingLevel = 'h3' }: ServiceCardProps) {
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
  
  return (
    <article 
      className="service-card"
      aria-labelledby={`service-${service._id}-title`}
    >
      <HeadingTag id={`service-${service._id}-title`}>
        {service.ServiceProviderName}
      </HeadingTag>
      {/* Component content */}
    </article>
  );
}
```

#### CSS/Tailwind
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Implement proper colour contrast ratios (WCAG AA)
- Use custom brand colours consistently

```css
/* Good: Mobile-first responsive design */
.service-card {
  @apply p-4 bg-white rounded-lg shadow-md;
  
  /* Mobile styles first */
  @apply mb-4;
  
  /* Tablet and up */
  @apply md:mb-6 md:p-6;
  
  /* Desktop and up */
  @apply lg:p-8;
}
```

### 3. Testing Requirements

#### Unit Tests
Run unit tests before committing:
```bash
npm run test
npm run test:watch  # During development
```

#### E2E Tests
Run end-to-end tests for critical user journeys:
```bash
npm run test:e2e
npm run test:e2e:ui  # With browser UI
```

#### Accessibility Testing
Verify accessibility compliance:
```bash
npm run test:a11y
```

### 4. Code Quality Checks

#### Linting and Formatting
```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
```

#### Type Checking
```bash
npm run type-check    # Verify TypeScript types
```

#### Build Verification
```bash
npm run build         # Test production build
npm run start         # Test production server
```

## 🧪 Testing Strategy

### Unit Testing
- Use Jest and React Testing Library
- Test component rendering and interactions
- Mock external dependencies and APIs
- Achieve >90% code coverage

```typescript
// Example unit test
describe('ServiceCard', () => {
  const mockService = createMockService();

  it('renders service information correctly', () => {
    render(<ServiceCard service={mockService} />);
    
    expect(screen.getByText(mockService.ServiceProviderName)).toBeInTheDocument();
    expect(screen.getByText(mockService.Info)).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    const incompleteService = { ...mockService, Info: undefined };
    
    expect(() => {
      render(<ServiceCard service={incompleteService} />);
    }).not.toThrow();
  });
});
```

### Integration Testing
- Test API routes with mock databases
- Verify component interactions
- Test state management flows

### E2E Testing
- Use Playwright for browser testing
- Test critical user journeys
- Verify accessibility with automated tools

## 🚀 Deployment

### Environment Variables
Required environment variables for different environments:

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://streetsupport.net
MONGODB_URI=mongodb+srv://...
MONGODB_DB=streetsupport
```

### Build Process
```bash
# Production build
npm run build

# Test production build locally
npm run start
```

### Deployment Pipeline
The application deploys automatically via GitHub Actions:
1. Code pushed to `staging` branch
2. Automated tests run
3. Build verification
4. Deploy to staging environment
5. Manual verification
6. Merge to `main` for production deployment

## 🎯 Performance Guidelines

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimisation Strategies
1. **Image Optimisation**: Use Next.js Image component with WebP format
2. **Code Splitting**: Implement dynamic imports for large components
3. **Caching**: Configure appropriate cache headers for static assets
4. **Bundle Analysis**: Monitor bundle size with `npm run analyze`

### Performance Monitoring
```bash
# Lighthouse CI integration
npm run lighthouse

# Bundle analysis
npm run analyze

# Performance profiling
npm run perf
```

## 🔒 Security Guidelines

### Data Protection
- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate all user inputs server-side
- Implement proper CORS policies

### Content Security Policy
```javascript
// next.config.js CSP configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
  child-src *.google.com *.youtube.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' *.gstatic.com;
`;
```

### API Security
- Validate all request parameters
- Implement rate limiting
- Use HTTPS for all communications
- Log security events for monitoring

## 🐛 Debugging and Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Test MongoDB connection
npm run test:db

# Check environment variables
echo $MONGODB_URI
```

#### TypeScript Errors
```bash
# Generate fresh type definitions
npm run type-check

# Clear TypeScript cache
rm -rf .next/types
```

### Development Tools
- **React DevTools**: Browser extension for component debugging
- **MongoDB Compass**: GUI for database exploration
- **Lighthouse**: Performance and accessibility auditing
- **axe DevTools**: Accessibility testing in browser

## 📖 Additional Resources

### External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Project-Specific Guides
- [Design System](../design-system/README.md) - UI component library and guidelines
- [API Documentation](../api/README.md) - Complete API reference
- [Testing Documentation](../testing/README.md) - Comprehensive testing strategy
- [Security Documentation](../security/README.md) - Security implementation details
- [Accessibility Guide](../accessibility/compliance-guide.md) - WCAG compliance implementation

## 🤝 Contributing

### Pull Request Process
1. Create feature branch from `staging`
2. Implement changes with tests
3. Ensure all checks pass
4. Request code review
5. Address review feedback
6. Merge after approval

### Code Review Guidelines
- Focus on functionality and maintainability
- Check accessibility implementation
- Verify test coverage
- Ensure British English in user-facing text
- Confirm professional commit messages

### Community Standards
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and improve
- Follow project coding standards
- Maintain documentation currency

---

*Last Updated: August 2025*
*Development Stack: Next.js 15, React 18, TypeScript, Tailwind CSS*
*Status: Active Development ✅*