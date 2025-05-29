import { Routes } from '@angular/router';
<<<<<<< HEAD
import { AdjustComponent } from './pages/adjust/adjust.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
=======
import { CreateComponent } from './books/book-create/create.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookSearchComponent } from './books/book-search/book-search.component';
import { UpdateComponent } from './books/book-update/update.component';
>>>>>>> main
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { LoginComponent } from './pages/login/login.component';
<<<<<<< HEAD
import { PageNotFoundComponent } from './pages/redirect/page-not-found/page-not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { AdminGuard } from './security/auth/admin.guard';
import { AccessDeniedComponent } from './pages/redirect/access-denied/access-denied/access-denied.component';
=======
import { AccessDeniedComponent } from './pages/redirect/access-denied/access-denied/access-denied.component';
import { PageNotFoundComponent } from './pages/redirect/page-not-found/page-not-found.component';
>>>>>>> main

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
<<<<<<< HEAD
    { path: 'search', component: SearchComponent },
    { path: 'adjust', component: AdjustComponent, canActivate: [AdminGuard] },
    { path: 'create', component: CreateComponent, canActivate: [AdminGuard] },
    { path: 'detail/:id', component: DetailComponent },
    { path: 'list', component: ListComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
=======
    { path: 'search', component: BookSearchComponent },
    { path: 'books', component: BookListComponent },
    { path: 'update', component: UpdateComponent },
    { path: 'create', component: CreateComponent },
>>>>>>> main
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '**', component: PageNotFoundComponent },
];
