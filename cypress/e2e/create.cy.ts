describe('Create Book', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + 'home');
    });

    it('should create a new book successfully', () => {
        cy.visit('/create');
        cy.url().should('include', '/create');

        cy.get('mat-checkbox[name="lieferbar"] input[type="checkbox"]').check({
            force: true,
        });

        cy.get('mat-select[name="art"]').click();
        cy.get('mat-option').contains('HARDCOVER').click();

        cy.get('input[name="schlagwoerter"]').clear().type('JAVA, TYPESCRIPT');

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/list');
        cy.contains('mat-card', 'Neues Buch').should('exist');
    });

    it('should not create a new book', () => {
        cy.visit('/create');
        cy.url().should('include', '/create');

        const timestamp = Date.now();

        cy.get('input[name="isbn"]').clear().type(`978-${timestamp}`);
        cy.get('input[name="titel.titel"]').clear().type('Testbuch');
        cy.get('input[name="titel.untertitel"]').type(
            'Ein automatisierter Test',
        );
        cy.get('input[name="preis"]').clear().type('25');
        cy.get('input[name="rating"]').clear().type('4');
        cy.get('input[name="rabatt"]').clear().type('0.2');
        cy.get('input[name="homepage"]').type('https://example.com');

        const today = new Date().toISOString().split('T')[0];
        cy.get('input[name="datum"]').type(today);

        cy.get('mat-checkbox[name="lieferbar"] input[type="checkbox"]').check({
            force: true,
        });
        cy.get('mat-select[name="art"]').click();
        cy.get('mat-option').contains('HARDCOVER').click();

        cy.get('input[name="schlagwoerter"]').clear().type('Fehler, Fehler');

        cy.get('button[type="submit"]').click();
    });
});
