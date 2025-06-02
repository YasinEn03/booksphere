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
import { BookTransferService } from '../service/book.transfer-service';

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
/**
 * Component for adjusting (editing) book data.
 */
export class AdjustComponent implements OnInit {
    form!: FormGroup;

    //ID of the currently loaded book
    bookId!: number;
    book!: Book;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    buchIds: number[] = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private bookService: BookService,
        private bookTransferService: BookTransferService,
    ) {}

    /**
     * Initializes the form, loads book IDs, and populates the form
     * with a transferred or route-based book.
     */
    ngOnInit(): void {
        this.form = this.fb.group({
            isbn: ['', [Validators.required]],
            version: [0],
            rating: [0, [Validators.min(0), Validators.max(5)]],
            art: ['EPUB'],
            preis: [0],
            rabatt: [0, [Validators.min(0), Validators.max(1)]],
            lieferbar: [false],
            datum: [''],
            homepage: [''],
            schlagwoerter: [''],
            titel: this.fb.group({
                titel: [''],
                untertitel: [''],
            }),
        });

        // Load all available book IDs
        this.bookService.getAllBookIds().subscribe({
            next: (ids) => {
                this.buchIds = ids;
            },
            error: (err) => {
                console.error('Error loading book IDs:', err);
            },
        });

        // Load book from transfer service or route state
        this.bookTransferService.getBook().subscribe((book) => {
            if (book) {
                this.book = book;
                this.bookId = book.id!;
                this.initForm(book);
                this.errorMessage = null;
                this.successMessage = `Book with ID ${this.bookId} loaded successfully.`;
            } else {
                const idFromRoute =
                    this.router.getCurrentNavigation()?.extras.state?.[
                        'bookId'
                    ];
                if (idFromRoute) {
                    this.loadBookById(idFromRoute);
                }
            }
        });
    }

    /**
     * Loads a book by its ID and populates the form with its data.
     * @param id - ID of the book to load
     */
    buchLaden(id: number): void {
        this.bookService.getBookById(id).subscribe({
            next: (book) => {
                this.bookId = id;
                this.book = book;
                this.initForm(book);
                this.successMessage = `Book with ID ${id} loaded successfully.`;
                this.errorMessage = null;
            },
            error: (err) => {
                this.errorMessage = 'Book could not be loaded.';
                this.successMessage = null;
                console.error(err);
            },
        });
    }

    /**
     * Populates the form with book data.
     * @param book - Book object to populate the form with
     */
    initForm(book: Book): void {
        if (!this.form) return;

        this.form.patchValue({
            isbn: book.isbn,
            version: book.version,
            rating: book.rating ?? 0,
            art: book.art,
            preis: book.preis,
            rabatt: book.rabatt,
            lieferbar: book.lieferbar,
            datum: book.datum,
            homepage: book.homepage,
            schlagwoerter: book.schlagwoerter.join(', '),
        });
    }

    /**
     * Returns the current book version or 0 if not available.
     * @returns Book version number
     */
    getVersion(): number {
        return this.book?.version ?? 0;
    }

    /**
     * Submits the form, updates the book via the service,
     * and redirects to the detail page on success.
     */
    onSubmit(): void {
        if (this.form.invalid) return;

        const formValue = this.form.value;

        const updatedBook: Book = {
            ...this.book,
            ...formValue,
            version: this.book.version,
            schlagwoerter: formValue.schlagwoerter
                ? formValue.schlagwoerter
                      .split(',')
                      .map((s: string) => s.trim())
                : [],
        };

        this.bookService.updateBook(this.bookId, updatedBook).subscribe({
            next: () => {
                this.successMessage = `Book ${this.bookId} updated successfully.`;
                this.errorMessage = null;

                setTimeout(() => {
                    this.router.navigate(['/detail', this.bookId]);
                }, 1500);
            },
            error: (err) => {
                this.errorMessage = 'Error updating the book.';
                this.successMessage = null;
                console.error(err);
            },
        });
    }

    /**
     * Loads a book by ID directly (e.g., from route state) and populates the form.
     * @param id - ID of the book to load
     */
    loadBookById(id: number) {
        this.bookService.getBookById(id).subscribe({
            next: (book) => {
                this.book = book;
                this.bookId = id;
                this.initForm(book);
                this.errorMessage = null;
            },
            error: () => {
                this.errorMessage = 'Book could not be loaded.';
                setTimeout(() => this.router.navigate(['/list']), 2000);
            },
        });
    }
}
