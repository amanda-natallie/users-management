export class NotFoundPage {
  // Selectors
  private readonly notFoundTitle = '[data-testid="card-title"]:contains("Page Not Found")';
  private readonly backToDashboardButton = '[data-testid="button"]:contains("Go to Dashboard")';
  private readonly errorMessage = '[data-testid="card-header"]';

  // Actions
  visitNonExistentRoute() {
    cy.visit('/random-page');
    return this;
  }

  clickBackToDashboard() {
    cy.get(this.backToDashboardButton).click();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    cy.get(this.notFoundTitle).should('be.visible');
    cy.get(this.errorMessage).should('be.visible');
    return this;
  }

  shouldHaveBackButton() {
    cy.get(this.backToDashboardButton).should('be.visible');
    return this;
  }
}
