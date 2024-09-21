import {Component, OnInit} from '@angular/core';
import {BookRequest} from "../../../../services/models/book-request";
import {BookService} from "../../../../services/services/book.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-manager-book',
    templateUrl: './manage-book.component.html',
    styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit {

    errorMessage: string[] = [];
    selectedPicture: string | undefined;
    selectedBookCover: any;
    bookRequest: BookRequest = {authorName: "", isbn: "", synopsis: "", title: ""};

    constructor(private bookService: BookService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        //const bookId = this.activatedRoute.snapshot.params["bookId"];

        this.activatedRoute.queryParamMap.subscribe(params=> {
            const bookId = params.get("bookId");

            if (bookId) {
                this.bookService.findBookById({
                    "book-id": parseInt(bookId)
                }).subscribe({
                    next: (book) => {
                        this.bookRequest = {
                            id: book.id,
                            title: book.title as string,
                            authorName: book.authorName as string,
                            isbn: book.isbn as string,
                            shareable: book.shareable,
                            synopsis: book.synopsis as string
                        }

                        if (book.cover) {
                            this.selectedPicture = "data:image/jpg;base64," + book.cover
                        }
                    }
                })
            }
        });
    }

    onFileSelected(event: any) {
        this.selectedBookCover = event.target.files[0];

        if (this.selectedBookCover) {
            const reader = new FileReader();

            reader.onload = () => {
                this.selectedPicture = reader.result as string;
            };

            reader.readAsDataURL(this.selectedBookCover);
        }
    }

    saveBook() {
        this.bookService.saveBook({
            body: this.bookRequest
        }).subscribe({
            next: (bookId) => {
                if (this.selectedBookCover) {
                    this.bookService.uploadBookCoverPicture({
                        "book-id": bookId,
                        body: {
                            file: this.selectedBookCover
                        }
                    }).subscribe({
                        next: () => {
                            this.toastService.success("Book successfully saved", "Done !")
                            this.router.navigate(["/books/my-books"])
                        }
                    });
                }
            },
            error: err => {
                this.toastService.error("Something went wrong", "Oups")
                this.errorMessage = err.error.validationsErrors;
            }
        });
    }
}
