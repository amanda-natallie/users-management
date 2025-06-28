/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

// Custom command to check if element is visible and clickable
Cypress.Commands.add('shouldBeVisibleAndClickable', selector => {
  cy.get(selector).should('be.visible').should('not.be.disabled');
});

Cypress.Commands.add(
  'login',
  (email: string = 'eve.holt@reqres.in', password: string = 'cityslicka') => {
    cy.visit('/auth');
    cy.get('#signin-email').type(email);
    cy.get('#signin-password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  },
);

Cypress.Commands.add('logout', () => {
  cy.get('body').then($body => {
    if ($body.find('[data-testid="user-menu"]').length > 0) {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('button:contains("Logout")').click();
    } else if ($body.find('button:contains("Logout")').length > 0) {
      cy.get('button:contains("Logout")').click();
    } else {
      cy.clearLocalStorage();
      cy.visit('/auth');
    }
  });
});

Cypress.Commands.add('clearAuthState', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Type definitions
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      signup(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      clearAuthState(): Chainable<void>;
    }
  }
}
