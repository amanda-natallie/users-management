import { AuthPage } from '../support/page-objects/auth.page';
import { DashboardPage } from '../support/page-objects/dashboard.page';
import { NotFoundPage } from '../support/page-objects/not-found.page';

describe('Authentication Flow', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;
  let notFoundPage: NotFoundPage;

  beforeEach(() => {
    authPage = new AuthPage();
    dashboardPage = new DashboardPage();
    notFoundPage = new NotFoundPage();

    // Clear authentication state before each test
    cy.clearAuthState();
  });

  afterEach(() => {
    // Clear authentication state after each test
    cy.clearAuthState();
  });

  describe('Signup Flow', () => {
    it('should display the signup form when clicking sign up link', () => {
      authPage
        .visit()
        .shouldBeVisible()
        .clickSignUpLink()
        .shouldHaveSignupForm()
        .shouldShowSignupTitle();
    });
  });

  describe('Login Flow', () => {
    it('should display the login form when visiting /auth', () => {
      authPage.visit().shouldBeVisible().shouldHaveLoginForm().shouldShowWelcomeMessage();
    });

    it('should successfully login with valid credentials', () => {
      authPage.visit().fillEmail('eve.holt@reqres.in').fillPassword('cityslicka').clickSignIn();

      // Should redirect to dashboard
      cy.url().should('include', '/');
      dashboardPage.shouldBeVisible().shouldHaveUserManagementElements();
    });

    it('should login with any email and password (as per documentation)', () => {
      const testCases = [{ email: 'eve.holt@reqres.in', password: 'cityslicka' }];

      testCases.forEach(({ email, password }) => {
        cy.clearAuthState();

        authPage.visit().fillEmail(email).fillPassword(password).clickSignIn();

        cy.url().should('include', '/');
        dashboardPage.shouldBeVisible();
      });
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to /auth when accessing dashboard without authentication', () => {
      dashboardPage.visit();
      // Should be redirected to auth page
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });

    it('should allow access to / when authenticated', () => {
      // Login first
      cy.login();

      // Visit dashboard directly
      dashboardPage.visit().shouldBeVisible();
    });

    it('should maintain authentication state across page refreshes', () => {
      cy.login();

      // Refresh the page
      cy.reload();

      // Should still be on dashboard
      dashboardPage.shouldBeVisible();
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      // Login before each logout test
      cy.login();
    });

    it('should logout and redirect to /auth when clicking logout button', () => {
      dashboardPage.shouldBeVisible().clickLogout();

      // Should redirect to auth page
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });

    it('should prevent access to /dashboard after logout', () => {
      dashboardPage.clickLogout();

      // Try to access dashboard again
      dashboardPage.visit();

      // Should be redirected to auth
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });

    it('should clear authentication state on logout', () => {
      dashboardPage.clickLogout();

      // Check that auth state is cleared
      cy.window().then(win => {
        expect(win.localStorage.getItem('auth-token')).to.be.null;
      });
    });
  });

  describe('404 Page', () => {
    it('should show 404 page for non-existent routes', () => {
      notFoundPage.visitNonExistentRoute().shouldBeVisible().shouldHaveBackButton();
    });

    it('should navigate back to dashboard from 404 page when authenticated', () => {
      cy.login();

      notFoundPage.visitNonExistentRoute().shouldBeVisible().clickBackToDashboard();

      dashboardPage.shouldBeVisible();
    });

    it('should navigate to auth page from 404 page when not authenticated', () => {
      notFoundPage.visitNonExistentRoute().shouldBeVisible().clickBackToDashboard();

      // Should redirect to auth since user is not authenticated
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });
  });

  describe('Navigation Flow Integration', () => {
    it('should complete full authentication cycle', () => {
      // 1. Visit auth page
      authPage.visit().shouldBeVisible();

      // 2. Login
      authPage.fillEmail('eve.holt@reqres.in').fillPassword('testpass').clickSignIn();

      // 3. Verify dashboard access
      dashboardPage.shouldBeVisible();

      // 4. Logout
      dashboardPage.clickLogout();

      // 5. Verify redirect to auth
      authPage.shouldBeVisible();

      // 6. Verify dashboard is protected
      dashboardPage.visit();
      cy.url().should('include', '/auth');
    });

    it('should handle browser back/forward navigation correctly', () => {
      // Login and navigate
      cy.login();
      dashboardPage.shouldBeVisible();

      // Go to a non-existent page
      cy.visit('/random-page');
      notFoundPage.shouldBeVisible();

      // Use browser back button
      cy.go('back');
      dashboardPage.shouldBeVisible();

      // Use browser forward button
      cy.go('forward');
      notFoundPage.shouldBeVisible();
    });
  });

  describe('Login Error Handling', () => {
    it('should handle network errors gracefully during login', () => {
      cy.intercept('POST', '**/api/login', { forceNetworkError: true }).as('loginError');

      authPage.visit().fillEmail('eve.holt@reqres.in').fillPassword('password').clickSignIn();

      cy.wait('@loginError');

      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });
  });
});
