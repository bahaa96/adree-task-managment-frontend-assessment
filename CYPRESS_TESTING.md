# Cypress E2E Testing Guide

This document provides a comprehensive guide for running and writing Cypress E2E tests for the TaskMaster application.

## Overview

The TaskMaster application includes a robust E2E testing suite built with Cypress to ensure the application works correctly from a user's perspective. The tests cover all major functionality including dashboard metrics, task CRUD operations, navigation, accessibility, and error handling.

## Test Structure

```
cypress/
├── e2e/                          # Test files
│   ├── dashboard.cy.ts           # Dashboard functionality tests
│   ├── tasks.cy.ts              # Task management tests
│   ├── navigation.cy.ts         # Navigation and routing tests
│   ├── accessibility.cy.ts      # Accessibility compliance tests
│   └── error-handling.cy.ts    # Error handling and edge case tests
├── support/                      # Support files
│   ├── commands.ts              # Custom Cypress commands
│   ├── e2e.ts                  # Global test setup
│   └── index.d.ts              # TypeScript definitions
├── fixtures/                     # Test data
│   └── tasks.json              # Sample task data
└── config.ts                    # Cypress configuration
```

## Running Tests

### Local Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run Cypress in interactive mode:**
   ```bash
   npm run cypress:open
   ```

3. **Run tests from command line:**
   ```bash
   npm run cypress:run
   ```

4. **Run specific test file:**
   ```bash
   npx cypress run --spec cypress/e2e/dashboard.cy.ts
   ```

### CI/CD Pipeline

E2E tests are automatically run in the CI/CD pipeline:
- Tests run on all pull requests and pushes to main/develop branches
- Tests execute against a built version of the application
- Screenshots and videos are captured on failure for debugging
- Tests must pass before deployment to staging

## Test Coverage Areas

### 1. Dashboard Tests (`dashboard.cy.ts`)
- **Page Structure**: Verifies dashboard renders correctly with all components
- **Metrics Cards**: Validates metric data display and accuracy
- **Charts**: Tests chart rendering and data visualization
- **Recent Activity**: Ensures activity timeline displays correctly
- **Responsiveness**: Tests dashboard on different screen sizes
- **Navigation**: Verifies dashboard navigation functionality

### 2. Task Management Tests (`tasks.cy.ts`)
- **Task Display**: Validates task list/table rendering
- **CRUD Operations**: Tests create, read, update, delete functionality
- **Search**: Verifies search functionality works correctly
- **Filtering**: Tests status and priority filters
- **Sorting**: Validates different sort options
- **Responsive Design**: Tests mobile/tablet/desktop views
- **Form Validation**: Ensures form validation works properly
- **Pagination/Infinite Scroll**: Tests data loading mechanisms

### 3. Navigation Tests (`navigation.cy.ts`)
- **Route Navigation**: Tests navigation between pages
- **Active States**: Verifies active route highlighting
- **Mobile Navigation**: Tests mobile-specific navigation features
- **Browser Navigation**: Tests back/forward buttons
- **Direct URLs**: Validates direct URL access
- **Keyboard Navigation**: Ensures keyboard accessibility

### 4. Accessibility Tests (`accessibility.cy.ts`)
- **Page Structure**: Validates semantic HTML and landmarks
- **Form Accessibility**: Ensures forms are accessible
- **Keyboard Navigation**: Tests keyboard-only navigation
- **Focus Management**: Validates proper focus handling
- **ARIA Attributes**: Ensures proper ARIA usage
- **Screen Reader Support**: Tests screen reader compatibility
- **Color Contrast**: Validates readable text
- **Reduced Motion**: Tests reduced motion preferences

### 5. Error Handling Tests (`error-handling.cy.ts`)
- **Network Errors**: Tests handling of network failures
- **Server Errors**: Validates server error responses
- **Empty States**: Tests empty data scenarios
- **Form Validation**: Tests validation error handling
- **API Failures**: Tests API error responses
- **Slow Responses**: Tests loading states and timeouts
- **Concurrent Requests**: Tests multiple simultaneous requests
- **Browser Storage**: Tests storage error handling

## Custom Commands

The test suite includes several custom Cypress commands for common operations:

### `cy.visitPage(page)`
Navigates to a page and waits for API calls to complete.
```typescript
cy.visitPage('/tasks');
```

### `cy.createTask(taskData)`
Creates a task via the UI with the provided data.
```typescript
cy.createTask({
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high'
});
```

### `cy.checkDashboardMetrics()`
Validates dashboard metrics are displayed correctly.
```typescript
cy.checkDashboardMetrics();
```

### `cy.testResponsive()`
Tests responsive design on different screen sizes.
```typescript
cy.testResponsive();
```

### `cy.searchAndFilterTasks(searchTerm, filters)`
Tests search and filter functionality.
```typescript
cy.searchAndFilterTasks('Search Term', {
  status: 'todo',
  priority: 'high',
  sortBy: 'date-asc'
});
```

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern
- Keep tests focused and independent

### 2. Data Management
- Use fixtures for consistent test data
- Clean up data between tests
- Use realistic data that reflects production scenarios
- Mock APIs when testing edge cases

### 3. Selector Strategy
- Use `data-testid` attributes for test selectors
- Avoid selectors tied to styling or DOM structure
- Create custom selectors for complex components
- Use descriptive selector names

### 4. Wait Strategies
- Use explicit waits over implicit waits
- Wait for specific conditions rather than fixed delays
- Use `cy.waitForApi()` for API completion
- Handle loading states properly

### 5. Error Testing
- Test both happy paths and error scenarios
- Verify error messages are user-friendly
- Test recovery from error states
- Ensure accessibility during error states

## Debugging

### 1. Test Runner
- Use Cypress Test Runner for interactive debugging
- Take screenshots at specific points: `cy.screenshot()`
- Use `cy.debug()` to pause execution and inspect
- Check the command log for detailed information

### 2. Network Debugging
- Use browser DevTools to inspect network requests
- Check console for JavaScript errors
- Verify MSW mocks are working correctly
- Test API responses independently

### 3. Common Issues
- **Timing Issues**: Use proper waits and assertions
- **Flaky Tests**: Ensure tests are independent and deterministic
- **Selector Issues**: Use stable selectors and data attributes
- **Environment Issues**: Verify test environment setup

## CI/CD Integration

### GitHub Actions
E2E tests run in the CI pipeline with the following steps:
1. Build the application
2. Start the preview server
3. Run Cypress tests
4. Upload artifacts on failure

### Configuration
- Tests run in headless Chrome browser
- Screenshots and videos captured on failure
- Parallel execution for faster feedback
- Automatic retries for flaky tests

## Writing New Tests

When adding new tests, follow this template:

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visitPage('/feature-page');
  });

  it('should describe the specific behavior being tested', () => {
    // Arrange: Set up the test conditions

    // Act: Perform the action

    // Assert: Verify the expected outcome
  });

  it('should handle edge case scenario', () => {
    // Test edge case
  });
});
```

## Maintenance

### Regular Updates
- Update tests when features change
- Review and refactor test code regularly
- Keep test dependencies up to date
- Monitor test execution times and optimize

### Test Health
- Monitor test success rates
- Identify and fix flaky tests
- Review test coverage gaps
- Update documentation as needed

## Troubleshooting

### Common Cypress Issues
1. **Tests fail in CI but pass locally**
   - Check environment differences
   - Verify timing and waits
   - Review browser versions

2. **Flaky tests**
   - Increase wait times
   - Improve selector stability
   - Reduce test dependencies

3. **Slow tests**
   - Optimize test data setup
   - Reduce unnecessary waits
   - Use parallel execution

4. **Memory issues**
   - Clean up between tests
   - Reduce browser instances
   - Monitor resource usage

For more information, refer to the [Cypress documentation](https://docs.cypress.io/) and the project's issue tracker.