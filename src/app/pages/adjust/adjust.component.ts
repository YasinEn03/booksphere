import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core'; // für native Datepicker-Funktionalität
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Book, BookService } from '../../rest/book-service';

@Component({
    selector: 'app-adjust',
    templateUrl: './adjust.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
    ],
    styleUrls: ['./adjust.component.scss'],
})
export class AdjustComponent implements OnInit {
    form!: FormGroup;
    bookId!: number;
    book!: Book;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    buchIds: number[] = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private bookService: BookService,
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            isbn: [''],
            version: 0,
            rating: [0],
            art: ['EPUB'],
            preis: [0],
            rabatt: [0],
            lieferbar: [false],
            datum: [''],
            homepage: [''],
            schlagwoerter: [''],
            titel: this.fb.group({
                titel: [''],
                untertitel: [''],
            }),
        });

        this.bookService.getAllBookIds().subscribe({
            next: (ids) => {
                this.buchIds = ids;
            },
            error: (err) => {
                console.error('Fehler beim Laden der Buch-IDs:', err);
            },
        });
    }

    buchLaden(id: number): void {
        this.bookService.getBookById(id).subscribe({
            next: (book) => {
                this.bookId = id;
                this.book = book;
                this.initForm(book);
                this.successMessage = null;
                this.errorMessage = null;
            },
            error: (err) => {
                this.errorMessage = 'Buch konnte nicht geladen werden.';
                this.successMessage = null;
                console.error(err);
            },
        });
    }

    initForm(book: Book): void {
        this.form = this.fb.group({
            isbn: [book.isbn, [Validators.required]],
            version: [book.version],
            rating: [book.rating ?? 0, [Validators.min(0), Validators.max(5)]],
            art: [book.art],
            preis: [book.preis],
            rabatt: [book.rabatt],
            lieferbar: [book.lieferbar],
            datum: [book.datum],
            homepage: [book.homepage],
            schlagwoerter: [book.schlagwoerter.join(', ')],
        });
    }

    getVersion(): number {
        return this.book?.version ?? 0;
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const formValue = this.form.value;

        const updatedBook: Book = {
            ...this.book,
            ...formValue,
            schlagwoerter: formValue.schlagwoerter
                ? formValue.schlagwoerter
                      .split(',')
                      .map((s: string) => s.trim())
                : [],
        };

        this.bookService.updateBook(this.bookId, updatedBook).subscribe({
            next: () => {
                this.successMessage = `✅ Buch ${this.bookId} wurde erfolgreich aktualisiert.`;
                this.errorMessage = null;

                setTimeout(() => {
                    this.router.navigate(['/detail', this.bookId]);
                }, 1500);
            },
            error: (err) => {
                this.errorMessage = 'Fehler beim Aktualisieren des Buchs.';
                this.successMessage = null;
                console.error(err);
            },
        });
    }
}
