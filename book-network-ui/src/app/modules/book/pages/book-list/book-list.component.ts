import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../../services/services/book.service";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {BookResponse} from "../../../../services/models/book-response";

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {

    bookResponse: PageResponseBookResponse = {};

    private _page: number = 0;
    private size: number = 5;
    public message: string = "";
    public level: string = "success";

    constructor(private bookService: BookService) {
    }

    ngOnInit(): void {
        this.findAllBooks();
    }


    private findAllBooks(): void {
        this.bookService.findAllBooks({page: this._page, size: this.size})
            .subscribe({
                next: (books) => {
                    this.bookResponse = books;
                }
            });
    }

    goToFirstPage() {
        this._page = 0;
        this.findAllBooks();
    }

    goToPreviousPage() {
        this._page--;
        this.findAllBooks()
    }

    goToNextPage() {
        this._page++;
        this.findAllBooks();
    }

    goToLastPage() {
        this._page = this.bookResponse.totalPages as number - 1;
        this.findAllBooks()
    }

    goToPage(pageNumber: number) {
        this._page = pageNumber;
        this.findAllBooks();
    }

    get page(): number {
        return this._page;
    }

    get isLastPage(): boolean {
        return this._page == this.bookResponse.totalPages as number - 1;
    }

    borrowBook(book: BookResponse): void {
        this.message = "";
        this.bookService.borrowBook({
            "book-id": book.id as number
        }).subscribe({
            next: (response) => {
                this.level = "success";
                this.message = "Book successfully added to your list";
            },
            error: err => {
                this.level = "error";
                this.message = err.error.error;
            }
        });
    }
}
