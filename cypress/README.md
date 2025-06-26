# Cypress E2E Tests

This directory contains end-to-end tests for the application using Cypress.

## Structure

```
cypress/
├── e2e/           # Test files
├── fixtures/      # Test data
├── support/       # Support files and custom commands
└── tsconfig.json  # TypeScript configuration for Cypress
```

## Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
pnpm test:e2e:open
# or
pnpm cypress:open
```

### Run Tests in Headless Mode
```bash
pnpm test:e2e
# or
pnpm cypress:run
```

## Prerequisites

Before running the tests, make sure the development server is running:

```bash
pnpm dev
```

The tests are configured to run against `http://localhost:5173` (Vite's default port).

## Custom Commands

The following custom commands are available:

- `cy.waitForPageLoad()` - Waits for the page to be fully loaded
- `cy.shouldBeVisibleAndClickable(selector)` - Checks if an element is visible and clickable

## Writing Tests

1. Create test files in the `cypress/e2e/` directory
2. Use the `.cy.ts` extension for TypeScript files
3. Follow the existing test structure in `app.cy.ts`

## Best Practices

- Use descriptive test names
- Group related tests using `describe` blocks
- Use `beforeEach` for common setup
- Use data attributes (`data-cy`) for element selection when possible
- Keep tests independent and isolated 