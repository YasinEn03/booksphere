describe('HomeComponent', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('lädt die Seite und zeigt den Willkommenstext an', () => {
        cy.contains('Willkommen bei BookSphere').should('be.visible');
    });

    it('führt Suche per Button aus', () => {
        cy.get('input[placeholder="ISBN eingeben"]').clear().type('Beta');
        cy.get('button').contains('Suchen').click();

        cy.url().should('include', '/search');
    });

    it('führt Suche per Enter-Taste aus', () => {
        cy.get('input[placeholder="ISBN eingeben"]')
            .clear()
            .type('Alpha{enter}');

        cy.url().should('include', '/search');
    });

    it('zeigt Alert bei leerem Suchfeld', () => {
        cy.visit('/');
        cy.window().then((win) => cy.stub(win, 'alert').as('alert'));
        cy.get('input[placeholder="ISBN eingeben"]').clear();
        cy.get('input[placeholder="ISBN eingeben"]').should('be.empty');
        cy.get('button').contains('Suchen').click();
        cy.get('@alert').should(
            'have.been.calledWith',
            'Bitte etwas eingeben!',
        );
    });

    it('navigiert zu /list bei Klick auf JAVA-Keyword', () => {
        cy.get('button').contains('JAVA').click();
        cy.url().should('include', '/list');
    });

    it('navigiert zu Login-Seite bei Klick auf Login in Toolbar', () => {
        cy.get('a').contains('Login').click();
        cy.url().should('include', '/login');
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button').contains('Einloggen').click();
        cy.url().should('include', '/');
        cy.get('button[mat-icon-button]').click();

        cy.get('button').contains('Anpassen').should('be.visible');
        cy.get('button').contains('Hinzufügen').should('be.visible');
    });

    it('benutzt Admin-Funktionen nach Login als "admin"', () => {
        cy.get('a').contains('Login').click();
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button').contains('Einloggen').click();
        cy.get('button[mat-icon-button]').click();
        cy.get('button').contains('Anpassen').should('be.visible').click();
        cy.get('a').contains('Home').click();
        cy.get('button[mat-icon-button]').click();
        cy.get('button').contains('Hinzufügen').should('be.visible').click();
    });

    it('Toolbar zeigt keine Admin-Funktionen nach Login als "user"', () => {
        cy.get('a').contains('Login').click();
        cy.get('input[formControlName="username"]').type('user');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button').contains('Einloggen').click();
        cy.get('button[mat-icon-button]').click();
        cy.contains('button', 'Anpassen').should('not.exist');
        cy.contains('button', 'Hinzufügen').should('not.exist');
    });
});
