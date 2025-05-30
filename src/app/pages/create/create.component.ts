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

    constructor(private router: Router) {}

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
    errorMessage: string | null = null;
    successMessage: string | null = null;

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
