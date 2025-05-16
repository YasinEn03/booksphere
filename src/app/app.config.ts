import { ApplicationConfig, Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
    RouterStateSnapshot,
    TitleStrategy,
    provideRouter,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

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
        provideHttpClient(
            withInterceptors([
                (req, next) => {
                    const token = localStorage.getItem('auth_token');
                    const authReq = token
                        ? req.clone({
                              setHeaders: { Authorization: `Bearer ${token}` },
                          })
                        : req;
                    return next(authReq);
                },
            ]),
        ),
        { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    ],
};
