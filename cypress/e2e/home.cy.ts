describe('HomeComponent', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads the page and displays welcome text', () => {
        cy.contains('Willkommen bei BookSphere').should('be.visible');
    });

    it('performs search via button click', () => {
        cy.get('input[placeholder="ISBN eingeben"]').clear().type('Beta');
        cy.get('button').contains('Suchen').click();
        cy.url().should('include', '/search');
    });

    it('performs search via Enter key', () => {
        cy.get('input[placeholder="ISBN eingeben"]')
            .clear()
            .type('Alpha{enter}');
        cy.url().should('include', '/search');
    });

    it('shows warning when search input is empty', () => {
        cy.visit('/');
        cy.get('input[placeholder="ISBN eingeben"]')
            .clear()
            .invoke('val', '')
            .trigger('input');
        cy.get('input[placeholder="ISBN eingeben"]').should('be.empty');
        cy.get('button').contains('Suchen').click();
        cy.contains('Bitte etwas eingeben!').should('be.visible');
    });

    it('navigates to /list when JAVA keyword is clicked', () => {
        cy.get('button').contains('JAVA').click();
        cy.url().should('include', '/list');
    });

    it('navigates to login page and logs in as admin', () => {
        cy.get('a').contains('Login').click();
        cy.url().should('include', '/login');
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button').contains('Einloggen').click();
        cy.url().should('include', '/');
        cy.get('a[mat-button]').contains('Anpassen').should('be.visible');
        cy.get('a[mat-button]').contains('Hinzufügen').should('be.visible');
    });

    it('uses admin features after logging in as admin', () => {
        cy.get('a').contains('Login').click();
        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button').contains('Einloggen').click();
        cy.get('a[mat-button]')
            .contains('Anpassen')
            .should('be.visible')
            .click();
        cy.get('a').contains('Home').click();
        cy.get('a[mat-button]')
            .contains('Hinzufügen')
            .should('be.visible')
            .click();
    });

    it('toolbar shows no admin features after logging in as user', () => {
        cy.get('a').contains('Login').click();
        cy.get('input[formControlName="username"]').type('user');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button').contains('Einloggen').click();
        cy.get('button[mat-icon-button]').click();
        cy.contains('a[mat-button]', 'Anpassen').should('not.exist');
        cy.contains('a[mat-button]', 'Hinzufügen').should('not.exist');
    });
});
