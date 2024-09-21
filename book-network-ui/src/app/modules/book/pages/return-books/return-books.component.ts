import {Component, OnInit} from '@angular/core';
import {PageResponseBorrowedBookResponse} from "../../../../services/models/page-response-borrowed-book-response";
import {BorrowedBookResponse} from "../../../../services/models/borrowed-book-response";
import {BookService} from "../../../../services/services/book.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-return-books',
    templateUrl: './return-books.component.html',
    styleUrl: './return-books.component.scss'
})
export class ReturnBooksComponent implements OnInit {

    returnedBooks: PageResponseBorrowedBookResponse = {};
    private _page: number = 0;
    private size: number = 5;
    public selectedBook: BorrowedBookResponse | undefined = undefined;
    public message: string = "";
    public level:  "success" | "error"  = "success";


    constructor(private bookService: BookService,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.findAllReturnedBooks();
    }

    returnBorrowedBook(book: BorrowedBookResponse) {
        this.selectedBook = book;
    }

    private findAllReturnedBooks() {
        this.bookService.findAllReturnedBooks({
            page: this._page,
            size: this.size
        }).subscribe({
            next: (resp) => {
                this.returnedBooks = resp;
            }
        });
    }

    goToFirstPage() {
        this._page = 0;
        this.findAllReturnedBooks();
    }

    goToPreviousPage() {
        this._page--;
        this.findAllReturnedBooks()
    }

    goToNextPage() {
        this._page++;
        this.findAllReturnedBooks();
    }

    goToLastPage() {
        this._page = this.returnedBooks.totalPages as number - 1;
        this.findAllReturnedBooks()
    }

    goToPage(pageNumber: number) {
        this._page = pageNumber;
        this.findAllReturnedBooks();
    }

    get page(): number {
        return this._page;
    }

    get isLastPage(): boolean {
        return this._page == this.returnedBooks.totalPages as number - 1;
    }

    approveBookReturn(book: BorrowedBookResponse) {
        if (!book.returned) {
            this.level = "error";
            this.toastService.error("The book is not yet returned", "Oups")
            return;
        }

        this.bookService.approveReturnBorrowedBook({
            "book-id": book.id as number
        }).subscribe({
            next: () => {
                book.returnApproved = !book.returnApproved;
                this.toastService.success("Book return approved", "Done !");
                this.findAllReturnedBooks()
            }
        })
    }
}
