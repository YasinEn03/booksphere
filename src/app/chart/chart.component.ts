import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Book, BookService } from '../rest/book-service';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    standalone: true,
    imports: [
        NgChartsModule,
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
    ],
})
export class ChartComponent {
    chartType: ChartType = 'pie';
    showChart = false;

    chartArtData!: ChartData<'pie' | 'bar' | 'doughnut', number[], string>;
    chartSchlagwortData!: ChartData<
        'pie' | 'bar' | 'doughnut',
        number[],
        string
    >;
    chartOptions: ChartOptions = { responsive: true };

    totalBooks = 0;
    mostArtCommonType = '';
    mostSchlagwortCommonType = '';
    avgPrice = 0;

    constructor(private bookService: BookService) {}

    selectChartType(type: ChartType): void {
        this.chartType = type;
        this.showChart = true;
        this.loadChartData();
    }

    onChartTypeSelect(): void {
        this.loadChartData();
    }

    loadChartData(): void {
        this.bookService.getAllBooks().subscribe((books) => {
            this.totalBooks = books.length;
            this.avgPrice = this.calculateAveragePrice(books);
            this.mostArtCommonType = this.getMostArtCommonType(books);
            this.mostSchlagwortCommonType =
                this.getMostSchlagwortCommonType(books);

            this.chartSchlagwortData = this.createMultiValueChartData(
                books,
                'schlagwoerter',
                'Bücher nach Schlagwort',
                [
                    '#26A69A',
                    '#EF5350',
                    '#FFCA28',
                    '#7E57C2',
                    '#5C6BC0',
                    '#FF7043',
                ],
            );

            this.chartArtData = this.createChartData(
                books,
                'art',
                ['EPUB', 'HARDCOVER', 'PAPERBACK'],
                ['#26A69A', '#EF5350', '#FFCA28'],
                'Bücher nach Art',
            );
        });
    }

    private createChartData<T extends string>(
        books: Book[],
        property: keyof Book,
        labels: T[],
        colors: string[],
        labelText: string,
    ): ChartData<'pie' | 'bar' | 'doughnut', number[], string> {
        const counts: Record<T, number> = labels.reduce(
            (acc, val) => {
                acc[val] = 0;
                return acc;
            },
            {} as Record<T, number>,
        );

        for (const book of books) {
            const value = book[property];
            if (labels.includes(value as T)) {
                counts[value as T]++;
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: labelText,
                    data: labels.map((label) => counts[label]),
                    backgroundColor: colors,
                },
            ],
        };
    }

    private createMultiValueChartData(
        books: Book[],
        property: 'schlagwoerter',
        labelText: string,
        baseColors: string[],
    ): ChartData<'pie' | 'bar' | 'doughnut', number[], string> {
        const counts: Record<string, number> = {};

        for (const book of books) {
            const values = book[property];
            if (Array.isArray(values)) {
                for (const value of values) {
                    counts[value] = (counts[value] || 0) + 1;
                }
            }
        }

        const labels = Object.keys(counts);
        const data = labels.map((label) => counts[label]);
        const colors = labels.map((_, i) => baseColors[i % baseColors.length]);

        return {
            labels,
            datasets: [
                {
                    label: labelText,
                    data,
                    backgroundColor: colors,
                },
            ],
        };
    }

    private calculateAveragePrice(books: Book[]): number {
        const prices = books
            .map((book) =>
                typeof book.preis === 'string'
                    ? parseFloat(book.preis)
                    : book.preis,
            )
            .filter(
                (preis): preis is number =>
                    typeof preis === 'number' && !isNaN(preis),
            );

        const sum = prices.reduce((acc, preis) => acc + preis, 0);
        return prices.length ? +(sum / prices.length).toFixed(2) : 0;
    }

    private getMostArtCommonType(books: Book[]): string {
        const typeCounts = books.reduce<Record<string, number>>((acc, book) => {
            const type = book.art;
            if (type) acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(typeCounts).reduce((a, b) =>
            a[1] > b[1] ? a : b,
        )[0];
    }

    private getMostSchlagwortCommonType(books: Book[]): string {
        const counts: Record<string, number> = {};

        for (const book of books) {
            for (const wort of book.schlagwoerter) {
                counts[wort] = (counts[wort] || 0) + 1;
            }
        }

        const mostCommon = Object.entries(counts).reduce((a, b) =>
            a[1] > b[1] ? a : b,
        );

        return mostCommon[0];
    }
}
