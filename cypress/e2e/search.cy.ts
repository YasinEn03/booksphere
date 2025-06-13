describe('HomeComponent', () => {
    beforeEach(() => {
        cy.visit('/search');
    });

    it('loads the page', () => {
        cy.contains('Buchsuche').should('be.visible');
    });

    it('search book by id & isbn', () => {
        cy.get('input[placeholder="Buch-ID eingeben"]')
            .should('exist')
            .should('be.visible')
            .type('20');
        cy.get('button').contains('Suche nach ID').click();
        cy.contains('Buch-ID: 20').should('exist');
        cy.get('input[placeholder="ISBN eingeben"]')
            .should('exist')
            .should('be.visible')
            .type('978-3-540-43081-0');
        cy.get('button').contains('Suche nach ISBN').click();
        cy.contains('ISBN: 978-3-540-43081-0').should('exist');
    });

    it('should show error if bookID not found', () => {
        cy.get('input[placeholder="Buch-ID eingeben"]')
            .should('exist')
            .should('be.visible')
            .type('10');

        cy.contains('button', 'Suche nach ID').click();

        cy.contains('Buch-ID:').should('not.exist');
        cy.get('.error').should(
            'contain.text',
            'Buch mit dieser ID konnte nicht gefunden werden',
        );
    });

    it('should show error if isbn not found', () => {
        cy.get('input[placeholder="ISBN eingeben"]')
            .should('exist')
            .should('be.visible')
            .type('11111111111');

        cy.contains('button', 'Suche nach ISBN').click();
        cy.contains('ISBN:').should('not.exist');
        cy.get('.error').should(
            'contain.text',
            'Buch mit dieser ISBN konnte nicht gefunden werden',
        );
    });

    it('should show error if there is no id', () => {
        cy.get('input[placeholder="Buch-ID eingeben"]')
            .should('exist')
            .should('be.visible');

        cy.contains('button', 'Suche nach ID').click();

        cy.contains('Buch-ID:').should('not.exist');
        cy.get('.error').should(
            'contain.text',
            'Bitte geben Sie eine Buch-ID ein',
        );
    });

    it('should show error if there is no isbn', () => {
        cy.get('input[placeholder="ISBN eingeben"]')
            .should('exist')
            .should('be.visible');

        cy.contains('button', 'Suche nach ISBN').click();

        cy.contains('ISBN:').should('not.exist');
        cy.get('.error').should(
            'contain.text',
            'Bitte geben Sie eine ISBN ein',
        );
    });
});
