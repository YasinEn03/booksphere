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
    filteredBooks: Book[] = [];
    paginatedBooks: Book[] = [];
    loading = true;
    error = '';
    pageSize = 6;
    currentPage = 1;
    totalPages = 0;
    filterLanguages = {
        JAVA: false,
        JAVASCRIPT: false,
        TYPESCRIPT: false,
        PYTHON: false,
    };

    constructor(
        private bookService: BookService,
        private filterService: FilterService,
        private router: Router,
    ) {}

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

    resetFilter() {
        this.filterLanguages = {
            JAVA: false,
            JAVASCRIPT: false,
            TYPESCRIPT: false,
            PYTHON: false,
        };
        this.applyFilter();
    }

    setPage(page: number) {
        this.currentPage = page;
        const start = (page - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedBooks = this.filteredBooks.slice(start, end);
    }

    goToDetails(id: number | undefined) {
        if (id !== undefined) {
            this.router.navigate(['/detail', id]);
        }
    }
}
