# Street Support Platform Web

This is the public-facing platform for the Street Support Network. It helps people find local services, share information, and collaborate across the homelessness sector.

---

## 🚀 Tech Stack

- **Next.js 15**
- **React 18**
- **TypeScript**
- **Tailwind CSS 4**
- **Jest + React Testing Library**
- **Playwright** for end-to-end tests
- **PowerShell scripts** (for Windows development)
- **JSON-based mock data** (local only; to be replaced by full CMS/API integration)

---

## 🧪 Testing

Unit and integration tests use **Jest** and **React Testing Library**.

Run all unit tests:
```bash
npm run test
```

Run end-to-end tests with Playwright:
```bash
npm run test:e2e
```

**Testing Highlights:**
- Babel is configured via `babel.config.json`
- Module aliases (`@/components/...`) use `moduleNameMapper` in `jest.config.cjs`
- Geolocation and other browser APIs are stubbed or guarded
- Mocks live under `tests/__mocks__/`

✅ **All tests must pass before merging into `staging` or `main`.**

---

## 🧱 Admin CMS

The admin CMS is a separate repo:  
➡️ [streetsupport-platform-admin](https://github.com/streetsupport/streetsupport-platform-admin)

It manages all partner organisation data and connects to this public platform via API.

---

## 📂 Local Development

Run the project locally with mock JSON data:

```bash
npm install
npm run dev
```

Key local data sources:
- `src/data/service-providers.json` — mock service provider data
- `src/data/locations.json` — fetched location metadata
- `src/data/service-categories.json` — fetched category and subcategory metadata
- `src/data/client-groups.json` — fetched client group metadata

---

## 🧭 Project Structure

- `src/app/` — Next.js App Router structure (pages, dynamic routes, API endpoints)
- `src/components/` — Reusable UI components and layout partials
- `src/contexts/` — React context providers (e.g. `LocationContext`, `FilterContext`)
- `src/content/` — Location-specific or static page content (e.g. prebuilt templates)
- `src/data/` — JSON data for mock services, locations, and categories
- `src/types/` — Shared TypeScript types
- `src/utils/` — Utility functions (e.g. DB helpers, formatters)
- `tests/__tests__/` — Unit tests for components, utils, and contexts
- `tests/e2e/` — End-to-end tests (Playwright specs)
- `tests/__mocks__/` — Mocks for third-party modules and stubs
- `config/` — Config files (Jest, ESLint, Playwright)
- `public/` — Static assets (images, icons)
- `scripts/` — Custom build or data fetch scripts

---

## 🌍 Location Pages — Our Approach

- Each **location page** (e.g. `/manchester`) is powered by a single **dynamic App Router route** using `[slug]/page.tsx`.
- The pages share a common template and pull their data from `locations.json` or future API calls.
- Local banners, news and map pins will come from the CMS or the public API.
- We use `generateStaticParams` for static builds where possible, with a `force-dynamic` fallback for maximum reliability.

For deeper context see:  
- [API Project Plan](./docs/API-Project-Plan.md)  
- [Next.js Workarounds Wiki](https://github.com/StreetSupport/streetsupport-platform-web/wiki)

---

## 🔄 Git Workflow

✅ See the **[WORKFLOW.md](./docs/WORKFLOW.md)** for full details.

In short:
1. Create a new feature branch from `staging`
2. Work and commit in that branch
3. PR into `streetsupport/streetsupport-platform-web` `staging`
4. Merge once tests pass
5. Open a PR from `staging` → `main`
6. Sync your fork’s `staging` with upstream

---

## ⚠️ Known Workarounds & Deferred Fixes

This repo currently uses a few **Next.js App Router workarounds** for dynamic param type inference and runtime behaviour:

- [Dynamic Param Workarounds — Wiki Home](https://github.com/StreetSupport/streetsupport-platform-web/wiki)
- [Runtime Await Workaround](https://github.com/StreetSupport/streetsupport-platform-web/wiki/Next.js-App-Router-Dynamic-Params-%E2%80%94-Runtime-Await-Workaround)
- [Param Inference Issue & Workaround](https://github.com/StreetSupport/streetsupport-platform-web/wiki/Next.js-Dynamic-Page-Param-Inference-%E2%80%94-Issue-&-Workaround)
- [Dynamic API Params Explained](https://github.com/StreetSupport/streetsupport-platform-web/wiki/Understanding-Next.js-App-Router-Dynamic-API-Params)

See Trello card: `Linting Suppression and Deferred Resolution Strategy` — [Link](https://trello.com/c/bISJ2l1L)

---

## 📚 Documentation

### 🎯 Core Documentation
- 📖 [**Complete Documentation Hub**](./docs/README.md) — Start here for all documentation
- 📋 [**Documentation Index**](./docs/index.md) — Complete file directory and navigation

### 🚀 Quick Links by Topic
- 🛠️ [**Development Guide**](./docs/development/README.md) — Local setup and development workflows
- 🧪 [**Testing Strategy**](./docs/testing/README.md) — Comprehensive testing approach and E2E implementation
- 🚀 [**Deployment Guide**](./docs/deployment/README.md) — CI/CD pipeline and deployment procedures
- 🛡️ [**Security Documentation**](./docs/security/README.md) — Comprehensive security measures and procedures
- 🎨 [**Design System**](./docs/design-system/README.md) — UI components and design patterns
- 🎯 [**Project Planning**](./docs/project-planning/README.md) — Strategic planning and API architecture

### 🔗 External Resources
- 📖 [**GitHub Wiki**](https://github.com/StreetSupport/streetsupport-platform-web/wiki) — Workarounds and debugging guides
- 🗂️ [**Project Drive**](https://drive.google.com/drive/folders/1hBp77oH095WVIEBD-WEvaKEgwoUBVbCx?usp=drive_link) — Additional project resources

---

We acknowledge the npm audit warnings for `esbuild`, `path-to-regexp`, and `undici`.  
These affect dev only, not production security.

---

✅ **Questions?** Open an issue or ask for context before making assumptions.

[James Cross](mailto:james@steetsupport.net)
