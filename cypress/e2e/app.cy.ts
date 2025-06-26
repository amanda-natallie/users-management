describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the main page elements', () => {
    cy.get('h1').should('contain', 'AuthenticationPage');
  });
});
