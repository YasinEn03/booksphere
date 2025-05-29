import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Book, BookService } from '../../rest/book-service';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    private bookService = inject(BookService);

    book: Book = {
        isbn: '',
        version: 0,
        titel: {
            titel: '',
            untertitel: '',
        },
        preis: 0,
        rabatt: 0,
        rating: 0,
        homepage: '',
        datum: '',
        lieferbar: false,
        art: 'EPUB',
        schlagwoerter: [],
    };

    successMessage = '';
    errorMessage = '';

    createBook(bookForm: NgForm) {
        const book: Book = bookForm.value;
        this.successMessage = '';
        this.errorMessage = '';

        this.bookService.createBook(book).subscribe({
            next: (createdBook) => {
                this.errorMessage = '';
                console.log('Buch erfolgreich erstellt', createdBook);
            },
            error: (err) => {
                this.errorMessage = err.message || 'Unbekannter Fehler';
            },
        });
    }

    resetForm() {
        this.book = {
            isbn: '',
            version: 0,
            rating: 1,
            art: 'PAPERBACK',
            preis: 10,
            rabatt: 0,
            lieferbar: true,
            datum: new Date(),
            homepage: '',
            schlagwoerter: [],
            titel: {
                titel: '',
                untertitel: '',
            },
        };
    }
}
