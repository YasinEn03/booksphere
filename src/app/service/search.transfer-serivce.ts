import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SearchTransferService {
    private searchInput = '';

    setSearchInput(input: string) {
        this.searchInput = input;
    }

    getSearchInput(): string {
        return this.searchInput;
    }

    clear() {
        this.searchInput = '';
    }
}
