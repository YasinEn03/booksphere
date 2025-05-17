import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookService } from '../book-service';
import { Book } from '../book.model';

@Component({
    selector: 'app-book-search',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        FormsModule,
    ],
    templateUrl: '../../pages/search/search.component.html',
    styleUrls: ['../../pages/search/search.component.scss'],
})
export class BookSearchComponent {
    searchQuery = '';
    searchResults: Book[] = [];

    constructor(private bookService: BookService) {}

    search(): void {
        if (this.searchQuery.trim()) {
            this.bookService
                .searchBooks(this.searchQuery)
                .subscribe((results) => {
                    this.searchResults = results;
                });
        }
    }
}
