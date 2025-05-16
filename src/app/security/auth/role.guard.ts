import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const expectedRoles = route.data['roles'] as string[];
    const userRoles = auth.getRoles(); // ✅ userRoles: string[]

    return expectedRoles.some((role) => userRoles.includes(role));
};
