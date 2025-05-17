import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../security/auth/auth.service';
import { BookService } from '../book-service';
import { Book } from '../book.model';
@Component({
    selector: 'app-update',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
    ],
    templateUrl: '../../pages/update/update.component.html',
    styleUrl: '../../pages/update/update.component.scss',
})
export class UpdateComponent implements OnInit {
    book: Book = {
        isbn: '',
        title: '',
        publishedDate: '',
        discount: 0,
        price: 0,
    };

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private bookService: BookService,
    ) {}
    ngOnInit(): void {
        if (!this.authService.isAdmin()) {
            this.router.navigate(['/access-denied']);
            return;
        }

        this.book.id = Number(this.route.snapshot.paramMap.get('id'));
        this.bookService.getBookById(this.book.id).subscribe((data) => {
            this.book = data;
        });
    }

    updateBook(): void {
        this.bookService.updateBook(this.book.id!, this.book).subscribe(() => {
            this.router.navigate(['/books']);
        });
    }
}
