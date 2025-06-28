// Import commands
import './commands';

beforeEach(() => {
  cy.viewport(1280, 720);

  cy.clearLocalStorage();
  cy.clearCookies();
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // that might occur during navigation or authentication
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
