import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Book, BookService } from '../../rest/book-service';
import { SearchTransferService } from '../../service/search.transfer-serivce';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        RouterModule,
    ],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    /** Injected BookService for data access */
    private bookService = inject(BookService);

    /** Activated route for access to query parameters */
    private route = inject(ActivatedRoute);

    /**
     * @param searchTransferService Service for transferring search input across components
     */
    constructor(private searchTransferService: SearchTransferService) {}

    /** Search input as book ID */
    bookId?: number;

    /** Search input as ISBN */
    isbn = '';

    /** List of books as search result */
    books: Book[] = [];

    /** Single book result */
    book?: Book;

    /** Error message if search fails */
    error = '';

    /** Indicates if search form should be disabled (e.g. prefilled input search) */
    disableSearchForm = false;

    /**
     * Initializes component and determines search type from transfer service
     */
    ngOnInit() {
        const input = this.searchTransferService.getSearchInput();
        if (!input) return;

        this.disableSearchForm = true;

        const isbnRegex = /^[\d-]{13,}$/;
        const idRegex = /^\d+$/;

        if (idRegex.test(input)) {
            this.bookId = +input;
            this.searchById();
        } else if (isbnRegex.test(input)) {
            this.isbn = input;
            this.searchByIsbn();
        } else {
            this.searchByKeyword(input);
        }

        this.searchTransferService.clear();
    }

    /**
     * Enables the search form and resets previous results
     */
    enableSearchForm() {
        this.disableSearchForm = false;
        this.resetResult();
    }

    /**
     * Searches for a book by its ID
     */
    searchById() {
        this.resetResult();
        if (!this.bookId) {
            this.error = 'Bitte geben Sie eine Buch-ID ein';
            return;
        }

        this.bookService.getBookById(this.bookId).subscribe({
            next: (b) => (this.book = b),
            error: () =>
                (this.error =
                    'Buch mit dieser ID konnte nicht gefunden werden.'),
        });
    }

    /**
     * Searches for a book by its ISBN
     */
    searchByIsbn() {
        this.resetResult();
        if (!this.isbn.trim()) {
            this.error = 'Bitte geben Si eine ISBN ein';
            return;
        }

        this.bookService.getBookByIsbn(this.isbn).subscribe({
            next: (b) => {
                if (!b) {
                    this.error =
                        'Buch mit dieser ISBN konnte nicht gefunden werden.';
                    return;
                } else {
                    this.book = b;
                }
            },
            error: () =>
                (this.error = `Buch mit der ISBN: ${this.isbn} wurde nicht gefunden`),
        });
    }

    /**
     * Searches for books by keyword (e.g. tag or title)
     * @param keyword The keyword to search for
     */
    searchByKeyword(keyword: string) {
        this.resetResult();

        if (!keyword.trim()) {
            this.error = 'Bitte ein Schlagwort eingeben';
            return;
        }

        this.bookService.getBooksBySchlagwoerter(keyword).subscribe({
            next: (books) => {
                if (books.length === 0) {
                    // If no books found by keyword, fallback to title search
                    this.bookService.getBooksByTitel(keyword).subscribe({
                        next: (books: Book[]) => {
                            if (books.length === 0) {
                                this.books = [];
                            } else {
                                this.books = books;
                            }
                        },
                        error: () => (this.error = 'Fehler bei der Titelsuche'),
                    });
                } else {
                    this.books = books;
                }
            },
            error: () => (this.error = 'Fehler bei der Schlagwortsuche'),
        });
    }

    /**
     * Resets current search result state
     */
    private resetResult() {
        this.book = undefined;
        this.books = [];
        this.error = '';
    }
}
