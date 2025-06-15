import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../security/auth/auth.service';
import {
    Notification,
    NotificationService,
} from '../service/notification-service';

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
export class AppComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    username: string | null = null;
    title = 'booksphere';
    notifications: Notification[] = [];
    private authSub: Subscription | undefined;
    private notificationSub: Subscription | undefined;

    constructor(
        public router: Router,
        public authService: AuthService,
        private notificationService: NotificationService,
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

        // Abonniere den NotificationService, um Benachrichtigungen zu erhalten
        this.notificationSub =
            this.notificationService.notifications$.subscribe(
                (notifications) => {
                    this.notifications = notifications;
                },
            );
    }

    goToLink(notification: Notification): void {
        const index = this.notifications.indexOf(notification);
        if (notification.link) {
            window.open(notification.link, '_blank');
        }
        this.notificationService.markAsRead(index);

        // if (notification.link) {
        //     this.router.navigateByUrl(notification.link);
        // }
    }

    deleteNotification(notification: Notification) {
        const index = this.notifications.indexOf(notification);
        this.notificationService.deleteNotification(index);
    }

    ngOnDestroy(): void {
        if (this.authSub) this.authSub.unsubscribe();
        if (this.notificationSub) this.notificationSub.unsubscribe();
    }

    logout(): void {
        this.authService.logout();
    }
}
