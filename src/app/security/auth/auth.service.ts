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

    // Login-Methode: sendet Benutzerdaten an Keycloak und speichert Token + Username
    login(username: string, password: string) {
        const body = new URLSearchParams();
        body.set('client_id', 'nest-client');
        body.set('client_secret', 'azLLhWKWFLxtYHcRcpOsS20uGSwdOCXV');
        body.set('grant_type', 'password');
        body.set('username', username);
        body.set('password', password);

        return this.http
            .post<any>(
                'http://localhost:8880/realms/nest/protocol/openid-connect/token',
                body.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            )
            .pipe(
                tap((response) => {
                    const token = response.access_token;
                    localStorage.setItem(this.tokenKey, token);

                    // Rollen extrahieren
                    const payload = this.decodeToken(token);
                    const clientRoles =
                        payload?.resource_access?.['nest-client']?.roles || [];
                    const allRoles = [...clientRoles];

                    localStorage.setItem(this.usernameKey, username);
                    localStorage.setItem('roles', JSON.stringify(allRoles));

                    this.loggedInSubject.next(true);
                }),
            );
    }

    // Logout: Token + Username entfernen, Zustand zurücksetzen
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.usernameKey);
        localStorage.removeItem('roles');
        this.loggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    // Reaktives Login-State-Refresh bei App-Neustart
    checkLoginStatus() {
        const isLogged = this.isLoggedIn();
        this.loggedInSubject.next(isLogged);
    }

    // Token lesen
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Username lesen
    getUsername(): string | null {
        return localStorage.getItem(this.usernameKey);
    }

    // Ist der Benutzer aktuell eingeloggt? (Token vorhanden + gültig)
    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const payload = this.decodeToken(token);
        const expiry = payload?.exp;
        if (!expiry) return false;

        return Date.now() / 1000 < expiry;
    }

    // Gibt Benutzerrollen aus Token zurück
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

    // Hat der Benutzer eine bestimmte Rolle?
    hasRole(role: string): boolean {
        return this.getRoles().includes(role);
    }

    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    isUser(): boolean {
        return this.hasRole('user');
    }

    // 🔐 Token payload decodieren (JWT)
    private decodeToken(token: string): any | null {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (e) {
            return null;
        }
    }
}
