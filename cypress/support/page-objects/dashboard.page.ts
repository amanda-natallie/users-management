export class DashboardPage {
  // Selectors
  private readonly pageTitle = 'h1';
  private readonly welcomeMessage = 'h1:contains("Welcome")';
  private readonly createUserButton = 'span[data-testid="create-user-button"]';
  private readonly logoutButton = 'button[data-testid="logout-button"]';
  private readonly usersTable = 'table';
  private readonly userRow = 'tbody tr';
  private readonly editButton = 'button[aria-label*="Edit"]';
  private readonly deleteButton = 'button[aria-label*="Delete"]';
  private readonly paginationNext = 'button[aria-label="Go to next page"]';
  private readonly paginationPrev = 'button[aria-label="Go to previous page"]';
  private readonly loadingSpinner = '[data-testid="loading-spinner"]';

  // Modal selectors
  private readonly modal = '[role="dialog"]';
  private readonly modalTitle = '[role="dialog"] h2';
  private readonly modalClose = 'button[aria-label="Close"]';
  private readonly modalCancel = 'button:contains("Cancel")';

  // Form selectors
  private readonly firstNameInput = '#create-user-first-name, #update-user-first-name';
  private readonly lastNameInput = '#create-user-last-name, #update-user-last-name';
  private readonly emailInput = '#create-user-email, #update-user-email';
  private readonly submitButton = 'button[type="submit"]';

  // Actions
  visit() {
    cy.visit('http://localhost:5173/');
    return this;
  }

  clickLogout() {
    cy.get(this.logoutButton).should('be.visible').click();
    return this;
  }

  clickCreateUser() {
    cy.get(this.createUserButton).should('be.visible').click();
    return this;
  }

  waitForTableLoad() {
    cy.get(this.usersTable).should('be.visible');
    cy.get(this.loadingSpinner).should('not.exist');
    return this;
  }

  getFirstUserRow() {
    return cy.get(this.userRow).first();
  }

  clickEditFirstUser() {
    cy.get(this.userRow).first().find(this.editButton).click();
    return this;
  }

  clickDeleteFirstUser() {
    cy.get(this.userRow).first().find(this.deleteButton).click();
    return this;
  }

  clickEditUserByName(firstName: string, lastName: string) {
    cy.get(this.userRow)
      .contains(`${firstName} ${lastName}`)
      .parent()
      .find(this.editButton)
      .click();
    return this;
  }

  clickDeleteUserByName(firstName: string, lastName: string) {
    cy.get(this.userRow)
      .contains(`${firstName} ${lastName}`)
      .parent()
      .find(this.deleteButton)
      .click();
    return this;
  }

  // Modal actions
  shouldHaveModalOpen() {
    cy.get(this.modal).should('be.visible');
    return this;
  }

  closeModal() {
    cy.get(this.modalClose).click();
    return this;
  }

  clickModalCancel() {
    cy.get(this.modalCancel).click();
    return this;
  }

  // Form actions
  fillCreateUserForm(firstName: string, lastName: string, email: string) {
    cy.get(this.firstNameInput).clear().type(firstName);
    cy.get(this.lastNameInput).clear().type(lastName);
    cy.get(this.emailInput).clear().type(email);
    return this;
  }

  fillUpdateUserForm(firstName: string, lastName: string, email: string) {
    cy.get(this.firstNameInput).clear().type(firstName);
    cy.get(this.lastNameInput).clear().type(lastName);
    cy.get(this.emailInput).clear().type(email);
    return this;
  }

  submitForm() {
    cy.get(this.submitButton).click();
    return this;
  }

  // Pagination actions
  goToNextPage() {
    cy.get(this.paginationNext).should('be.enabled').click();
    return this;
  }

  goToPreviousPage() {
    cy.get(this.paginationPrev).should('be.enabled').click();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    cy.get(this.pageTitle).should('be.visible').and('contain.text', 'Welcome');
    cy.get(this.welcomeMessage).should('be.visible');
    cy.url().should('include', '/');
    return this;
  }

  shouldHaveUserManagementElements() {
    cy.get(this.createUserButton).should('be.visible');
    cy.get(this.usersTable).should('be.visible');
    return this;
  }

  shouldRedirectToAuth() {
    cy.url().should('include', '/auth');
    return this;
  }

  shouldShowCreateUserModal() {
    cy.get(this.modal).should('be.visible');
    cy.get(this.modalTitle).should('contain.text', 'Create User');
    return this;
  }

  shouldShowUpdateUserModal() {
    cy.get(this.modal).should('be.visible');
    cy.get(this.modalTitle).should('contain.text', 'Update User');
    return this;
  }

  shouldShowDeleteUserModal() {
    cy.get(this.modal).should('be.visible');
    cy.get(this.modalTitle).should('contain.text', 'Delete');
    return this;
  }

  shouldHaveFormFields() {
    cy.get(this.firstNameInput).should('be.visible');
    cy.get(this.lastNameInput).should('be.visible');
    cy.get(this.emailInput).should('be.visible');
    return this;
  }

  shouldShowValidationError(errorMessage: string) {
    cy.contains(errorMessage).should('be.visible');
    return this;
  }

  shouldNotShowValidationError(errorMessage: string) {
    cy.contains(errorMessage).should('not.exist');
    return this;
  }

  shouldHaveUserInTable(firstName: string, lastName: string) {
    cy.get(this.userRow).should('contain.text', `${firstName} ${lastName}`);
    return this;
  }

  shouldNotHaveUserInTable(firstName: string, lastName: string) {
    cy.get(this.userRow).should('not.contain.text', `${firstName} ${lastName}`);
    return this;
  }

  shouldHaveTableActions() {
    cy.get(this.editButton).should('be.visible');
    cy.get(this.deleteButton).should('be.visible');
    return this;
  }

  shouldShowSuccessMessage(message: string) {
    cy.contains(message).should('be.visible');
    return this;
  }

  shouldShowLoadingState() {
    cy.get(this.loadingSpinner).should('be.visible');
    return this;
  }

  shouldNotShowLoadingState() {
    cy.get(this.loadingSpinner).should('not.exist');
    return this;
  }
}
