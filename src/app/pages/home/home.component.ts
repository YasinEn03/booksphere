import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../rest/book-service';
import { MaterialModule } from '../index';
import { FilterService } from '../service/filter-service';

@Component({
    selector: 'app-home',
    imports: [RouterLink, FormsModule, MaterialModule, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    bookCount = 0;
    searchInput = '';

    constructor(
        private bookService: BookService,
        private filterService: FilterService,
        private router: Router,
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
        this.filterService.setKeywords([keyword.toUpperCase()]);
        this.router.navigate(['/list']);
    }

    onSearchClick() {
        const input = this.searchInput.trim();
        if (!input) {
            alert('Bitte etwas eingeben!');
            return;
        }

        const isbnRegex = /^[\d-]{13,}$/;
        const idRegex = /^\d+$/;

        if (idRegex.test(input)) {
            this.router.navigate(['/search'], { queryParams: { id: input } });
        } else if (isbnRegex.test(input)) {
            this.router.navigate(['/search'], { queryParams: { isbn: input } });
        } else {
            this.router.navigate(['/search'], {
                queryParams: { schlagwort: input },
            });
        }
    }
}
