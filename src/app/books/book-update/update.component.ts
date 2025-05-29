import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
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
export class UpdateComponent {
    book: Book = {
        isbn: '',
        title: '',
        publishedDate: '',
        discount: 0,
        price: 0,
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private bookService: BookService,
    ) {}
}
