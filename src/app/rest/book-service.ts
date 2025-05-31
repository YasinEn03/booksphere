import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

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

/**
 * HTTP-Request services for REST.
 */
export class BookService {
    private baseUrl = 'https://localhost:3000/rest';
    book: Book[] = [];

    constructor(private http: HttpClient) {}

    /**
     * Returns all books in the database.
     * @returns Book[]
     */
    getAllBooks(): Observable<Book[]> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}?size=15`)
            .pipe(map((response) => response.content));
    }

    /**
     * Returns the book searched for by id.
     * @param id
     * @returns Book
     */
    getBookById(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.baseUrl}/${id}`);
    }

    /**
     * POST-Request for creating a new book.
     * @param book
     * @returns
     */
    createBook(book: Book): Observable<Book> {
        return this.getBookByIsbn(book.isbn).pipe(
            switchMap((existingBook) => {
                if (existingBook) {
                    return throwError(
                        () =>
                            new Error(
                                'Die eingegebene ISBN existiert bereits.',
                            ),
                    );
                }
                return this.http.post<Book>(this.baseUrl, book);
            }),
            catchError((err) => {
                if (err.status === 404) {
                    return this.http.post<Book>(this.baseUrl, book);
                }
                return throwError(() => err);
            }),
        );
    }

    /**
     * PUT-Request for updating an already existing book.
     * @param id
     * @param book
     */
    updateBook(id: number, book: Book): Observable<Book> {
        const headers = new HttpHeaders({
            'If-Match': `"${book.version}"`,
        });
        return this.http.put<Book>(`${this.baseUrl}/${id}`, book, { headers });
    }

    /**
     * Deletes a selected book.
     * @see ListComponent
     * @param id
     * @returns
     */
    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    /**
     * Request to get all books saved in the database.
     * @see ListComponent
     * @returns All book ids.
     */
    getAllBookIds(): Observable<number[]> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}?size=1000`)
            .pipe(map((response) => response.content.map((book) => book.id!)));
    }

    /**
     * Returns the amount of books in the database
     * @see HomeComponent
     * @returns
     */
    getBookCount(): Observable<number> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}?size=1000`)
            .pipe(map((response) => response.content.length));
    }

    getBookByIsbn(isbn: string): Observable<Book | undefined> {
        return this.http
            .get<{ content: Book[] }>(`${this.baseUrl}/?isbn=${isbn}`)
            .pipe(
                map((response) => response.content[0]), // nimm das erste Buch
                catchError((err) => {
                    if (err.status === 404) {
                        return of(undefined);
                    }
                    return throwError(() => err);
                }),
            );
    }

    /**
     * Search books by "Schlagwoerter" in the homepage.
     * @see HomeComponent
     * @param schlagwort
     * @returns
     */
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

    /**
     * Search books by "Titel" in the homepage.
     * @see HomeComponent
     * @param titel
     * @returns
     */
    getBooksByTitel(titel: string): Observable<Book[]> {
        return this.getAllBooks().pipe(
            map((books) =>
                books.filter((book) =>
                    book.titel?.titel
                        ?.toLowerCase()
                        .includes(titel.toLowerCase()),
                ),
            ),
        );
    }

    /**
     * Gets a random isbn for the search field in the homepage.
     * @see HomeComponent
     * @returns
     */
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
