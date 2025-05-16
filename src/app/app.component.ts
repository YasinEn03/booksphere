import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './security/auth/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatCardModule,
        RouterOutlet,
        RouterLink,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    isLoggedIn = false;
    username: string | null = null;
    title = 'booksphere';
    constructor(
        public router: Router,
        public auth: AuthService,
    ) {
        this.auth.loggedIn$.subscribe((loggedIn) => {
            this.isLoggedIn = loggedIn;
            this.username = loggedIn ? this.auth.getUsername() : null;
        });
    }

    logout() {
        this.auth.logout();
    }
}
