package com.alibou.book.book;


import com.alibou.book.file.FileUtils;
import com.alibou.book.history.BookTransactionHistory;
import org.springframework.stereotype.Service;

@Service
public class BookMapper {
    public Book toBook(BookRequest request) {

        return Book.builder()
                .id(request.id())
                .title(request.title())
                .isbn(request.isbn())
                .authorName(request.authorName())
                .archived(false)
                .shareable(request.shareable())
                .synopsis(request.synopsis())
                .build();
    }

    public BookResponse toBookResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .isbn(book.getIsbn())
                .authorName(book.getAuthorName())
                .synopsis(book.getSynopsis())
                //.owner(book.getOwner().fullName())
                .shareable(book.isShareable())
                .archived(book.isArchived())
                .rate(book.getRate())
                .cover(FileUtils.readFileFromLocation(book.getBookCover()))
                .build();
    }

    public BorrowedBookResponse toBorrowedBookResponse(BookTransactionHistory history) {

        return BorrowedBookResponse.builder()
                .id(history.getBook().getId())
                .title(history.getBook().getTitle())
                .isbn(history.getBook().getIsbn())
                .authorName(history.getBook().getAuthorName())
                .rate(history.getBook().getRate())
                .returned(history.isReturned())
                .returnApproved(history.isReturnApproved())
                .build();
    }
}
