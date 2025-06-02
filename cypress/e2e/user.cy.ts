describe('UserComponent E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + 'home');
        cy.visit('/user');
    });

    it('displays user profile when userInfo is present', () => {
        cy.get('mat-card').should('be.visible');
        cy.contains('Benutzerprofil').should('be.visible');
        cy.contains('User-ID').should('be.visible');
        cy.contains('Benutzername').should('be.visible');
        cy.get('mat-list-item').contains('role').should('be.visible');
    });

    it('redirects to login page accessing the page without user is logged in', () => {
        cy.visit('/home');
        cy.contains('button', 'Logout').click();
        cy.visit('/user');
        cy.url().should('contain', '/login');
    });
});
