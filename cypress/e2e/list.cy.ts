describe('Book List Page', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.get('input[formControlName="username"]').type('admin');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button[type="submit"]').click();

        cy.url().should('eq', Cypress.config().baseUrl + 'home');

        cy.visit('/list');
        cy.url().should('include', '/list');
    });

    it('should load and display books with pagination', () => {
        cy.get('mat-card.book-card').should('have.length.at.most', 6);

        cy.get('.pagination button').should('exist');
    });

    it('should filter books by JAVA keyword', () => {
        cy.get('input[type="checkbox"]').parent().contains('JAVA').click();
    });

    it('should reset filters when "None" button is clicked', () => {
        cy.get('input[type="checkbox"]').parent().contains('JAVA').click();
        cy.get('input[type="checkbox"]').parent().contains('PYTHON').click();

        cy.contains('button', 'Keine').click();

        cy.get('mat-card.book-card').should('have.length.at.least', 1);
    });

    it('should navigate to book detail page on card click', () => {
        cy.get('mat-card.book-card').first().click();
        cy.url().should('include', '/detail');
    });

    it('should navigate to detail page and allow editing and deleting the book', () => {
        cy.url().should('include', '/');
        cy.visit('/list');

        cy.get('mat-card.book-card').first().click();
        cy.url().should('include', '/detail');

        cy.contains('ISBN').should('exist');
        cy.contains('button', 'Bearbeiten').click();
        cy.url().should('include', '/adjust');
        cy.visit('/list');
        cy.get('mat-card.book-card').first().click();
        cy.contains('button', 'Löschen').click();
        cy.visit('/home');
    });

    it('should prevent normal user from editing and deleting books', () => {
        cy.visit('/home');
        cy.get('button[mat-icon-button]')
            .contains('logout', { matchCase: false })
            .click();

        cy.contains('a', 'Login').click();
        cy.url().should('include', '/login');
        cy.get('input[formControlName="username"]').type('user');
        cy.get('input[formControlName="password"]').type('p');
        cy.get('button[type="submit"]').click();

        cy.url().should('eq', Cypress.config().baseUrl + 'home');

        cy.visit('/list');
        cy.url().should('include', '/list');

        cy.get('mat-card.book-card').first().click();
        cy.url().should('include', '/detail');

        cy.contains('ISBN').should('exist');
        cy.contains('button', 'Bearbeiten').should('not.exist');
        cy.contains('button', 'Löschen').should('not.exist');

        cy.visit('/home');

        cy.get('button[mat-icon-button]')
            .contains('logout', { matchCase: false })
            .click();
    });
});
