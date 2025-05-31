import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Book, BookService } from '../../rest/book-service';
import { FilterService } from '../service/filter-service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, MatCardModule],
})
export class ListComponent implements OnInit {
    books: Book[] = [];

    /** Books after filtering by keywords */
    filteredBooks: Book[] = [];

    /** Books shown on the current page */
    paginatedBooks: Book[] = [];
    loading = true;
    error = '';

    /** Number of books per page */
    pageSize = 6;

    /** Current pagination page */
    currentPage = 1;

    /** Total number of pages for pagination */
    totalPages = 0;
    filterLanguages = {
        JAVA: false,
        JAVASCRIPT: false,
        TYPESCRIPT: false,
        PYTHON: false,
    };

    /**
     * @param bookService Service for retrieving books from backend
     * @param filterService Service for handling keyword filtering
     * @param router Angular Router for navigation
     */
    constructor(
        private bookService: BookService,
        private filterService: FilterService,
        private router: Router,
    ) {}

    /**
     * Loads all books and sets up keyword filter subscriptions
     */
    ngOnInit(): void {
        this.bookService.getAllBooks().subscribe({
            next: (books) => {
                this.books = books;
                this.filteredBooks = books;
                this.totalPages = Math.ceil(this.books.length / this.pageSize);
                this.setPage(1);

                this.filterService.selectedKeywords$.subscribe((keywords) => {
                    if (keywords.length === 0) {
                        return;
                    } else {
                        Object.keys(this.filterLanguages).forEach((lang) => {
                            this.filterLanguages[
                                lang as keyof typeof this.filterLanguages
                            ] = keywords.includes(lang);
                        });

                        this.applyFilter();
                    }
                });
            },
            error: () => {
                this.error = 'Fehler beim Laden der Bücher';
                this.loading = false;
            },
        });
    }

    /**
     * Applies the selected keyword filters to the book list
     */
    applyFilter() {
        const selectedKeywords = Object.keys(this.filterLanguages).filter(
            (key) =>
                this.filterLanguages[key as keyof typeof this.filterLanguages],
        );

        if (selectedKeywords.length === 0) {
            this.filteredBooks = this.books;
        } else {
            this.filteredBooks = this.books.filter((book) =>
                selectedKeywords.some((kw) =>
                    book.schlagwoerter.map((s) => s.toUpperCase()).includes(kw),
                ),
            );
        }

        this.totalPages = Math.ceil(this.filteredBooks.length / this.pageSize);
        this.setPage(1);
    }

    /**
     * Resets all filters and shows all books
     */
    resetFilter() {
        this.filterLanguages = {
            JAVA: false,
            JAVASCRIPT: false,
            TYPESCRIPT: false,
            PYTHON: false,
        };
        this.applyFilter();
    }

    /**
     * Updates the paginatedBooks based on the selected page
     * @param page The page number to display
     */
    setPage(page: number) {
        this.currentPage = page;
        const start = (page - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedBooks = this.filteredBooks.slice(start, end);
    }

    /**
     * Navigates to the details view for the selected book
     * @param id ID of the book to view details for
     */
    goToDetails(id: number | undefined) {
        if (id !== undefined) {
            this.router.navigate(['/detail', id]);
        }
    }
}
