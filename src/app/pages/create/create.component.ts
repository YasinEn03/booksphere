import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
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
export class CreateComponent implements OnInit {
    private bookService = inject(BookService);

    /** Predefined ISBNs used to initialize new books randomly */
    readonly predefinedIsbns: string[] = [
        '978-0-306-40615-7',
        '978-1-56619-909-4',
        '978-0-262-13472-9',
        '978-3-16-148410-0',
        '978-0-7432-7356-5',
        '978-1-4028-9462-6',
        '978-0-201-03801-9',
        '978-0-13-110362-7',
    ];

    /**
     * @param router Angular router for navigation after creating a book
     */
    constructor(private router: Router) {}

    /** The book object bound to the form */
    book: Book = {
        id: 0,
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
        datum: new Date(),
        lieferbar: false,
        art: 'EPUB',
        schlagwoerter: [],
    };

    /** Error message shown if book creation fails */
    errorMessage: string | null = null;

    /** Success message shown after successful creation */
    successMessage: string | null = null;

    /**
     * Initializes the form with random and default book values.
     */
    ngOnInit() {
        const randomIndex = Math.floor(
            Math.random() * this.predefinedIsbns.length,
        );
        this.book.isbn = this.predefinedIsbns[randomIndex];
        this.book.titel.titel = 'Neues Buch';
        this.book.titel.untertitel = 'Ein spannendes Abenteuer';
        this.book.preis = 19.99;
        this.book.rabatt = 0.58;
        this.book.rating = 5;
        this.book.homepage = 'https://example.com';
        this.book.art = 'PAPERBACK';
        this.book.lieferbar = true;
        this.book.schlagwoerter = ['JAVA, JAVASCRIPT'];
    }

    /**
     * Sends a POST request to create a new book.
     * @param form The form to validate before submission
     */
    createBook(form: NgForm): void {
        if (form.invalid) {
            return;
        }

        if (this.book.datum === 'null') {
            this.book.datum = Date.now().toString();
        }

        this.errorMessage = null;
        this.successMessage = null;

        this.bookService.createBook(this.book).subscribe({
            next: () => {
                this.successMessage = 'Buch erfolgreich erstellt';
                this.resetForm();
                this.router.navigate(['/list']);
            },
            error: (err) => {
                this.errorMessage =
                    err.message || 'Fehler beim Erstellen des Buchs.';
                console.error(err);
            },
        });
    }

    /**
     * Resets the book form to its initial values.
     */
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
