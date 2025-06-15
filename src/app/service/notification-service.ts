import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
    message: string;
    link?: string;
    date?: Date;
    read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    notifications$ = this.notificationsSubject.asObservable();

    private notifications: Notification[] = [];

    addNotification(notification: Notification) {
        this.notifications.unshift({ ...notification, date: new Date() });
        this.notificationsSubject.next(this.notifications);
    }

    markAsRead(index: number) {
        this.notifications[index].read = true;
        this.emitSortedNotifications();
    }

    deleteNotification(index: number) {
        this.notifications.splice(index, 1);
        this.emitSortedNotifications();
    }

    clearNotifications() {
        this.notifications = [];
        this.notificationsSubject.next(this.notifications);
    }

    private emitSortedNotifications() {
        const sorted = [...this.notifications].sort((a, b) => {
            if (a.read === b.read) {
                return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
            }
            return a.read ? 1 : -1;
        });
        this.notificationsSubject.next(sorted);
    }
}
