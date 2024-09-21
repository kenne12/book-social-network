import {Component, OnInit} from '@angular/core';
import {PageResponseBorrowedBookResponse} from "../../../../services/models/page-response-borrowed-book-response";
import {BorrowedBookResponse} from "../../../../services/models/borrowed-book-response";
import {BookService} from "../../../../services/services/book.service";
import {FeedBackRequest} from "../../../../services/models/feed-back-request";
import {FeedBackService} from "../../../../services/services/feed-back.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-borrowed-book-list',
    templateUrl: './borrowed-book-list.component.html',
    styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit {
    borrowedBooks: PageResponseBorrowedBookResponse = {};
    private _page: number = 0;
    private size: number = 5;
    public selectedBook: BorrowedBookResponse | undefined = undefined;

    feedBackRequest: FeedBackRequest = {bookId: 0, comment: "", note: 0};

    constructor(private bookService: BookService,
                private feedbackService: FeedBackService,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.findAllBorrowedBooks();
    }

    returnBorrowedBook(book: BorrowedBookResponse) {
        this.selectedBook = book;
        this.feedBackRequest.bookId = book.id as number;
    }

    private findAllBorrowedBooks() {
        this.bookService.findAllBorrowedBooks({
            page: this._page,
            size: this.size
        }).subscribe({
            next: (resp) => {
                this.borrowedBooks = resp;
            }
        });
    }

    goToFirstPage() {
        this._page = 0;
        this.findAllBorrowedBooks();
    }

    goToPreviousPage() {
        this._page--;
        this.findAllBorrowedBooks()
    }

    goToNextPage() {
        this._page++;
        this.findAllBorrowedBooks();
    }

    goToLastPage() {
        this._page = this.borrowedBooks.totalPages as number - 1;
        this.findAllBorrowedBooks()
    }

    goToPage(pageNumber: number) {
        this._page = pageNumber;
        this.findAllBorrowedBooks();
    }

    get page(): number {
        return this._page;
    }

    get isLastPage(): boolean {
        return this._page == this.borrowedBooks.totalPages as number - 1;
    }

    returnBook(withFeedback: boolean) {
        this.bookService.returnBorrowedBook({
            "book-id": this.selectedBook?.id as number
        }).subscribe({
            next: () => {
                if (withFeedback) {
                    this.giveFeedback();
                }
                this.toastService.success("Book has been returned and the owner is notified", "Success");
                this.selectedBook = undefined;
                this.findAllBorrowedBooks();
            }
        });
    }

    private giveFeedback() {
        this.feedbackService.saveFeedBack({
            body: this.feedBackRequest
        }).subscribe({
            next: (response) => {
                console.log("success", response);
            }
        });
    }
}
