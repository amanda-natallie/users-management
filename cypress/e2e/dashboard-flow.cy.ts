import { AuthPage } from '../support/page-objects/auth.page';
import { DashboardPage } from '../support/page-objects/dashboard.page';

describe('Dashboard Flow - User Management CRUD', () => {
  let dashboardPage: DashboardPage;
  let authPage: AuthPage;

  beforeEach(() => {
    authPage = new AuthPage();
    dashboardPage = new DashboardPage();
    cy.clearAuthState();
  });

  afterEach(() => {
    cy.clearAuthState();
  });

  describe('Dashboard Overview', () => {
    beforeEach(() => {
      cy.loginWithStub();
    });
    it('should display dashboard with user management elements', () => {
      dashboardPage.waitForTableLoad().shouldHaveTableActions();
    });

    it('should show users table with pagination', () => {
      dashboardPage.waitForTableLoad().shouldHaveTableActions();
      cy.get('button[aria-label="Go to next page"]').should('exist');
    });
  });

  describe('Create User (C)', () => {
    beforeEach(() => {
      cy.loginWithStub();
    });

    const validUser = {
      first_name: 'John',
      last_name: 'Doe',
      email: '2asd@dsad.com',
    };

    it('should open create user modal with form fields', () => {
      dashboardPage
        .waitForTableLoad()
        .clickCreateUser()
        .shouldHaveFormFields()
        .fillCreateUserForm(validUser.first_name, validUser.last_name, validUser.email)
        .submitForm();
    });

    it('should successfully create a new user with valid data', () => {
      cy.fixture('users').then(users => {
        const { validUser } = users;

        dashboardPage
          .waitForTableLoad()
          .clickCreateUser()
          .shouldHaveFormFields()
          .fillCreateUserForm(validUser.first_name, validUser.last_name, validUser.email)
          .submitForm();

        cy.contains(`User ${validUser.first_name} created successfully!`).should('be.visible');
        cy.get('[role="dialog"]').should('not.exist');
        dashboardPage.shouldHaveUserInTable(validUser.first_name, validUser.last_name);
      });
    });

    it('should show validation errors for empty required fields', () => {
      cy.fixture('users').then(users => {
        const { invalidUser } = users;

        dashboardPage
          .waitForTableLoad()
          .clickCreateUser()
          .shouldShowCreateUserModal()
          .fillCreateUserForm(invalidUser.first_name, invalidUser.last_name, invalidUser.email);

        dashboardPage.shouldShowValidationError('Invalid email address');
        cy.get('button[type="submit"]').should('be.disabled');
      });
    });

    it('should show validation errors for invalid email format', () => {
      dashboardPage
        .waitForTableLoad()
        .clickCreateUser()
        .shouldShowCreateUserModal()
        .fillCreateUserForm('John', 'Doe', 'invalid-email');

      dashboardPage.shouldShowValidationError('Invalid email address');
    });

    it('should show validation errors for long names', () => {
      cy.fixture('users').then(users => {
        const { longNameUser } = users;

        dashboardPage
          .waitForTableLoad()
          .clickCreateUser()
          .shouldShowCreateUserModal()
          .fillCreateUserForm(longNameUser.first_name, longNameUser.last_name, longNameUser.email);

        dashboardPage.shouldShowValidationError('First name must be less than 100 characters');
        dashboardPage.shouldShowValidationError('Last name must be less than 100 characters');
      });
    });

    it('should close modal when clicking cancel', () => {
      dashboardPage
        .waitForTableLoad()
        .clickCreateUser()
        .shouldShowCreateUserModal()
        .clickModalCancel();

      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should close modal when clicking close button', () => {
      dashboardPage.waitForTableLoad().clickCreateUser().shouldShowCreateUserModal().closeModal();

      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should clear form when reopening modal', () => {
      dashboardPage
        .waitForTableLoad()
        .clickCreateUser()
        .shouldShowCreateUserModal()
        .fillCreateUserForm('John', 'Doe', 'john@example.com')
        .closeModal();

      dashboardPage.clickCreateUser();

      cy.get('#create-user-first-name').should('have.value', '');
      cy.get('#create-user-last-name').should('have.value', '');
      cy.get('#create-user-email').should('have.value', '');
    });
  });

  describe('Read Users (R)', () => {
    beforeEach(() => {
      cy.loginWithStub();
    });
    it('should display users in table with correct information', () => {
      dashboardPage.waitForTableLoad();
      cy.get('table thead').should('contain.text', 'Name');
      cy.get('table thead').should('contain.text', 'Email');
      cy.get('table thead').should('contain.text', 'Actions');
      cy.get('tbody tr').should('have.length.greaterThan', 0);
    });

    it('should handle pagination correctly', () => {
      dashboardPage.waitForTableLoad();
      cy.get('button[aria-label="Go to next page"]').then($btn => {
        if ($btn.is(':enabled')) {
          dashboardPage.goToNextPage();
          cy.get('tbody tr').should('be.visible');
          dashboardPage.goToPreviousPage();
          cy.get('tbody tr').should('be.visible');
        }
      });
    });

    it('should show loading state while fetching users', () => {
      cy.intercept('GET', '**/api/users*', req => {
        req.reply({ delay: 1000 });
      }).as('getUsers');

      cy.reload();

      dashboardPage.shouldShowLoadingState();

      cy.wait('@getUsers');
      dashboardPage.shouldNotShowLoadingState();
    });
  });

  describe('Update User (U)', () => {
    beforeEach(() => {
      cy.loginWithStub();
      dashboardPage.waitForTableLoad();
    });

    it('should open update modal when clicking edit button', () => {
      dashboardPage.clickEditFirstUser();
      dashboardPage.shouldShowUpdateUserModal().shouldHaveFormFields();
    });

    it('should successfully update user with valid data', () => {
      cy.fixture('users').then(users => {
        const { updatedUser } = users;

        dashboardPage
          .clickEditFirstUser()
          .shouldShowUpdateUserModal()
          .fillUpdateUserForm(updatedUser.first_name, updatedUser.last_name, updatedUser.email)
          .submitForm();

        cy.contains(`User ${updatedUser.first_name} updated successfully!`).should('be.visible');
        cy.get('[role="dialog"]').should('not.exist');

        dashboardPage.shouldHaveUserInTable(updatedUser.first_name, updatedUser.last_name);
      });
    });

    it('should show validation errors for invalid update data', () => {
      cy.fixture('users').then(users => {
        const { invalidUser } = users;

        dashboardPage
          .clickEditFirstUser()
          .shouldShowUpdateUserModal()
          .fillUpdateUserForm(invalidUser.first_name, invalidUser.last_name, invalidUser.email);

        dashboardPage.shouldShowValidationError('Invalid email address');
      });
    });

    it('should close update modal when clicking cancel', () => {
      dashboardPage.clickEditFirstUser().shouldShowUpdateUserModal().clickModalCancel();

      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should close update modal when clicking close button', () => {
      dashboardPage.clickEditFirstUser().shouldShowUpdateUserModal().closeModal();

      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Delete User (D)', () => {
    beforeEach(() => {
      cy.loginWithStub();
      dashboardPage.waitForTableLoad();
    });

    it('should open delete confirmation modal when clicking delete button', () => {
      dashboardPage.clickDeleteFirstUser();
      dashboardPage.shouldShowDeleteUserModal();
    });

    it('should close delete modal when clicking close button', () => {
      dashboardPage.clickDeleteFirstUser().shouldShowDeleteUserModal().closeModal();
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.loginWithStub();
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/users*', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getUsersError');

      cy.reload();
      cy.wait('@getUsersError');
      cy.get('table').should('be.visible');
    });
  });

  describe('Accessibility and UX', () => {
    beforeEach(() => {
      cy.loginWithStub();
    });

    it('should have proper ARIA labels for actions', () => {
      dashboardPage.waitForTableLoad();

      cy.get('button[aria-label*="Edit"]').should('exist');
      cy.get('button[aria-label*="Delete"]').should('exist');
    });

    it('should show loading states during operations', () => {
      cy.intercept('POST', '**/api/users', req => {
        req.reply({ delay: 1000 });
      }).as('createUserLoading');

      dashboardPage
        .waitForTableLoad()
        .clickCreateUser()
        .fillCreateUserForm('John', 'Doe', 'john@example.com')
        .submitForm();

      cy.get('button[type="submit"]').should('contain.text', 'Creating user...');
      cy.wait('@createUserLoading');
    });
  });
});
