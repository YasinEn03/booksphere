import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../rest/book-service';
import { FilterService } from '../../service/filter-service';
import { SearchTransferService } from '../../service/search.transfer-serivce';

@Component({
    selector: 'app-home',
    imports: [
        RouterLink,
        MatCardModule,
        MatToolbarModule,
        MatDividerModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        CommonModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    bookCount = 0;
    searchInput = '';
    warningMessage = '';

    constructor(
        private bookService: BookService,
        private filterService: FilterService,
        private router: Router,
        private searchTransferService: SearchTransferService,
    ) {}
    ngOnInit() {
        this.bookService
            .getBookCount()
            .subscribe((count) => (this.bookCount = count));
        this.bookService.getRandomIsbn().subscribe((isbn) => {
            if (isbn) {
                this.searchInput = isbn;
            }
        });
    }

    onKeywordClick(keyword: string) {
        this.filterService.setKeywords([keyword]);
        this.router.navigate(['/list']);
    }

    onSearchClick() {
        const input = this.searchInput.trim();

        if (!input) {
            this.warningMessage = 'Bitte etwas eingeben!';
            return;
        }

        this.warningMessage = '';
        this.searchTransferService.setSearchInput(input);
        this.router.navigate(['/search']);
    }
}
