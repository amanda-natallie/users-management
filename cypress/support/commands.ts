Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

Cypress.Commands.add('shouldBeVisibleAndClickable', (selector: string) => {
  cy.get(selector).should('be.visible').should('not.be.disabled');
});

Cypress.Commands.add(
  'loginWithStub',
  (email: string = 'eve.holt@reqres.in', password: string = 'cityslicka') => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: {
        token: 'QpwL5tke4Pnpja7X4',
      },
    }).as('loginStub');

    cy.visit('/auth');
    cy.get('#signin-email').type(email);
    cy.get('#signin-password').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginStub');
    cy.url().should('include', '/');
  },
);

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

Cypress.Commands.add('quickLogin', () => {
  cy.window().then(win => {
    win.localStorage.setItem('auth_token', 'QpwL5tke4Pnpja7X4');
  });
  cy.visit('/');
});

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
