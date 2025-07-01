/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      waitForPageLoad(): Chainable<void>;
      shouldBeVisibleAndClickable(selector: string): Chainable<void>;
      login(email?: string, password?: string): Chainable<void>;
      loginWithStub(email?: string, password?: string): Chainable<void>;
      quickLogin(): Chainable<void>;
      signup(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      clearAuthState(): Chainable<void>;
    }
  }
}

export {};
