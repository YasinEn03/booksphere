import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    RouterStateSnapshot,
    TitleStrategy,
    provideRouter,
} from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './security/auth/auth.interceptor';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);
    override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title !== undefined) {
            this.title.setTitle(`My Application | ${title}`);
        }
    }
}
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    ],
};
