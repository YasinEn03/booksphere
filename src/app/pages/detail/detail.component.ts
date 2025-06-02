import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs';
import { Book, BookService } from '../../rest/book-service';
import { AuthService } from '../../security/auth/auth.service';
import { BookTransferService } from '../../service/book.transfer-service';
import { FilterService } from '../../service/filter-service';

@Component({
    selector: 'app-detail',
    imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressSpinner],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    book?: Book;
    isLoading = true;
    error?: string;
    success?: string;
    isAdmin = false;

    /**
     * @param route Activated route to read parameters
     * @param bookService Service for loading and modifying books
     * @param filterService Service for setting filter keywords
     * @param router Angular router for navigation
     * @param bookTransferService Service for sharing book data across routes
     * @param authService Service to check user roles
     */
    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private filterService: FilterService,
        private router: Router,
        private bookTransferService: BookTransferService,
        private authService: AuthService,
    ) {}

    /**
     * Initializes the component, loads the book by ID,
     * and checks if the user is an admin.
     */
    ngOnInit(): void {
        this.isAdmin = this.authService.hasRole('admin');
        const idParam = this.route.snapshot.paramMap.get('id');
        const id = idParam ? +idParam : null;

        if (id === null || isNaN(id)) {
            this.error = 'Ungültige Buch-ID.';
            this.isLoading = false;
            return;
        }

        this.bookService.getBookById(id).subscribe({
            next: (data) => {
                this.book = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Fehler beim Laden des Buches.';
                console.error(err);
                this.isLoading = false;
            },
        });
    }

    /**
     * Handles keyword chip click and filters book list by keyword.
     * @param keyword The clicked keyword
     */
    onKeywordClick(keyword: string) {
        this.filterService.setKeywords([keyword.toUpperCase()]);
        this.router.navigate(['/list']);
    }

    /**
     * Deletes the currently viewed book.
     */
    onDeleteClick() {
        this.bookService.deleteBook(this.book!.id!).subscribe({
            next: () => {
                timeout(2000);
                this.router.navigate(['/list']);
            },
            error: (err) => {
                this.error = 'Fehler beim Löschen des Buches.';
                console.error(err);
            },
        });
    }

    /**
     * Transfers the current book for editing and navigates to the update page.
     */
    onUpdateClick() {
        if (!this.book) {
            this.error = 'Buchdaten sind nicht verfügbar.';
            return;
        }
        this.bookTransferService.setBook(this.book);
        this.router.navigate(['/adjust'], { state: { bookId: this.book.id } });
    }
}
