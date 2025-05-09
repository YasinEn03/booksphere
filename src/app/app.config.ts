import { ApplicationConfig, Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
    RouterStateSnapshot,
    TitleStrategy,
    provideRouter,
} from '@angular/router';
import { routes } from './app.routes';

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
        { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    ],
};
