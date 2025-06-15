# ✅ Test Coverage Checklist

This document tracks key test coverage across the Street Support Network rebuild.

## 🧪 Find Help Components

| Component         | Status   | Notes                                      |
|------------------|----------|--------------------------------------------|
| `FindHelpEntry`   | ✅ Done   | Renders with context                       |
| `FindHelpResults` | ✅ Done   | Filter logic, map toggle, empty state      |
| `MapView`         | ✅ Done   | SSR-safe test, renders markers             |
| `FilterPanel`     | ✅ Done   | Renders filters, user input tested         |
| `ServiceCard`     | ✅ Done   | Renders service data, opening times tested |

## 🔜 Upcoming Test Targets

| Component            | Status      | Notes                                     |
|----------------------|-------------|-------------------------------------------|
| `LocationContext`    | ⏳ TODO      | Behaviour under different locations       |
| `LocationContext`    | ✅ Done      | Context updates and geolocation request |
| Timetable View       | 🚧 Planned  | Based on rebuild roadmap                  |
| Geolocation Fallback | 🚧 Planned  | Will stub `navigator.geolocation`         |

---

## 🔁 Test Strategy

- Test-driven development (TDD) applied where possible
- Components are tested in isolation
- API routes will be tested using integration suites where applicable

### ✅ Find Help – End-to-End (Playwright)

**Coverage:**
- Page loads and fallback UI appears if geolocation is blocked
- Manual postcode entry sets location
- Category and subcategory filters function correctly
- Map toggle button reveals map interface
- Services display correctly based on geolocation and filters

**File:** `e2e/find-help.spec.ts`  
**Status:** ✅ All tests passing  
**Date:** 2025-06-03  
**Notes:** Mocks used for category API; geolocation stubbed for result validation
**Notes:** Mocks used for category API; geolocation stubbed for result validation

### ✅ Homepage – End-to-End (Playwright)

**Coverage:**
- Map renders on page load
- Location markers become visible

**File:** `e2e/homepage.spec.ts`
**Status:** ✅ All tests passing
**Date:** 2025-06-09
**Notes:** Uses mocked map pins for reliability

### ✅ Organisation Entry – End-to-End (Playwright)

**Coverage:**
- Organisation details load correctly
- Accordions expand and collapse
- Correct heading text asserted
- Footer disclaimer visible

**File:** `e2e/organisation-entry.spec.ts`
**Status:** ✅ All tests passing
**Date:** 2025-06-11
**Notes:** Uses sample slug during local testing