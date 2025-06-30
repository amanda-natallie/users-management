/// <reference path="../support/commands.ts" />
import { DashboardPage } from '../support/page-objects/dashboard.page';

describe('Dashboard Flow - User Management CRUD', () => {
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    dashboardPage = new DashboardPage();

    // Login before each test
    cy.login();

    // Visit dashboard and wait for it to load
    dashboardPage.visit().shouldBeVisible().waitForTableLoad();
  });

  afterEach(() => {
    // Clear authentication state after each test
    cy.clearAuthState();
  });

  describe('Dashboard Overview', () => {
    it('should display dashboard with user management elements', () => {
      dashboardPage.shouldBeVisible().shouldHaveUserManagementElements().shouldHaveTableActions();
    });

    it('should show users table with pagination', () => {
      dashboardPage.waitForTableLoad().shouldHaveTableActions();

      // Check if pagination exists
      cy.get('button[aria-label="Go to next page"]').should('exist');
    });
  });

  describe('Create User (C)', () => {
    beforeEach(() => {
      dashboardPage.clickCreateUser();
    });

    it('should open create user modal with form fields', () => {
      dashboardPage.shouldShowCreateUserModal().shouldHaveFormFields();
    });

    it('should successfully create a new user with valid data', () => {
      cy.fixture('users').then(users => {
        const { validUser } = users;

        dashboardPage
          .shouldShowCreateUserModal()
          .fillCreateUserForm(validUser.first_name, validUser.last_name, validUser.email)
          .submitForm();

        // Should show success message
        cy.contains(`User ${validUser.first_name} created successfully!`).should('be.visible');

        // Modal should close
        cy.get('[role="dialog"]').should('not.exist');

        // User should appear in table
        dashboardPage.shouldHaveUserInTable(validUser.first_name, validUser.last_name);
      });
    });

    it('should show validation errors for empty required fields', () => {
      cy.fixture('users').then(users => {
        const { invalidUser } = users;

        dashboardPage
          .shouldShowCreateUserModal()
          .fillCreateUserForm(invalidUser.first_name, invalidUser.last_name, invalidUser.email);

        // Should show validation errors
        dashboardPage.shouldShowValidationError('First name is required');
        dashboardPage.shouldShowValidationError('Last name is required');
        dashboardPage.shouldShowValidationError('Invalid email address');

        // Submit button should be disabled
        cy.get('button[type="submit"]').should('be.disabled');
      });
    });

    it('should show validation errors for invalid email format', () => {
      dashboardPage.shouldShowCreateUserModal().fillCreateUserForm('John', 'Doe', 'invalid-email');

      dashboardPage.shouldShowValidationError('Invalid email address');
    });

    it('should show validation errors for long names', () => {
      cy.fixture('users').then(users => {
        const { longNameUser } = users;

        dashboardPage
          .shouldShowCreateUserModal()
          .fillCreateUserForm(longNameUser.first_name, longNameUser.last_name, longNameUser.email);

        dashboardPage.shouldShowValidationError('First name must be less than 100 characters');
        dashboardPage.shouldShowValidationError('Last name must be less than 100 characters');
      });
    });

    it('should close modal when clicking cancel', () => {
      dashboardPage.shouldShowCreateUserModal().clickModalCancel();

      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should close modal when clicking close button', () => {
      dashboardPage.shouldShowCreateUserModal().closeModal();

      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should clear form when reopening modal', () => {
      dashboardPage
        .shouldShowCreateUserModal()
        .fillCreateUserForm('John', 'Doe', 'john@example.com')
        .closeModal();

      // Reopen modal
      dashboardPage.clickCreateUser();

      // Form should be empty
      cy.get('#create-user-first-name').should('have.value', '');
      cy.get('#create-user-last-name').should('have.value', '');
      cy.get('#create-user-email').should('have.value', '');
    });
  });

  describe('Read Users (R)', () => {
    it('should display users in table with correct information', () => {
      dashboardPage.waitForTableLoad();

      // Check table structure
      cy.get('table thead').should('contain.text', 'Name');
      cy.get('table thead').should('contain.text', 'Email');
      cy.get('table thead').should('contain.text', 'Actions');

      // Check that user rows exist
      cy.get('tbody tr').should('have.length.greaterThan', 0);
    });

    it('should show user avatars and names correctly', () => {
      dashboardPage.waitForTableLoad();

      // Check first user row has avatar and name
      cy.get('tbody tr')
        .first()
        .within(() => {
          cy.get('img[alt*="avatar"]').should('be.visible');
          cy.get('td').should('contain.text', 'George');
        });
    });

    it('should handle pagination correctly', () => {
      dashboardPage.waitForTableLoad();

      // Check if next page button is available
      cy.get('button[aria-label="Go to next page"]').then($btn => {
        if ($btn.is(':enabled')) {
          // Go to next page
          dashboardPage.goToNextPage();

          // Should show different users
          cy.get('tbody tr').should('be.visible');

          // Go back to previous page
          dashboardPage.goToPreviousPage();

          // Should be back to original page
          cy.get('tbody tr').should('be.visible');
        }
      });
    });

    it('should show loading state while fetching users', () => {
      // Intercept the API call to simulate loading
      cy.intercept('GET', '**/api/users*', req => {
        req.reply({ delay: 1000 });
      }).as('getUsers');

      // Reload page to trigger loading
      cy.reload();

      // Should show loading state
      dashboardPage.shouldShowLoadingState();

      // Wait for API call to complete
      cy.wait('@getUsers');

      // Loading should disappear
      dashboardPage.shouldNotShowLoadingState();
    });
  });

  describe('Update User (U)', () => {
    beforeEach(() => {
      dashboardPage.waitForTableLoad();
    });

    it('should open update modal when clicking edit button', () => {
      dashboardPage.clickEditFirstUser();

      dashboardPage.shouldShowUpdateUserModal().shouldHaveFormFields();
    });

    it('should pre-fill form with existing user data', () => {
      dashboardPage.clickEditFirstUser();

      // Form should be pre-filled with existing data
      cy.get('#update-user-first-name').should('not.have.value', '');
      cy.get('#update-user-last-name').should('not.have.value', '');
      cy.get('#update-user-email').should('not.have.value', '');
    });

    it('should successfully update user with valid data', () => {
      cy.fixture('users').then(users => {
        const { updatedUser } = users;

        dashboardPage
          .clickEditFirstUser()
          .shouldShowUpdateUserModal()
          .fillUpdateUserForm(updatedUser.first_name, updatedUser.last_name, updatedUser.email)
          .submitForm();

        // Should show success message
        cy.contains(`User ${updatedUser.first_name} updated successfully!`).should('be.visible');

        // Modal should close
        cy.get('[role="dialog"]').should('not.exist');

        // Updated user should appear in table
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

        // Should show validation errors
        dashboardPage.shouldShowValidationError('First name is required');
        dashboardPage.shouldShowValidationError('Last name is required');
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
      dashboardPage.waitForTableLoad();
    });

    it('should open delete confirmation modal when clicking delete button', () => {
      dashboardPage.clickDeleteFirstUser();

      dashboardPage.shouldShowDeleteUserModal();
    });

    it('should show correct user name in delete modal', () => {
      // Get first user's name
      cy.get('tbody tr')
        .first()
        .within(() => {
          cy.get('td')
            .first()
            .invoke('text')
            .then(userName => {
              dashboardPage.clickDeleteFirstUser();

              // Modal should contain the user's name
              cy.get('[role="dialog"]').should('contain.text', userName.trim());
            });
        });
    });

    it('should successfully delete user when confirming', () => {
      // Get first user's name before deletion
      cy.get('tbody tr')
        .first()
        .within(() => {
          cy.get('td')
            .first()
            .invoke('text')
            .then(userName => {
              const name = userName.trim();

              dashboardPage.clickDeleteFirstUser().shouldShowDeleteUserModal();

              // Click delete button
              cy.get('button:contains("Delete User")').click();

              // Should show success message
              cy.contains('User deleted successfully!').should('be.visible');

              // Modal should close
              cy.get('[role="dialog"]').should('not.exist');

              // User should not appear in table anymore
              dashboardPage.shouldNotHaveUserInTable(name.split(' ')[0], name.split(' ')[1]);
            });
        });
    });

    it('should cancel deletion when clicking cancel', () => {
      // Get first user's name
      cy.get('tbody tr')
        .first()
        .within(() => {
          cy.get('td')
            .first()
            .invoke('text')
            .then(userName => {
              const name = userName.trim();

              dashboardPage.clickDeleteFirstUser().shouldShowDeleteUserModal().clickModalCancel();

              // Modal should close
              cy.get('[role="dialog"]').should('not.exist');

              // User should still be in table
              dashboardPage.shouldHaveUserInTable(name.split(' ')[0], name.split(' ')[1]);
            });
        });
    });

    it('should close delete modal when clicking close button', () => {
      dashboardPage.clickDeleteFirstUser().shouldShowDeleteUserModal().closeModal();

      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('CRUD Integration Flow', () => {
    it('should complete full CRUD cycle for a user', () => {
      cy.fixture('users').then(users => {
        const { validUser, updatedUser } = users;

        // CREATE
        dashboardPage
          .clickCreateUser()
          .shouldShowCreateUserModal()
          .fillCreateUserForm(validUser.first_name, validUser.last_name, validUser.email)
          .submitForm();

        cy.contains(`User ${validUser.first_name} created successfully!`).should('be.visible');

        // READ - Verify user exists
        dashboardPage.shouldHaveUserInTable(validUser.first_name, validUser.last_name);

        // UPDATE
        dashboardPage
          .clickEditUserByName(validUser.first_name, validUser.last_name)
          .shouldShowUpdateUserModal()
          .fillUpdateUserForm(updatedUser.first_name, updatedUser.last_name, updatedUser.email)
          .submitForm();

        cy.contains(`User ${updatedUser.first_name} updated successfully!`).should('be.visible');

        // READ - Verify updated user exists
        dashboardPage.shouldHaveUserInTable(updatedUser.first_name, updatedUser.last_name);

        // DELETE
        dashboardPage
          .clickDeleteUserByName(updatedUser.first_name, updatedUser.last_name)
          .shouldShowDeleteUserModal();

        cy.get('button:contains("Delete User")').click();

        cy.contains('User deleted successfully!').should('be.visible');

        // READ - Verify user no longer exists
        dashboardPage.shouldNotHaveUserInTable(updatedUser.first_name, updatedUser.last_name);
      });
    });

    it('should handle multiple users operations', () => {
      cy.fixture('users').then(users => {
        const { validUser } = users;

        // Create first user
        dashboardPage
          .clickCreateUser()
          .fillCreateUserForm(validUser.first_name, validUser.last_name, validUser.email)
          .submitForm();

        cy.contains(`User ${validUser.first_name} created successfully!`).should('be.visible');

        // Create second user with different data
        dashboardPage
          .clickCreateUser()
          .fillCreateUserForm('Alice', 'Johnson', 'alice@example.com')
          .submitForm();

        cy.contains('User Alice created successfully!').should('be.visible');

        // Verify both users exist
        dashboardPage.shouldHaveUserInTable(validUser.first_name, validUser.last_name);
        dashboardPage.shouldHaveUserInTable('Alice', 'Johnson');

        // Update first user
        dashboardPage
          .clickEditUserByName(validUser.first_name, validUser.last_name)
          .fillUpdateUserForm('Bob', 'Wilson', 'bob@example.com')
          .submitForm();

        cy.contains('User Bob updated successfully!').should('be.visible');

        // Verify updates
        dashboardPage.shouldHaveUserInTable('Bob', 'Wilson');
        dashboardPage.shouldHaveUserInTable('Alice', 'Johnson');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors during user creation', () => {
      cy.intercept('POST', '**/api/users', { forceNetworkError: true }).as('createUserError');

      dashboardPage
        .clickCreateUser()
        .fillCreateUserForm('John', 'Doe', 'john@example.com')
        .submitForm();

      cy.wait('@createUserError');

      // Should show error message
      cy.contains('Failed to create user. Please try again.').should('be.visible');
    });

    it('should handle network errors during user update', () => {
      cy.intercept('PUT', '**/api/users/*', { forceNetworkError: true }).as('updateUserError');

      dashboardPage
        .clickEditFirstUser()
        .fillUpdateUserForm('John', 'Doe', 'john@example.com')
        .submitForm();

      cy.wait('@updateUserError');

      // Should show error message
      cy.contains('Failed to update user. Please try again.').should('be.visible');
    });

    it('should handle network errors during user deletion', () => {
      cy.intercept('DELETE', '**/api/users/*', { forceNetworkError: true }).as('deleteUserError');

      dashboardPage.clickDeleteFirstUser();
      cy.get('button:contains("Delete User")').click();

      cy.wait('@deleteUserError');

      // Should show error message
      cy.contains('Failed to delete user. Please try again.').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/users*', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getUsersError');

      cy.reload();
      cy.wait('@getUsersError');

      // Should handle error gracefully
      cy.get('table').should('be.visible');
    });
  });

  describe('Accessibility and UX', () => {
    it('should have proper ARIA labels for actions', () => {
      dashboardPage.waitForTableLoad();

      // Check edit buttons have proper aria-labels
      cy.get('button[aria-label*="Edit"]').should('exist');

      // Check delete buttons have proper aria-labels
      cy.get('button[aria-label*="Delete"]').should('exist');
    });

    it('should show loading states during operations', () => {
      // Intercept API calls to simulate loading
      cy.intercept('POST', '**/api/users', req => {
        req.reply({ delay: 1000 });
      }).as('createUserLoading');

      dashboardPage
        .clickCreateUser()
        .fillCreateUserForm('John', 'Doe', 'john@example.com')
        .submitForm();

      // Should show loading state
      cy.get('button[type="submit"]').should('contain.text', 'Creating user...');

      cy.wait('@createUserLoading');
    });
  });
});
