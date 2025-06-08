# Street Support Platform Web

This is the public-facing platform for the Street Support Network. It helps people find local services, share information, and collaborate across the homelessness sector.

## 🚀 Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS 4
- Jest + React Testing Library
- JSON-based mock data (used for local development until full CMS/API integration)
- GitHub Actions (CI)
- PowerShell scripts (for development on Windows)

## 🧪 Testing

This project uses **Jest** and **React Testing Library** for unit and integration tests.

### Running Tests

```bash
npm run test
```

### Test Setup Highlights

- Babel is configured via `babel.config.json` (not `.js` due to Jest limitations).
- Module path aliases (e.g. `@/components/...`) are resolved using `moduleNameMapper` in `jest.config.cjs`.
- Geolocation and other browser APIs are stubbed or guarded for compatibility.
- The `__mocks__` directory includes mocks for modules like `leaflet` and `react-leaflet`.

All tests must pass before merging any pull request into `staging` or `main`.

## 🧱 Admin CMS

The admin CMS is developed in a separate repository:
[streetsupport-platform-admin](https://github.com/streetsupport/streetsupport-platform-admin)

This manages all partner organisation data and connects to the public platform via API.

## 📂 Local Development

Mock service data is stored in `data/service-providers.json` and is used by the Find Help search feature.

To run the project locally:

```bash
npm install
npm run dev
```

## 🧭 Project Structure

- `src/components/` – UI components
- `src/contexts/` – React context providers (e.g. `LocationContext`)
- `src/data/` – local JSON data sources for mock services and locations
- `src/pages/` – Next.js pages and routing
- `__mocks__/` – mocks for external libraries used in test environment

## 🔄 Git Workflow

See the project instructions for the full GitHub workflow. In short:

- Create a new feature branch from `staging`
- Work on that branch
- Create a PR into `streetsupport/streetsupport-platform-web` `staging`
- Merge once tests pass
- Then open a PR from `staging` to `main`
- Finally, sync your fork’s `staging` with upstream

---

## ⚠️ TypeScript & Linting Workaround

Some temporary TypeScript and ESLint suppressions are in place—particularly in `FindHelpResults.tsx`—to avoid breaking builds while types are refined. This includes type assertions (`as any`, `!`) and relaxed location typing.

These will be addressed post-MVP once shared types (e.g. for services and location context) are finalised. All suppressions are tracked in Trello under `Linting Suppression and Deferred Resolution Strategy` - https://trello.com/c/bISJ2l1L.

---

For full developer instructions and context, see the `rebuild-docs.docx` or ask for clarification before making assumptions.
