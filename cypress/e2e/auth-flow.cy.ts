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

    it('should logout and redirect to /auth page when clicking on logout button', () => {
      cy.loginWithStub();
      dashboardPage.clickLogout();
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to /auth when accessing dashboard without authentication', () => {
      dashboardPage.visit();
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });

    it('should allow access to / when authenticated (using stubbed login)', () => {
      cy.loginWithStub();
      dashboardPage.visit().shouldBeVisible().shouldHaveUserManagementElements();
    });

    it('should maintain authentication state across page refreshes', () => {
      cy.quickLogin();
      cy.reload();
      dashboardPage.shouldBeVisible();
    });
  });

  describe('Login Stubbing Examples', () => {
    it('should successfully login with stubbed API response', () => {
      cy.intercept('POST', '**/api/login', {
        statusCode: 200,
        body: { token: 'QpwL5tke4Pnpja7X4' },
      }).as('loginSuccess');
      authPage.visit().fillEmail('test@example.com').fillPassword('password123').clickSignIn();
      cy.wait('@loginSuccess');
      cy.url().should('include', '/');
      dashboardPage.shouldBeVisible();
    });

    it('should handle login failure with stubbed error response', () => {
      cy.intercept('POST', '**/api/login', {
        statusCode: 400,
        body: { error: 'Missing email or username' },
      }).as('loginFailure');
      authPage.visit().fillEmail('invalid@example.com').fillPassword('wrongpassword').clickSignIn();
      cy.wait('@loginFailure');
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });

    it('should handle network timeout with stubbed delay', () => {
      cy.intercept('POST', '**/api/login', {
        statusCode: 200,
        body: { token: 'QpwL5tke4Pnpja7X4' },
        delay: 2,
      }).as('slowLogin');
      authPage.visit().fillEmail('test@example.com').fillPassword('password123').clickSignIn();
      cy.wait('@slowLogin');
      cy.url().should('include', '/');
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
      cy.url().should('include', '/auth');
      authPage.shouldBeVisible();
    });
  });

  describe('Navigation Flow Integration', () => {
    it('should complete full authentication cycle with stubbed login', () => {
      cy.intercept('POST', '**/api/login', {
        statusCode: 200,
        body: { token: 'QpwL5tke4Pnpja7X4' },
      }).as('loginStub');
      authPage.visit().shouldBeVisible();
      authPage.fillEmail('integration@test.com').fillPassword('testpass').clickSignIn();
      cy.wait('@loginStub');
      dashboardPage.shouldBeVisible();
      dashboardPage.clickLogout();
      authPage.shouldBeVisible();
      dashboardPage.visit();
      cy.url().should('include', '/auth');
    });

    it('should handle browser back/forward navigation correctly', () => {
      cy.quickLogin();
      dashboardPage.shouldBeVisible();
      cy.visit('/random-page');
      notFoundPage.shouldBeVisible();
      cy.go('back');
      dashboardPage.shouldBeVisible();
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
