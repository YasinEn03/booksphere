/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book.model';

@Injectable({
    providedIn: 'root',
})
export class BookService {
    private apiUrl = '';

    constructor(private http: HttpClient) {}

    getAllBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    getBookById(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }

    searchBooks(query: string): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiUrl}?search=${query}`);
    }

    addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    updateBook(id: number, book: Book): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
    }

    deleteBook(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
