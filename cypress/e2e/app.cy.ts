describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the main page elements', () => {
    // Check if the main elements are visible
    cy.get('h1').should('contain', 'Vite + React');
    cy.get('.card').should('be.visible');
    cy.get('button').should('contain', 'count is 0');
  });

  it('should increment counter when button is clicked', () => {
    // Initial state
    cy.get('button').should('contain', 'count is 0');

    // Click the button
    cy.get('button').click();

    // Check if counter incremented
    cy.get('button').should('contain', 'count is 1');

    // Click again
    cy.get('button').click();

    // Check if counter incremented again
    cy.get('button').should('contain', 'count is 2');
  });

  it('should have working external links', () => {
    // Check Vite logo link
    cy.get('a[href="https://vite.dev"]').should('be.visible');

    // Check React logo link
    cy.get('a[href="https://react.dev"]').should('be.visible');
  });

  it('should display logos correctly', () => {
    // Check if logos are visible
    cy.get('img[alt="Vite logo"]').should('be.visible');
    cy.get('img[alt="React logo"]').should('be.visible');
  });

  it('should use custom commands', () => {
    // Test custom waitForPageLoad command
    cy.waitForPageLoad();

    // Test custom shouldBeVisibleAndClickable command
    cy.shouldBeVisibleAndClickable('button');
  });
});
