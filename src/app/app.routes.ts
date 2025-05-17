import { Routes } from '@angular/router';
import { CreateComponent } from './books/book-create/create.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookSearchComponent } from './books/book-search/book-search.component';
import { UpdateComponent } from './books/book-update/update.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AccessDeniedComponent } from './pages/redirect/access-denied/access-denied/access-denied.component';
import { PageNotFoundComponent } from './pages/redirect/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'search', component: BookSearchComponent },
    { path: 'books', component: BookListComponent },
    { path: 'update', component: UpdateComponent },
    { path: 'create', component: CreateComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '**', component: PageNotFoundComponent },
];
