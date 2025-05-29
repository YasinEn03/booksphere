import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Titel {
    titel: string;
    untertitel?: string;
}

export interface Abbildung {
    beschriftung?: string;
    contentType?: string;
    content?: string;
}

export interface Book {
    id?: number;
    version: number;
    isbn: string;
    rating: number;
    art?: 'EPUB' | 'HARDCOVER' | 'PAPERBACK';
    preis?: number;
    rabatt?: number;
    lieferbar?: boolean;
    datum?: string | Date;
    homepage?: string;
    schlagwoerter: string[];
    titel: Titel;
    abbildungen?: Abbildung[];
    erzeugt?: string;
    aktualisiert?: string;
}

@Injectable({
    providedIn: 'root',
})
export class BookService {
    private baseUrl = 'https://localhost:3000/rest';
    constructor(private http: HttpClient) {}

    book: Book[] = [];
    getAllBooks(): Observable<Book[]> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}?size=15`)
            .pipe(map((response) => response.content));
    }

    getBookById(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.baseUrl}/${id}`);
    }

    createBook(book: Book): Observable<Book> {
        return new Observable<Book>((observer) => {
            this.getBookByIsbn(book.isbn).subscribe({
                next: (existingBook) => {
                    if (existingBook) {
                        observer.error(
                            new Error(
                                'Die eingegebene ISBN existiert bereits.',
                            ),
                        );
                    } else {
                        this.http.post<Book>(this.baseUrl, book).subscribe({
                            next: (createdBook) => observer.next(createdBook),
                            error: (err) => observer.error(err),
                            complete: () => observer.complete(),
                        });
                    }
                },
                error: (err) => {
                    observer.error(err);
                },
            });
        });
    }

    updateBook(id: number, book: Book): Observable<Book> {
        const headers = new HttpHeaders({
            'If-Match': `"${book.version}"`,
        });
        return this.http.put<Book>(`${this.baseUrl}/${id}`, book, { headers });
    }

    getAllBookIds(): Observable<number[]> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}?size=1000`)
            .pipe(map((response) => response.content.map((book) => book.id!)));
    }

    getBookCount(): Observable<number> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}`)
            .pipe(map((response) => response.content.length));
    }

    getBookByIsbn(isbn: string): Observable<Book | undefined> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}/?isbn=${isbn}`)
            .pipe(map((res) => res.content[0]));
    }
    getBooksBySchlagwoerter(schlagwort: string): Observable<Book[]> {
        return this.getAllBooks().pipe(
            map((books) =>
                books.filter((book) =>
                    book.schlagwoerter.some((w) =>
                        w.toLowerCase().includes(schlagwort.toLowerCase()),
                    ),
                ),
            ),
        );
    }

    getRandomIsbn(): Observable<string | undefined> {
        return this.getAllBooks().pipe(
            map((books) => {
                if (books.length === 0) return undefined;
                const randomIndex = Math.floor(Math.random() * books.length);
                return books[randomIndex].isbn;
            }),
        );
    }
}
