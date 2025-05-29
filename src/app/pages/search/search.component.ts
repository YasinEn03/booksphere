import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Book, BookService } from '../../rest/book-service';

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
    private bookService = inject(BookService);
    private route = inject(ActivatedRoute);

    bookId?: number;
    isbn = '';
    books: Book[] = [];
    book?: Book;
    error = '';
    disableSearchForm = false;

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const idParam = params['id'];
            const isbnParam = params['isbn'];
            const keywordParam = params['schlagwort'];

            if (idParam || isbnParam || keywordParam) {
                this.disableSearchForm = true;
            }

            if (idParam) {
                this.bookId = +idParam;
                this.searchById();
            } else if (isbnParam) {
                this.isbn = isbnParam;
                this.searchByIsbn();
            } else if (keywordParam) {
                this.searchByKeyword(keywordParam);
            }
        });
    }

    enableSearchForm() {
        this.disableSearchForm = false;
        this.resetResult();
    }

    searchById() {
        this.resetResult();
        if (!this.bookId) {
            this.error = 'Bitte eine Buch-ID eingeben';
            return;
        }

        this.bookService.getBookById(this.bookId).subscribe({
            next: (b) => (this.book = b),
            error: () => (this.error = 'Buch mit dieser ID nicht gefunden'),
        });
    }

    searchByIsbn() {
        this.resetResult();
        if (!this.isbn.trim()) {
            this.error = 'Bitte eine ISBN eingeben';
            return;
        }

        this.bookService.getBookByIsbn(this.isbn).subscribe({
            next: (b) => (this.book = b),
            error: () => (this.error = 'Buch mit dieser ISBN nicht gefunden'),
        });
    }

    searchByKeyword(keyword: string) {
        this.resetResult();

        if (!keyword.trim()) {
            this.error = 'Bitte ein Schlagwort eingeben';
            return;
        }

        this.bookService.getBooksBySchlagwoerter(keyword).subscribe({
            next: (books) => {
                if (books.length === 0) {
                    this.error = 'Keine Bücher mit diesem Schlagwort gefunden';
                } else {
                    this.books = books;
                }
            },
            error: () => (this.error = 'Fehler bei der Schlagwortsuche'),
        });
    }

    private resetResult() {
        this.book = undefined;
        this.books = [];
        this.error = '';
    }
}
