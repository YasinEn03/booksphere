import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from './pages/index';
import { AuthService } from './security/auth/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MaterialModule, CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    username: string | null = null;
    title = 'booksphere';
    private authSub: Subscription | undefined;

    constructor(
        public router: Router,
        public authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.authSub = this.authService.loggedIn$.subscribe((status) => {
            this.isLoggedIn = status;

            if (!this.authService.isLoggedIn()) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('roles');
                localStorage.removeItem('username');
            }
            this.username = status ? this.authService.getUsername() : null;
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
