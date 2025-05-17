import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../security/auth/auth.service';
import { BookService } from '../book-service';
import { Book } from '../book.model';

@Component({
    selector: 'app-book-detail',
    imports: [CommonModule, MatCardModule],
    templateUrl: '../../pages/detailed-book/detail.component.html',
    styleUrls: ['../../pages/detailed-book/detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
    book: Book | null = null;
    constructor(
        private bookService: BookService,
        private route: ActivatedRoute,
        public authService: AuthService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.bookService.getBookById(id).subscribe((book) => {
                this.book = book;
            });
        }
    }

    updateBook(updatedBook: Book): void {
        if (!this.authService.isAdmin || !this.book) return;

        this.bookService
            .updateBook(this.book.id as number, updatedBook)
            .subscribe((book) => {
                this.book = book;
            });
    }
}
