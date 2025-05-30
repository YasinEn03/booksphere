import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs';
import { Book, BookService } from '../../rest/book-service';
import { AuthService } from '../../security/auth/auth.service';
import { BookTransferService } from '../service/book.transfer-service';
import { FilterService } from '../service/filter-service';

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

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private filterService: FilterService,
        private router: Router,
        private bookTransferService: BookTransferService,
        private authService: AuthService,
    ) {}

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

    onKeywordClick(keyword: string) {
        this.filterService.setKeywords([keyword.toUpperCase()]);
        this.router.navigate(['/list']);
    }

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

    onUpdateClick() {
        if (!this.book) {
            this.error = 'Buchdaten sind nicht verfügbar.';
            return;
        }
        this.bookTransferService.setBook(this.book);
        this.router.navigate(['/adjust'], { state: { bookId: this.book.id } });
    }
}
