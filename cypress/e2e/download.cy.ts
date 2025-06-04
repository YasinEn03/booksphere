/// <reference types="cypress" />

describe('Book Download Tests', () => {
    const bookId = 1;
    const downloadsFolder = 'cypress/downloads';

    beforeEach(() => {
        cy.visit(`/detail/${bookId}`);
    });

    it('should download a TXT file', () => {
        const txtFileName = 'Alpha.txt';

        cy.get('button').contains('TXT herunterladen').click();

        cy.readFile(`${downloadsFolder}/${txtFileName}`, { timeout: 5000 })
            .should('exist')
            .and('include', 'Titel:');
    });

    it('should download a PDF file', () => {
        const pdfFileName = 'Alpha.pdf';

        cy.get('button').contains('PDF herunterladen').click();

        cy.readFile(`${downloadsFolder}/${pdfFileName}`, null, {
            timeout: 5000,
        }).should('exist');
    });
});
