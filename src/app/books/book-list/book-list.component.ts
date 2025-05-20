import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BookService } from '../book-service';
import { Book } from '../book.model';
@Component({
    selector: 'app-book-list',
    imports: [CommonModule, MatListModule, MatIconModule],
    templateUrl: '../../pages/list/all-books.component.html',
    styleUrls: ['../../pages/list/all-books.component.scss'],
})
export class BookListComponent implements OnInit {
    books: Book[] = [];

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks(): void {
        this.bookService.getAllBooks().subscribe((books) => {
            this.books = books;
        });
    }
}
