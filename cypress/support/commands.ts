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

// Example login command (uncomment and customize as needed)
// Cypress.Commands.add('login', (email: string, password: string) => {
//   cy.visit('/login')
//   cy.get('[data-cy=email]').type(email)
//   cy.get('[data-cy=password]').type(password)
//   cy.get('[data-cy=login-button]').click()
// })
