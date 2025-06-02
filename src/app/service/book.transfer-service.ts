import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../rest/book-service';

@Injectable({ providedIn: 'root' })
export class BookTransferService {
    private bookSource = new BehaviorSubject<Book | null>(null);

    setBook(book: Book) {
        this.bookSource.next(book);
    }

    getBook(): Observable<Book | null> {
        return this.bookSource.asObservable();
    }
}
