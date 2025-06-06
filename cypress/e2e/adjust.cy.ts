describe('Adjust Book Page', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + 'home');

        cy.visit('/adjust');
    });

    it('Loads and displays available book IDs', () => {
        cy.get('.button-group button').should('have.length.greaterThan', 0);
    });

    it('Loads form when selecting a book ID', () => {
        cy.get('.button-group button').first().click();
        cy.get('input#isbn').invoke('val').should('not.be.empty');
    });

    it('Successfully updates book with valid data', () => {
        cy.get('.button-group button').first().click();

        cy.get('input#isbn').clear().type('978-1-56619-909-4');
        cy.get('input#version').clear().type('2');
        cy.get('input#rating').clear().type('4');
        cy.get('mat-select#art')
            .click()
            .get('mat-option')
            .contains('HARDCOVER')
            .click();
        cy.get('input#preis').clear().type('19.99');
        cy.get('input#rabatt').clear().type('0.1');
        cy.get('mat-checkbox[formcontrolname="lieferbar"]').click();
        cy.get('input#datum').clear().type('2/1/2025');
        cy.get('input#homepage').clear().type('https://example.com');
        cy.get('input#schlagwoerter').clear().type('JAVA, TYPESCRIPT, PHYTON');

        cy.get('button[type="submit"]').click();
    });

    it('zeigt Validierungsfehler bei ungültiger Eingabe', () => {
        cy.get('.button-group button').first().click();

        cy.get('#isbn').clear();
        cy.get('#rating').clear().type('10').blur();
        cy.get('#rabatt').clear().type('2').blur();

        cy.get('#version').click();

        cy.get('mat-error')
            .contains('ISBN ist erforderlich')
            .should('be.visible');
        cy.get('mat-error')
            .contains('Rating darf höchstens 5 sein')
            .should('be.visible');
        cy.get('mat-error')
            .contains('Rabatt darf höchstens 1 sein')
            .should('be.visible');

        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Redirects to detail page after successful update', () => {
        cy.get('.button-group button').first().click();

        cy.get('input#isbn').clear().type('978-0-13-110362-7');
        cy.get('button[type="submit"]').click();

        cy.url({ timeout: 5000 }).should('include', '/detail');
    });
});
