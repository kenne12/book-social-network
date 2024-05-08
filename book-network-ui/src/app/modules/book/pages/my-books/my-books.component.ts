import {Component, OnInit} from '@angular/core';
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {BookService} from "../../../../services/services/book.service";
import {Router} from "@angular/router";
import {BookResponse} from "../../../../services/models/book-response";

@Component({
    selector: 'app-my-books',
    templateUrl: './my-books.component.html',
    styleUrl: './my-books.component.scss'
})

export class MyBooksComponent implements OnInit {

    bookResponse: PageResponseBookResponse = {};

    private _page: number = 0;
    private size: number = 5;

    constructor(private bookService: BookService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.findAllBooks();
    }


    private findAllBooks(): void {
        this.bookService.findAllBookByOwner({page: this._page, size: this.size})
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

    archiveBook(book: BookResponse) {
        this.bookService.updateArchivedStatus({
            "book-id": book.id as number
        }).subscribe({
            next: () => {
                book.archived = !book.archived;
            }
        })
    }

    editBook(book: BookResponse) {
        this.router.navigate(["books", "manage"], {queryParams: {bookId: book.id}});
    }

    shareBook(book: BookResponse) {
        this.bookService.updateShareableStatus({
            "book-id": book.id as number
        }).subscribe({
            next: () => {
                book.shareable = !book.shareable;
            }
        })
    }
}
