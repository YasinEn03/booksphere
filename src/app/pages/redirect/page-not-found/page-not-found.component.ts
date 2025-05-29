<<<<<<< HEAD
=======
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    imports: [MatIconModule, CommonModule, RouterModule],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
    constructor(private router: Router) {}
}
=======
>>>>>>> keycloak
import { Component } from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    imports: [],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {}
<<<<<<< HEAD
=======
>>>>>>> main
>>>>>>> keycloak
