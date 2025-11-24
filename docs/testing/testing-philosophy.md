# Testing Philosophy & Guidelines

This document outlines our comprehensive testing approach for the Street Support Platform Web application. Our testing strategy ensures reliability, maintainability, and confidence in deployments.

## Testing Pyramid

We follow a balanced testing pyramid approach:

```
    /\     
   /E2E\    ← 61 End-to-End Tests (User Journeys)
  /    \
 /      \   
/  Unit  \  ← 318 Unit Tests (Functions, Components, APIs)
\________/  ← Integration Tests (Component Interactions)
```

---

## Core Principles

### 1. **Quality Gates** 🚦
Nothing deploys without passing all tests:
```bash
npm run build  # Runs: unit tests → E2E tests → Next.js build
```

- ✅ **318 Unit Tests** must pass
- ✅ **61 E2E Tests** must pass  
- ✅ **83.57% Code Coverage** maintained
- ✅ **Next.js Build** must succeed

### 2. **Automatic Fallbacks** 🛡️
Tests are resilient and don't require complex setup:

- **MongoDB Available**: Tests use real database
- **MongoDB Unavailable**: Tests automatically use MSW-style mocks
- **No Configuration**: Fallbacks activate automatically
- **CI/CD Ready**: Works in any environment

### 3. **Real User Focus** 👥
Tests mirror actual user behavior:

- **E2E tests** cover complete user journeys
- **Component tests** verify user interactions
- **API tests** ensure data integrity
- **Accessibility tests** ensure inclusive design

---

## Testing Strategy by Layer

### 🧪 **Unit Tests** (318 tests)

**What we test:**
- ✅ **API Routes**: All endpoints with error handling (100% coverage)
- ✅ **Utility Functions**: Business logic, data transformation (90%+ coverage)
- ✅ **Components**: Critical UI components with props validation
- ✅ **Contexts**: State management and data flow

**Example Unit Test:**
```javascript
describe('calculateDistance', () => {
  it('should calculate distance between two coordinates', () => {
    const result = calculateDistance(
      { lat: 53.4808, lng: -2.2426 }, // Manchester
      { lat: 53.4839, lng: -2.2446 }  // Nearby location
    );
    expect(result).toBeCloseTo(0.2, 1); // ~0.2 miles
  });

  it('should handle invalid coordinates gracefully', () => {
    const result = calculateDistance(null, { lat: 53, lng: -2 });
    expect(result).toBeNull();
  });
});
```

### 🌐 **E2E Tests** (61 tests)

**What we test:**
- ✅ **Location-based Service Discovery** (18 tests)
- ✅ **Error Handling & Recovery** (14 tests) 
- ✅ **Mobile Responsiveness & Accessibility** (17 tests)
- ✅ **Organisation Page Functionality** (12 tests)

**Example E2E Test:**
```javascript
test('should find services by postcode', async ({ page }) => {
  await page.goto('/find-help');
  
  // Enter postcode
  await page.getByRole('button', { name: /enter postcode/i }).click();
  await page.getByLabel(/postcode/i).fill('M1 1AA');
  await page.getByRole('button', { name: /find services/i }).click();
  
  // Verify results
  await expect(page.getByText('Services Near You')).toBeVisible();
  await expect(page.getByText(/Manchester Food Bank/i)).toBeVisible();
});
```

### 🔗 **Integration Tests**

**What we test:**
- Component interactions with contexts
- Data flow between parent/child components
- Form validation with API calls
- Error boundary behavior

**Example Integration Test:**
```javascript
test('location context updates filter results', () => {
  render(
    <LocationProvider>
      <FilterProvider>
        <ServicesList />
      </FilterProvider>
    </LocationProvider>
  );

  // Change location
  fireEvent.click(screen.getByText('Change Location'));
  fireEvent.change(screen.getByLabelText('Postcode'), { 
    target: { value: 'M2 2BB' } 
  });
  
  // Verify services update
  expect(screen.getByText('Updated location to M2 2BB')).toBeVisible();
});
```

---

## Mock Strategy

### 🎭 **MSW-Style API Mocking**

Our sophisticated mocking system automatically activates when needed:

```javascript
// Automatic mock detection
if (!process.env.MONGODB_URI) {
  // Activate comprehensive mocks
  setupMSWMocks();
}
```

**Mock Coverage:**
- **Service Discovery API**: Returns realistic service data
- **Geocoding API**: Handles postcode lookups
- **Organisation API**: Provides organisation details
- **Category API**: Returns service taxonomies

### 🗃️ **Data Fallbacks**

When MongoDB is unavailable, tests use curated JSON fallbacks:

```
src/data/
├── locations.json      ← Location data fallback
├── categories.json     ← Service categories fallback  
├── client-groups.json  ← Demographics fallback
└── sample-services.json ← Test service data
```

---

## Testing Tools & Configuration

### **Jest Configuration** (`config/jest.config.cjs`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70
    }
  }
};
```

### **Playwright Configuration** (`config/playwright.config.ts`)
```javascript
export default defineConfig({
  testDir: '../tests/e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    locale: 'en-GB',
    timezoneId: 'Europe/London'
  }
});
```

---

## Testing Best Practices

### ✅ **Do's**

**Write Tests That:**
- ✅ Test user behavior, not implementation details
- ✅ Use realistic test data
- ✅ Include error scenarios
- ✅ Test accessibility features
- ✅ Are deterministic and reliable

**Example Good Test:**
```javascript
test('shows error when service is unavailable', async ({ page }) => {
  // Mock service failure
  await page.route('**/api/services', route => 
    route.fulfill({ status: 500 })
  );

  await page.goto('/find-help?lat=53&lng=-2');
  
  // User sees helpful error message
  await expect(page.getByText(/unable to load services/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
});
```

### ❌ **Don'ts**

**Avoid Tests That:**
- ❌ Test implementation details (internal state)
- ❌ Are flaky or non-deterministic
- ❌ Require complex setup or mocking
- ❌ Test multiple concerns in one test
- ❌ Have unclear or missing assertions

**Example Poor Test:**
```javascript
// ❌ Bad - tests implementation details
test('component state updates correctly', () => {
  const wrapper = mount(<ServiceCard />);
  wrapper.setState({ expanded: true });
  expect(wrapper.state('expanded')).toBe(true);
});

// ✅ Good - tests user behavior
test('expands service details when clicked', () => {
  render(<ServiceCard service={mockService} />);
  fireEvent.click(screen.getByRole('button', { name: /view details/i }));
  expect(screen.getByText('Full service description')).toBeVisible();
});
```

---

## Coverage Requirements

### **Current Coverage**: 83.57% ✅

**Coverage Targets:**
- **Statements**: 70% minimum ✅ (83.57% achieved)
- **Branches**: 60% minimum ✅ (70.8% achieved)  
- **Functions**: 70% minimum ✅ (84.02% achieved)
- **Lines**: 70% minimum ✅ (84.74% achieved)

### **Coverage Priorities**

**High Priority (Must Test):**
1. **API Routes**: 100% coverage required
2. **Business Logic**: 90%+ coverage required
3. **Error Boundaries**: All error paths tested
4. **Critical User Journeys**: E2E coverage required

**Medium Priority:**
1. **UI Components**: 70%+ coverage target
2. **Utility Functions**: 80%+ coverage target
3. **Context Providers**: State management tested

**Lower Priority:**
1. **Static Components**: Basic rendering tests
2. **Configuration Files**: Integration tested
3. **Type Definitions**: Compile-time validated

---

## Error Testing Strategy

### **Error Scenarios We Test**

**API Failures:**
```javascript
test('handles API timeout gracefully', async ({ page }) => {
  await page.route('**/api/services', route => 
    route.abort('timedout')
  );
  
  await page.goto('/find-help');
  await expect(page.getByText(/connection timed out/i)).toBeVisible();
});
```

**Network Issues:**
```javascript
test('retries failed requests', async ({ page }) => {
  let attemptCount = 0;
  await page.route('**/api/services', route => {
    attemptCount++;
    if (attemptCount <= 2) {
      route.fulfill({ status: 500 });
    } else {
      route.fulfill({ status: 200, body: JSON.stringify(mockServices) });
    }
  });
});
```

**Data Validation:**
```javascript
test('validates postcode format', () => {
  render(<PostcodeForm onSubmit={mockSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/postcode/i), {
    target: { value: 'INVALID' }
  });
  fireEvent.click(screen.getByRole('button', { name: /find/i }));
  
  expect(screen.getByText(/invalid postcode/i)).toBeVisible();
  expect(mockSubmit).not.toHaveBeenCalled();
});
```

---

## Accessibility Testing

### **Automated Accessibility Tests**

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('component has no accessibility violations', async () => {
  const { container } = render(<ServiceCard service={mockService} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### **Keyboard Navigation Tests**

```javascript
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/find-help');
  
  // Tab through interactive elements
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /use location/i })).toBeFocused();
  
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /enter postcode/i })).toBeFocused();
  
  // Activate with Enter key
  await page.keyboard.press('Enter');
  await expect(page.getByLabel(/postcode/i)).toBeVisible();
});
```

---

## Skipped Tests Strategy

### Why Some Tests Are Skipped

In our testing suite, some tests are deliberately skipped rather than removed entirely. This strategic approach ensures comprehensive documentation whilst maintaining CI/CD pipeline stability.

### Categories of Skipped Tests

#### 1. **SWEP (Severe Weather Emergency Protocol) Tests** 🚨
**Current Status**: Frontend implementation complete, backend integration pending

**Files Affected**:
- `tests/e2e/swep-functionality.spec.ts` - E2E tests for SWEP user journeys
- `tests/__tests__/api/locations-swep.test.ts` - API endpoint tests
- `tests/__tests__/utils/swep.test.ts` - SWEP utility function tests
- `tests/__tests__/components/ui/SwepBanner.test.tsx` - SWEP banner component tests

**Why Skipped**: 
- ✅ **Frontend Components**: Fully implemented and working
- ❌ **Backend Systems**: CMS integration and database schemas not yet implemented
- ❌ **API Endpoints**: Depend on content management system data
- ❌ **Database Models**: SWEP data structure not finalised

**Re-enablement Plan**:
```javascript
// TODO: Re-enable these tests once CMS and database integration is complete
// SWEP functionality is frontend-ready but depends on backend systems not yet implemented
describe.skip('SWEP Functionality', () => {
```

When backend integration is complete:
1. Remove `.skip` from test descriptions
2. Verify all API endpoints return expected data structures
3. Update mock data to match production API responses
4. Run full test suite to ensure integration works end-to-end

#### 2. **Feature-Complete Frontend with Pending Backend** Pattern

**Philosophy**: We skip tests for features that are:
- ✅ **User Interface**: Complete and functional
- ✅ **User Experience**: Fully designed and implemented  
- ✅ **Component Logic**: All frontend behaviour working
- ❌ **Data Integration**: Backend APIs, databases, or external services not ready

**Benefits of This Approach**:
- **Documentation**: Tests serve as living documentation of expected behaviour
- **Quality Assurance**: Tests are ready to run as soon as backend is available
- **Regression Prevention**: Prevents accidental removal of test coverage
- **Development Continuity**: Frontend developers can continue working independently

### Skipped Test Guidelines

#### ✅ **When to Skip Tests**

**Skip tests when:**
- Frontend implementation is complete but depends on unimplemented backend services
- External API integrations are planned but not yet available
- Database schemas are being finalised
- Third-party service integrations are pending approval/configuration

**Example Pattern:**
```javascript
// TODO: Re-enable once [specific dependency] is implemented
// [Feature] functionality is frontend-ready but depends on [backend system] not yet implemented
describe.skip('[Feature] Tests', () => {
```

#### ❌ **When NOT to Skip Tests**

**Don't skip tests for:**
- Broken implementations that need fixing
- Incomplete frontend functionality
- Tests that are failing due to bugs
- Features that are partially implemented

**Instead:**
- Fix the implementation first
- Write tests for the current working state
- Use TODO comments for additional test cases needed

#### 🔄 **Re-enabling Skipped Tests**

**Process for re-enabling:**

1. **Verify Dependencies**: Confirm all backend systems are implemented
2. **Update Mock Data**: Ensure test mocks match production API responses
3. **Remove Skip Declarations**: Change `describe.skip` to `describe`
4. **Run Individual Test Suite**: Test the specific feature in isolation
5. **Update Test Data**: Modify test fixtures if API contracts changed
6. **Run Full Test Suite**: Ensure no conflicts with existing tests
7. **Document Changes**: Update test documentation with any changes made

**Example Re-enablement Checklist:**
```markdown
- [ ] CMS integration completed
- [ ] Database schema finalised
- [ ] API endpoints returning correct data structure
- [ ] Mock data updated to match production responses
- [ ] Tests pass individually
- [ ] Tests pass as part of full suite
- [ ] Documentation updated
```

### Monitoring Skipped Tests

#### Current Skipped Test Count: **4 Test Suites**
- **E2E Tests**: 1 suite (SWEP functionality)
- **Unit Tests**: 3 suites (SWEP API, utilities, component)

#### Review Schedule
**Monthly Review**: Assess which skipped tests can be re-enabled based on development progress.

**Tracking**: Each skipped test includes:
- Clear reason for skipping
- Dependencies required for re-enablement
- Expected timeline for completion
- Contact person/team responsible

---

## Continuous Integration

### **GitHub Actions Workflow**

Our CI/CD pipeline ensures all tests pass before deployment:

```yaml
- name: Run tests and build
  run: npm run build  # Runs all tests + build

- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

### **Quality Gates**

**Pre-deployment Checks:**
1. ✅ All unit tests pass
2. ✅ All E2E tests pass
3. ✅ Coverage thresholds met
4. ✅ No TypeScript errors
5. ✅ Next.js build succeeds

---

## Local Development

### **Running Tests Locally**

```bash
# Full test suite (matches CI)
npm run build

# Individual test commands
npm run test              # Unit tests
npm run test:watch        # Unit tests in watch mode
npm run test:e2e          # E2E tests
npm run test:e2e:headed   # E2E tests with browser UI
npm run test:e2e:debug    # E2E tests with debugging

# Coverage reporting
npm run test -- --coverage
```

### **Debugging Tests**

**Unit Test Debugging:**
```bash
npm run test:watch -- --verbose ServiceCard.test.tsx
```

**E2E Test Debugging:**
```bash
npm run test:e2e:debug -- --grep "postcode search"
```

**Coverage Analysis:**
```bash
npm run test -- --coverage --coverageReporters=html
open coverage/index.html
```

---

## Contributing Tests

### **For New Features**

When adding new features, include:

1. **Unit Tests**: Test core functionality
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user journeys
4. **Error Cases**: Test failure scenarios
5. **Accessibility**: Test keyboard/screen reader support

### **Test Review Checklist**

**Before submitting PR:**
- [ ] All tests pass locally
- [ ] Coverage thresholds maintained  
- [ ] Tests follow naming conventions
- [ ] Error scenarios included
- [ ] Accessibility considered
- [ ] Performance impact minimal

---

## Testing Resources

### **Documentation**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Guide](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

### **Internal Resources**
- `/docs/testing/e2e-testing-strategy.md` - E2E testing detailed guide
- `/tests/__mocks__/` - Mock implementations
- `/tests/fixtures/` - Test data and utilities

### **Getting Help**
- **Test Failures**: Check GitHub Actions logs
- **Writing Tests**: Review existing test examples
- **Coverage Issues**: Use coverage reports for guidance
- **E2E Debugging**: Use Playwright traces and screenshots

---

**Our testing philosophy ensures reliable, maintainable code that serves users effectively. Every test serves a purpose: protecting user experience and developer confidence.**

**Last Updated**: August 2024  
**Test Count**: 318 Unit + 61 E2E = 379 Total Tests ✅