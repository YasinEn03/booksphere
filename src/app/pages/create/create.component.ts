import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

    createBook() {
        this.successMessage = '';
        this.errorMessage = '';

        this.bookService.createBook(this.book).subscribe({
            next: () => {
                this.successMessage = 'Buch erfolgreich erstellt!';
                this.resetForm();
            },
            error: (err) => {
                this.errorMessage = 'Fehler beim Erstellen des Buchs.';
                console.error(err);
            },
        });
    }

    resetForm() {
        this.book = {
            isbn: '',
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
