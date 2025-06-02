import { Injectable } from '@angular/core';
import { AuthService } from '../security/auth/auth.service';

export interface UserInfo {
    sub?: string;
    username: string | null;
    email: string | null;
    emailVerified?: boolean;
    preferredUsername: string | null;
    givenName: string | null;
    familyName: string | null;
    locale?: string;
    roles: string[];
    groups?: string[];
    issuedAt?: number;
    expiration?: number;
    issuedAtStr?: string | null;
    expirationStr?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private authService: AuthService) {}

    getUserInfo(): UserInfo | null {
        const token = this.authService.getToken();
        if (!token) {
            return null;
        }

        const payload = this.authService.decodeToken(token);
        if (!payload) {
            return null;
        }

        const roles = this.authService.getRoles();

        return {
            sub: payload['sub'],
            username: payload['preferred_username'] || null,
            email: payload['email'] || null,
            emailVerified: payload['email_verified'] || false,
            preferredUsername: payload['preferred_username'] || null,
            givenName: payload['given_name'] || null,
            familyName: payload['family_name'] || null,
            roles,
            issuedAt: payload['iat'],
            expiration: payload['exp'],
            issuedAtStr: this.convertUnixTimestamp(payload['iat']),
            expirationStr: this.convertUnixTimestamp(payload['exp']),
        };
    }

    private convertUnixTimestamp(timestamp?: number): string | null {
        if (!timestamp) return null;
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('de-DE');
    }
}
