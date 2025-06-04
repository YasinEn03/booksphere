describe('Redirections', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should redirect to page-not-found', () => {
        cy.visit('/not-existent');
        cy.url().should('contain', 'not-existent');
        cy.get('h2').should('contain', 'Page Not Found');
    });

    it('should redirect to access-denied', () => {
        cy.get('a').contains('Login').click();
        cy.visit('/create');
        cy.url().should('contain', 'access-denied');
        cy.get('button').contains('Zur Startseite').click();
        cy.url().should('contain', '/');
        cy.visit('/adjust');
        cy.url().should('contain', 'access-denied');
    });
});
