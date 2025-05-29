import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BookService } from '../book-service';
import { Book } from '../book.model';

@Component({
    selector: 'app-create',
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
    ],
    templateUrl: '../../pages/create/create.component.html',
    styleUrl: '../../pages/create/create.component.scss',
})
export class CreateComponent {
    book: Book = {
        id: undefined,
        isbn: '',
        title: '',
        publishedDate: '',
        discount: 0,
        price: 0,
    };

    constructor(
        private router: Router,
        private bookService: BookService,
    ) {}

    createBook(): void {
        if (!this.book.isbn || !this.book.title || !this.book.publishedDate) {
            alert('Please fill in all required fields.');
            return;
        }
        this.generateUniqueIdAndCreate();
    }

    private generateUniqueIdAndCreate(): void {
        const tryGenerate = () => {
            const id = Math.floor(Math.random() * 999999) + 1;
            this.bookService.getBookById(id).subscribe({
                next: () => {
                    tryGenerate();
                },
                error: () => {
                    this.book.id = id;
                    this.bookService.addBook(this.book).subscribe(() => {
                        this.router.navigate(['/books']);
                    });
                },
            });
        };

        tryGenerate();
    }
}
