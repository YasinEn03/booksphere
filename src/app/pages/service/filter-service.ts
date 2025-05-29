import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    private selectedKeywordsSubject = new BehaviorSubject<string[]>([]);
    selectedKeywords$ = this.selectedKeywordsSubject.asObservable();

    setKeywords(keywords: string[]) {
        this.selectedKeywordsSubject.next(keywords);
    }
}
