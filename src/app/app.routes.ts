import { Routes } from '@angular/router';
import { AdjustComponent } from './pages/adjust/adjust.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { LoginComponent } from './pages/login/login.component';
import { AccessDeniedComponent } from './pages/redirect/access-denied/access-denied/access-denied.component';
import { PageNotFoundComponent } from './pages/redirect/page-not-found/page-not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { AdminGuard } from './security/auth/admin.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'search', component: SearchComponent },
    { path: 'adjust', component: AdjustComponent, canActivate: [AdminGuard] },
    { path: 'create', component: CreateComponent, canActivate: [AdminGuard] },
    { path: 'detail/:id', component: DetailComponent },
    { path: 'list', component: ListComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];
