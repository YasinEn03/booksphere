import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Book } from '../rest/book-service';

@Injectable({
    providedIn: 'root',
})
export class DownloadService {
    /**
     * Generates and downloads a textfile
     * @param book Book-Object
     */
    downloadTxt(book: Book): void {
        const content = this.createBookText(book);
        const blob = new Blob([content], { type: 'text/plain' });
        this.triggerDownload(blob, `${book.titel.titel}.txt`);
    }

    /**
     * Generates and downloades a "PDF" file.
     */
    downloadAsPdf(book: Book): void {
        const doc = new jsPDF();

        const lines = this.createBookText(book).split('\n');
        let y = 10;

        lines.forEach((line) => {
            doc.text(line, 10, y);
            y += 10;
        });

        doc.save(`${book.titel.titel}.pdf`);
    }

    private createBookText(book: Book): string {
        const datum = book.datum
            ? new Date(book.datum).toLocaleDateString('de-DE')
            : '–';
        const erzeugt = book.erzeugt
            ? new Date(book.erzeugt).toLocaleString()
            : '–';
        const aktualisiert = book.aktualisiert
            ? new Date(book.aktualisiert).toLocaleString()
            : '–';

        return `
              Titel: ${book.titel.titel}
              Untertitel: ${book.titel.untertitel || '–'}
              ISBN: ${book.isbn}
              Art: ${book.art}
              Rating: ${book.rating}
              Preis: ${book.preis} €
              Rabatt: ${book.rabatt ? (book.rabatt * 100).toFixed(2) + '%' : 'Kein Rabatt'}
              Lieferbar: ${book.lieferbar ? 'Ja' : 'Nein'}
              Datum: ${datum}
              Homepage: ${book.homepage || '–'}
              Schlagwörter: ${(book.schlagwoerter || []).join(', ') || 'Keine'}
              Erzeugt am: ${erzeugt}
              Letzte Aktualisierung: ${aktualisiert}
              `.trim();
    }

    private triggerDownload(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
