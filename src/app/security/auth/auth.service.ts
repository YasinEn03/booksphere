/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenKey = 'auth_token';
    private usernameKey = 'username';
    private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

    loggedIn$ = this.loggedInSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    login(username: string, password: string) {
        const body = new URLSearchParams();
        body.set('client_id', 'nest-client');
        body.set('client_secret', 'azLLhWKWFLxtYHcRcpOsS20uGSwdOCXV');
        body.set('grant_type', 'password');
        body.set('username', username);
        body.set('password', password);

        return this.http
            .post<any>('https://localhost:3000/auth/token', body.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .pipe(
                tap((response) => {
                    const token = response.access_token;
                    localStorage.setItem(this.tokenKey, token);

                    const payload = this.decodeToken(token);
                    const clientRoles =
                        payload?.resource_access?.['nest-client']?.roles || [];

                    localStorage.setItem(this.usernameKey, username);
                    localStorage.setItem('roles', JSON.stringify(clientRoles));

                    this.loggedInSubject.next(true);
                }),
            );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.usernameKey);
        localStorage.removeItem('roles');
        this.loggedInSubject.next(false);
        this.router.navigate(['/']);
    }

    checkLoginStatus() {
        const isLogged = this.isLoggedIn();
        this.loggedInSubject.next(isLogged);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUsername(): string | null {
        return localStorage.getItem(this.usernameKey);
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const payload = this.decodeToken(token);
        const expiry = payload?.exp;
        if (!expiry) return false;

        return Date.now() / 1000 < expiry;
    }

    getRoles(): string[] {
        const token = this.getToken();
        if (!token) {
            return [];
        }
        const payload = this.decodeToken(token);

        const realmRoles = payload?.realm_access?.roles || [];
        const clientRoles =
            payload?.resource_access?.['nest-client']?.roles || [];

        return [...realmRoles, ...clientRoles];
    }

    hasRole(role: string): boolean {
        const roles = this.getRoles();
        return roles.includes(role);
    }

    public decodeToken(token: string): any | null {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return null;
        }
    }
}
