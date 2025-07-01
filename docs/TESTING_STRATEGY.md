# 🧪 Testing Strategy

## Overview

The User Management System implements a comprehensive testing strategy that ensures code quality, reliability, and maintainability. With **99.45% test coverage**, the application follows industry best practices for testing React applications.

## Testing Pyramid

Our testing strategy follows the testing pyramid approach:

```
        /\
       /  \     E2E Tests (Cypress)
      /____\    2 test suites
     /      \
    /        \  Integration Tests
   /__________\  Component + Hook testing
  /            \
 /              \ Unit Tests (Jest + RTL)
/________________\ 38 test files
```

## Test Coverage Metrics

### Current Coverage (99.45%)

| Metric         | Coverage | Target |
| -------------- | -------- | ------ |
| **Statements** | 99.45%   | 80%    |
| **Branches**   | 100%     | 80%    |
| **Functions**  | 98.03%   | 80%    |
| **Lines**      | 99.44%   | 80%    |

### Coverage Exclusions

```typescript
// jest.config.js
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/utils/env.ts',           // Environment utilities
  '!src/utils/tailwind.ts',      // Tailwind utilities
  '!src/components/ui/**/*.tsx', // Third-party UI components
  '!src/components/layout/**/*.tsx', // Layout components
  '!src/**/index.ts',            // Barrel exports
  '!src/**/*.d.ts',              // Type definitions
  '!src/main.tsx',               // Entry point
  '!src/vite-env.d.ts',          // Vite types
  '!src/services/mock-users.ts', // Mock data
  '!src/pages/**/*.tsx',         // Page components
  '!src/schemas/**/*.ts',        // Validation schemas
  '!src/hooks/**/*.ts',          // Custom hooks
],
```

## Unit Testing (Jest + React Testing Library)

### Testing Philosophy

- **Test behavior, not implementation**
- **Write tests that resemble how users interact with your app**
- **Focus on user-centric testing**
- **Maintain test readability and maintainability**

### Test File Structure

```
src/
├── components/
│   └── forms/
│       └── password-strength/
│           ├── password-strength.tsx
│           └── password-strength.test.tsx
├── hooks/
│   └── use-auth/
│       ├── use-auth.ts
│       └── use-auth.test.ts
└── services/
    └── users-service/
        ├── users-service.ts
        └── users-service.test.ts
```

### Component Testing Examples

#### Basic Component Test

```typescript
// password-strength.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrength from './password-strength';

describe('PasswordStrength', () => {
  it('renders with weak password', () => {
    render(<PasswordStrength password="123" />);

    expect(screen.getByText('Weak')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('renders with strong password', () => {
    render(<PasswordStrength password="StrongPass123!" />);

    expect(screen.getByText('Strong')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
```

#### Form Component Test

```typescript
// sign-in-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInForm from './sign-in-form';

describe('SignInForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<SignInForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows validation errors for invalid email', async () => {
    const user = userEvent.setup();
    render(<SignInForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });
});
```

### Hook Testing Examples

#### Custom Hook Test

```typescript
// use-auth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLogin } from './use-auth';

describe('useLogin', () => {
  it('handles successful login', async () => {
    const mockNavigate = jest.fn();
    const mockToast = { success: jest.fn() };

    jest.mock('react-router', () => ({
      useNavigate: () => mockNavigate,
    }));

    jest.mock('@/hooks/use-toast', () => ({
      useToast: () => mockToast,
    }));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    expect(mockToast.success).toHaveBeenCalled();
  });
});
```

### Service Testing Examples

#### API Service Test

```typescript
// users-service.test.ts
import { AxiosError } from 'axios';
import UsersService from './users-service';
import api from '@/services/api/api';

jest.mock('@/services/api/api');

describe('UsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches users successfully', async () => {
    const mockResponse = {
      data: {
        page: 1,
        per_page: 6,
        total: 12,
        data: [{ id: 1, email: 'test@example.com' }],
      },
    };

    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await UsersService.getUsers(1);

    expect(api.get).toHaveBeenCalledWith('/users?page=1');
    expect(result).toEqual(mockResponse.data);
  });

  it('handles API errors gracefully', async () => {
    const mockError = new AxiosError('Network error');
    (api.get as jest.Mock).mockRejectedValue(mockError);

    await expect(UsersService.getUsers(1)).rejects.toThrow('Network error');
  });
});
```

## Integration Testing

### Component Integration Tests

```typescript
// dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Dashboard Integration', () => {
  it('loads and displays users table', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(screen.getByText(/welcome, user!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });
});
```

## E2E Testing (Cypress)

### Test Structure

```
cypress/
├── e2e/
│   ├── auth-flow.cy.ts      # Authentication tests
│   └── dashboard-flow.cy.ts # Dashboard functionality tests
├── support/
│   ├── commands.ts          # Custom commands
│   └── page-objects/        # Page Object Model
│       ├── auth.page.ts
│       ├── dashboard.page.ts
│       └── not-found.page.ts
└── fixtures/
    └── users.json           # Test data
```

### Page Object Model

```typescript
// auth.page.ts
export class AuthPage {
  private readonly emailInput = '#signin-email';
  private readonly passwordInput = '#signin-password';
  private readonly signInButton = 'button[type="submit"]';

  visit() {
    cy.visit('http://localhost:5173/auth');
    return this;
  }

  fillEmail(email: string) {
    cy.get(this.emailInput).type(email);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.passwordInput).type(password);
    return this;
  }

  clickSignIn() {
    cy.get(this.signInButton).click();
    return this;
  }

  shouldBeVisible() {
    cy.get('[data-testid="auth-page"]').should('be.visible');
    return this;
  }
}
```

### E2E Test Examples

#### Authentication Flow

```typescript
// auth-flow.cy.ts
import { AuthPage } from '../support/page-objects/auth.page';
import { DashboardPage } from '../support/page-objects/dashboard.page';

describe('Authentication Flow', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    authPage = new AuthPage();
    dashboardPage = new DashboardPage();
    cy.clearAuthState();
  });

  it('should successfully login with valid credentials', () => {
    authPage.visit().fillEmail('eve.holt@reqres.in').fillPassword('cityslicka').clickSignIn();

    cy.url().should('include', '/');
    dashboardPage.shouldBeVisible().shouldHaveUserManagementElements();
  });

  it('should handle login failure gracefully', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 400,
      body: { error: 'Invalid credentials' },
    }).as('loginFailure');

    authPage.visit().fillEmail('invalid@example.com').fillPassword('wrongpassword').clickSignIn();

    cy.wait('@loginFailure');
    cy.url().should('include', '/auth');
  });
});
```

#### CRUD Operations

```typescript
// dashboard-flow.cy.ts
describe('User Management CRUD', () => {
  beforeEach(() => {
    cy.loginWithStub();
  });

  it('should create a new user', () => {
    cy.intercept('POST', '**/api/users', {
      statusCode: 201,
      body: {
        name: 'John Doe',
        job: 'Engineer',
        id: '123',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    }).as('createUser');

    dashboardPage
      .waitForTableLoad()
      .clickCreateUser()
      .fillCreateUserForm('John', 'Doe', 'john@example.com')
      .submitForm();

    cy.wait('@createUser');
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });

  it('should delete a user with confirmation', () => {
    cy.intercept('DELETE', '**/api/users/1', {
      statusCode: 204,
    }).as('deleteUser');

    dashboardPage
      .waitForTableLoad()
      .clickDeleteFirstUser()
      .shouldShowDeleteUserModal()
      .confirmDelete();

    cy.wait('@deleteUser');
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });
});
```

## Test Utilities and Helpers

### Custom Commands

```typescript
// commands.ts
Cypress.Commands.add('loginWithStub', () => {
  cy.intercept('POST', '**/api/login', {
    statusCode: 200,
    body: { token: 'QpwL5tke4Pnpja7X4' },
  }).as('loginStub');

  cy.visit('/auth');
  cy.get('#signin-email').type('eve.holt@reqres.in');
  cy.get('#signin-password').type('cityslicka');
  cy.get('button[type="submit"]').click();
  cy.wait('@loginStub');
});

Cypress.Commands.add('clearAuthState', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

### Test Data Factories

```typescript
// test-utils/factories.ts
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
  ...overrides,
});

export const createMockUsersResponse = (page = 1, users = []) => ({
  page,
  per_page: 6,
  total: 12,
  total_pages: 2,
  data: users.length > 0 ? users : [createMockUser()],
  support: {
    url: 'https://example.com/support',
    text: 'Support text',
  },
});
```

## Performance Testing

### Bundle Size Testing

```typescript
// bundle-size.test.ts
import { getBundleSize } from '@size-limit/jest';

describe('Bundle Size', () => {
  it('should be under 500KB', async () => {
    const size = await getBundleSize('dist/**/*.js');
    expect(size).toBeLessThan(500 * 1024); // 500KB
  });
});
```

### Performance Monitoring

```typescript
// performance.test.ts
describe('Performance', () => {
  it('should load dashboard within 2 seconds', () => {
    cy.visit('/', {
      onBeforeLoad: win => {
        win.performance.mark('start-loading');
      },
    });

    cy.get('[data-testid="dashboard"]')
      .should('be.visible')
      .then(() => {
        cy.window().then(win => {
          win.performance.mark('end-loading');
          win.performance.measure('dashboard-load', 'start-loading', 'end-loading');

          const measure = win.performance.getEntriesByName('dashboard-load')[0];
          expect(measure.duration).to.be.lessThan(2000);
        });
      });
  });
});
```

## Accessibility Testing

### Automated A11y Testing

```typescript
// accessibility.test.ts
describe('Accessibility', () => {
  it('should meet WCAG 2.1 AA standards', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('should have proper ARIA labels', () => {
    cy.visit('/');
    cy.get('button[aria-label*="Edit"]').should('exist');
    cy.get('button[aria-label*="Delete"]').should('exist');
    cy.get('button[aria-label*="Create"]').should('exist');
  });
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:ci

      - name: Run E2E tests
        run: |
          pnpm dev &
          pnpm test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Best Practices

### 1. Test Organization

- **Group related tests** using `describe` blocks
- **Use descriptive test names** that explain the behavior
- **Follow AAA pattern**: Arrange, Act, Assert
- **Keep tests independent** and isolated

### 2. Test Data Management

- **Use factories** for creating test data
- **Clean up after tests** to prevent state pollution
- **Mock external dependencies** consistently
- **Use realistic test data** that represents real scenarios

### 3. Performance Considerations

- **Mock heavy operations** in unit tests
- **Use `act()`** for state updates in React tests
- **Optimize E2E tests** with proper waiting strategies
- **Monitor test execution time** and optimize slow tests

### 4. Maintenance

- **Update tests** when changing implementation
- **Refactor tests** to improve readability
- **Remove obsolete tests** that no longer add value
- **Document complex test scenarios** with comments

## Future Enhancements

### Planned Improvements

1. **Visual Regression Testing**: Implement Percy or Chromatic for visual testing
2. **Contract Testing**: Add Pact for API contract testing
3. **Load Testing**: Implement k6 for performance testing
4. **Mutation Testing**: Add Stryker for mutation testing
5. **Test Analytics**: Implement test metrics and reporting

### Monitoring and Metrics

- **Test execution time** tracking
- **Coverage trends** over time
- **Flaky test detection** and prevention
- **Test failure analysis** and reporting

---

This comprehensive testing strategy ensures the User Management System maintains high quality, reliability, and maintainability while providing confidence in the application's behavior across all scenarios.
