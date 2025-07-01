import './commands';

beforeEach(() => {
  cy.viewport(1280, 720);
});

Cypress.on('uncaught:exception', err => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
