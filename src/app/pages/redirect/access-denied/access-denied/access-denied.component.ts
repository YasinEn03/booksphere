import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-access-denied',
    imports: [],
    templateUrl: './access-denied.component.html',
    styleUrl: './access-denied.component.scss',
})
export class AccessDeniedComponent {
    constructor(private router: Router) {}

    goHome(): void {
        this.router.navigate(['/']);
    }
}
