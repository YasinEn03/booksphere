describe('ChartComponent E2E', () => {
    beforeEach(() => {
        cy.visit('/chart');
    });

    it('zeigt Introbereich mit Chart Buttons', () => {
        cy.get('.chart-intro').should('be.visible');
        cy.contains('🥧 Pie Chart').should('be.visible');
        cy.contains('📊 Bar Chart').should('be.visible');
        cy.contains('🍩 Doughnut Chart').should('be.visible');
    });

    it('wechselt zu Charts und zeigt Diagrammtyp Auswahl', () => {
        cy.contains('🥧 Pie Chart').click();

        cy.get('.chart-intro').should('not.exist');
        cy.get('.material-select-box').should('be.visible');
        cy.get('select').should('have.value', 'pie');

        cy.get('select').select('bar').should('have.value', 'bar');

        cy.get('.chart-row').should('be.visible');
        cy.get('.chart-section').should('have.length', 2);
        cy.get('.stat-summary').should('be.visible');

        cy.contains('📚 Gesamtanzahl').should('be.visible');
        cy.contains('⭐ Beliebtester Typ').should('be.visible');
        cy.contains('📈 Durchschnittlicher Preis').should('be.visible');
    });
});
