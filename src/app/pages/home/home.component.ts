import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [
        RouterLink,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        CommonModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    bookCount = 0;
    ngOnInit() {
        // TODO: Ersetze das später durch deinen echten HTTP-Call
        // z.B. this.bookService.getBookCount().subscribe(count => this.bookCount = count);

        setTimeout(() => {
            this.bookCount = 6;
        }, 500);
    }
}
