import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../../services/services/book.service";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {BookResponse} from "../../../../services/models/book-response";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

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

    constructor(private bookService: BookService,
                private toastService: ToastrService,
                private router: Router) {
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
        this.bookService.borrowBook({
            "book-id": book.id as number
        }).subscribe({
            next: (response) => {
                this.toastService.success("Book successfully added to your list", "Done !");
            },
            error: err => {
                this.toastService.error(err.error.error, "Oups")
            }
        });
    }

  displayBookDetails(book: BookResponse) {
    this.router.navigate(['books', 'details', book.id]);
  }
}
