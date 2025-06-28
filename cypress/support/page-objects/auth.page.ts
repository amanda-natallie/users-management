export class AuthPage {
  // Selectors
  private readonly emailInput = '#signin-email';
  private readonly passwordInput = '#signin-password';
  private readonly signInButton = 'button[type="submit"]';
  private readonly signUpLink = 'button:contains("Sign up")';
  private readonly authPageContainer = '[data-testid="auth-page"]';

  // Signup selectors
  private readonly signupEmailInput = '#signup-email';
  private readonly signupPasswordInput = '#signup-password';
  private readonly signupConfirmPasswordInput = '#signup-confirm-password';
  private readonly createAccountButton = 'button:contains("Create Account")';
  private readonly signInLink = 'button:contains("Sign in")';
  private readonly signupTitle = 'h1:contains("Create an account")';
  private readonly signinTitle = 'h1:contains("Welcome back")';

  // Actions
  visit() {
    cy.visit('http://localhost:5173/auth');
    return this;
  }

  fillEmail(email: string) {
    cy.get(this.emailInput).clear().type(email);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.passwordInput).clear().type(password);
    return this;
  }

  clickSignIn() {
    cy.get(this.signInButton).click();
    return this;
  }

  clickSignUpLink() {
    cy.get(this.signUpLink).click();
    return this;
  }

  clickSignInLink() {
    cy.get(this.signInLink).click();
    return this;
  }

  // Signup actions
  fillSignupEmail(email: string) {
    cy.get(this.signupEmailInput).clear().type(email);
    return this;
  }

  fillSignupPassword(password: string) {
    cy.get(this.signupPasswordInput).clear().type(password);
    return this;
  }

  fillSignupConfirmPassword(password: string) {
    cy.get(this.signupConfirmPasswordInput).clear().type(password);
    return this;
  }

  clickCreateAccount() {
    cy.get(this.createAccountButton).click();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    cy.get(this.authPageContainer).should('be.visible');
    return this;
  }

  shouldHaveLoginForm() {
    cy.get(this.emailInput).should('be.visible');
    cy.get(this.passwordInput).should('be.visible');
    cy.get(this.signInButton).should('be.visible');
    return this;
  }

  shouldShowWelcomeMessage() {
    cy.contains('Welcome back').should('be.visible');
    return this;
  }

  // Signup assertions
  shouldHaveSignupForm() {
    cy.get(this.signupEmailInput).should('be.visible');
    cy.get(this.signupPasswordInput).should('be.visible');
    cy.get(this.signupConfirmPasswordInput).should('be.visible');
    cy.get(this.createAccountButton).should('be.visible');
    return this;
  }

  shouldShowSignupTitle() {
    cy.get(this.signupTitle).should('be.visible');
    return this;
  }

  shouldShowSigninTitle() {
    cy.get(this.signinTitle).should('be.visible');
    return this;
  }

  shouldShowPasswordMismatchError() {
    cy.contains('Passwords do not match').should('be.visible');
    return this;
  }

  shouldShowEmailValidationError() {
    cy.contains('Please enter a valid email').should('be.visible');
    return this;
  }

  shouldShowPasswordRequirements() {
    cy.contains('Password must be at least').should('be.visible');
    return this;
  }
}
