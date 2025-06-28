export class DashboardPage {
  // Selectors
  private readonly pageTitle = 'h1';
  private readonly welcomeMessage = 'h1:contains("Welcome")';
  private readonly createUserButton = 'button';
  private readonly usersTable = '[data-testid="users-table"]';
  private readonly themeToggle = 'button[class*="inline-flex"]';
  private readonly mainContent = 'main';

  // Actions
  visit() {
    cy.visit('http://localhost:5173/');
    return this;
  }

  clickLogout() {
    // Since there's no explicit logout button in the UI, simulate logout by clearing auth state
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/auth');
    return this;
  }

  clickCreateUser() {
    cy.get(this.createUserButton).click();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    // Wait for the page to load and check for key elements
    cy.get(this.pageTitle).should('be.visible').and('contain.text', 'Welcome back');
    cy.get(this.welcomeMessage).should('be.visible');
    cy.url().should('include', '/');
    return this;
  }

  shouldHaveUserManagementElements() {
    cy.get(this.createUserButton).should('be.visible');
    return this;
  }

  shouldRedirectToAuth() {
    cy.url().should('include', '/auth');
    return this;
  }
}
