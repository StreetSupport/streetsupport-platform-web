# Street Support Platform Documentation

Welcome to the comprehensive documentation for the Street Support Platform Web application. This documentation covers all aspects of the project from planning and development to testing and deployment.

## 📁 Documentation Structure

### 🎯 [Project Planning](./project-planning/)
Strategic documentation and project planning materials:
- [**API Project Plan**](./project-planning/API-Project-Plan.md) - Complete strategy for rebuilding the API infrastructure

### 🛠️ [Development](./development/)
Technical implementation guides and development workflows:
- [**API Scaffold & Database Helper Summary**](./development/api-scaffold-and-db-helper-summary.md) - API implementation patterns
- [**MongoDB Connection Guide**](./development/confirm-and-test-mongo-db.md) - Database setup and testing
- [**Image Optimisation**](./development/IMAGE_OPTIMISATION.md) - Performance optimisation strategies

### 🧪 [Testing](./testing/)
Comprehensive testing strategies and implementation guides:
- [**E2E Testing Strategy**](./testing/E2E_TESTING_STRATEGY.md) - Complete MSW-style mocking solution for GitHub Actions
- [**Testing & Fallbacks**](./testing/TESTING_AND_FALLBACKS.md) - Legacy fallback system documentation

### 🚀 [Deployment](./deployment/)
CI/CD workflows and deployment configurations:
- [**GitHub Actions Workflow**](./deployment/workflow.md) - Complete CI/CD pipeline documentation
- [**Secrets Management**](./deployment/secrets.md) - Security and secrets handling guide
- [**Vercel Configuration**](./deployment/vercel-configuration.md) - Production deployment settings

### 🛡️ [Security](./security/)
Comprehensive security documentation and procedures:
- [**Security Overview**](./security/README.md) - Complete security strategy and implementation
- [**Application Security**](./security/application-security.md) - Code-level security measures and CSP configuration
- [**Infrastructure Security**](./security/infrastructure-security.md) - Deployment and hosting security
- [**Security Monitoring**](./security/security-monitoring.md) - Monitoring, alerting, and incident response

### 🎨 [Design System](./design-system/)
Comprehensive design system documentation:
- [**Overview & Philosophy**](./design-system/README.md) - Complete design system foundation
- [**Buttons**](./design-system/buttons.md) - Button components and variants
- [**Typography**](./design-system/typography.md) - Text styles and hierarchy
- [**Colours & Themes**](./design-system/colors-and-themes.md) - Brand colours and accessibility
- [**Layout & Spacing**](./design-system/layout-and-spacing.md) - Grid system and spacing
- [**Forms & Inputs**](./design-system/forms-and-inputs.md) - Form design patterns
- [**Navigation & Menus**](./design-system/navigation-and-menus.md) - Navigation components
- [**Cards & Content**](./design-system/cards-and-content.md) - Content containers

## 🏗️ Project Overview

The Street Support Platform is a Next.js application that connects people experiencing homelessness with local support services. The platform features:

- **Public Website**: Service discovery, location-based search, organisation profiles
- **API Infrastructure**: Serverless read API with robust fallback systems
- **Testing Suite**: Comprehensive unit and E2E tests with MongoDB-independent mocking
- **Design System**: Accessible, brand-focused component library
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions

## 🎯 Quick Start Guides

### For Developers
1. **Setup**: Follow the main README for project setup
2. **API Development**: Start with [API Project Plan](./project-planning/API-Project-Plan.md)
3. **Testing**: Understand the [E2E Testing Strategy](./testing/E2E_TESTING_STRATEGY.md)
4. **Components**: Use the [Design System](./design-system/README.md)

### For Contributors
1. **Understanding**: Read the [Project Plan](./project-planning/API-Project-Plan.md)
2. **Testing**: See [Testing & Fallbacks](./testing/TESTING_AND_FALLBACKS.md) for PR testing
3. **Deployment**: Understand [GitHub Actions Workflow](./deployment/WORKFLOW.md)

### For Maintainers
1. **Secrets**: Manage via [Secrets Guide](./deployment/SECRETS.md)
2. **Testing**: Monitor [E2E Testing Strategy](./testing/E2E_TESTING_STRATEGY.md)
3. **Development**: Use [Development Guides](./development/)

## 🏆 Key Achievements

### ✅ **Testing Infrastructure**
- **100% E2E Test Coverage**: All tests pass without MongoDB dependencies
- **MSW-Style Mocking**: Comprehensive API mocking system
- **GitHub Actions Ready**: PR builds work without secrets

### ✅ **API Architecture**
- **Serverless Design**: Scalable, cost-effective API routes
- **Fallback Systems**: Robust error handling and data fallbacks
- **Security First**: Proper secrets management and access control

### ✅ **Design System**
- **Accessibility Focused**: WCAG AA compliant components
- **Brand Consistent**: 18 custom brand colours with semantic mapping
- **Mobile First**: Optimised for users in crisis situations

### ✅ **Development Workflow**
- **Automated Testing**: Unit, E2E, and build verification
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimised builds and asset delivery

## 🔄 Recent Updates

### Testing Strategy Evolution
The project has evolved from basic fallback JSON files to a sophisticated MSW-style mocking system that provides:
- Automatic mock activation based on environment
- Realistic API responses for comprehensive testing
- Zero-infrastructure testing solution
- Complete separation of test and production code

### API Architecture Modernisation
Transitioned from legacy API dependencies to a modern serverless architecture with:
- Next.js API routes for public data
- MongoDB fallback systems
- Comprehensive error handling
- Scalable, maintainable codebase

## 📞 Support & Questions

- **GitHub Issues**: Report bugs and feature requests
- **Documentation Updates**: Submit PRs to improve these docs
- **Architecture Questions**: Refer to [API Project Plan](./project-planning/API-Project-Plan.md)
- **Testing Issues**: See [E2E Testing Strategy](./testing/E2E_TESTING_STRATEGY.md)

## 🤝 Contributing

This documentation is maintained alongside the codebase. When making changes:

1. **Update Relevant Docs**: Keep documentation current with code changes
2. **Test Documentation**: Verify links and examples work
3. **Follow Structure**: Maintain the organised directory structure
4. **Use British English**: Consistent with project standards

---

*Last updated: August 2025*
*Documentation version: 2.0*