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
| Timetable View       | 🚧 Planned  | Based on rebuild roadmap                  |
| Geolocation Fallback | 🚧 Planned  | Will stub `navigator.geolocation`         |

---

## 🔁 Test Strategy

- Test-driven development (TDD) applied where possible
- Components are tested in isolation
- API routes will be tested using integration suites where applicable
