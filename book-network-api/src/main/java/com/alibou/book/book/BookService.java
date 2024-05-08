package com.alibou.book.book;

import com.alibou.book.exception.OperationNotPermittedException;
import com.alibou.book.file.FileStorageService;
import com.alibou.book.history.BookTransactionHistory;
import com.alibou.book.history.BookTransactionHistoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookMapper bookMapper;
    private final BookRepository bookRepository;
    private final BookTransactionHistoryRepository transactionHistoryRepository;
    private final BookTransactionHistoryRepository bookTransactionHistoryRepository;
    private final FileStorageService fileStorageService;

    public Integer save(BookRequest request, Authentication connectedUser) {

        Book book = bookMapper.toBook(request);

        return bookRepository.save(book).getId();
    }

    public BookResponse findById(Integer bookId) {

        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(() -> new EntityNotFoundException("No book found with id ::" + bookId));
    }

    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable, connectedUser.getName());


        return getBookResponsePageResponse(books);
    }

    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAll(BookSpecification.withOwner(connectedUser.getName()), pageable);

        return getBookResponsePageResponse(books);
    }

    private PageResponse<BookResponse> getBookResponsePageResponse(Page<Book> books) {
        List<BookResponse> bookResponse = books.getContent().stream()
                .map(bookMapper::toBookResponse)
                .toList();

        return PageResponse.<BookResponse>builder()
                .content(bookResponse)
                .totalPages(books.getTotalPages())
                .first(books.isFirst())
                .last(books.isLast())
                .totalElements(books.getTotalElements())
                .number(books.getNumber())
                .size(books.getSize())
                .build();
    }

    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<BookTransactionHistory> allBorrowedBooks = transactionHistoryRepository.findAllBorrowedBooks(pageable, connectedUser.getName());

        List<BorrowedBookResponse> borrowedBookResponse = allBorrowedBooks.getContent().stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return PageResponse.<BorrowedBookResponse>builder()
                .content(borrowedBookResponse)
                .totalPages(allBorrowedBooks.getTotalPages())
                .first(allBorrowedBooks.isFirst())
                .last(allBorrowedBooks.isLast())
                .totalElements(allBorrowedBooks.getTotalElements())
                .number(allBorrowedBooks.getNumber())
                .size(allBorrowedBooks.getSize())
                .build();
    }

    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<BookTransactionHistory> allReturnedBooks = transactionHistoryRepository.findAllReturnedBooks(pageable, connectedUser.getName());

        List<BorrowedBookResponse> borrowedBookResponse = allReturnedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return PageResponse.<BorrowedBookResponse>builder()
                .content(borrowedBookResponse)
                .totalPages(allReturnedBooks.getTotalPages())
                .first(allReturnedBooks.isFirst())
                .last(allReturnedBooks.isLast())
                .totalElements(allReturnedBooks.getTotalElements())
                .number(allReturnedBooks.getNumber())
                .size(allReturnedBooks.getSize())
                .build();
    }

    public Integer updateShareableStatus(Integer bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        if (!Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not update others books shareable status");
        }

        book.setShareable(!book.isShareable());
        bookRepository.save(book);
        return bookId;
    }

    public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        if (!Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not update others books archived status");
        }

        book.setArchived(!book.isArchived());
        bookRepository.save(book);
        return bookId;
    }

    public Integer borrowBook(Integer bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));


        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book can not borrowed because it is archived or not shareable");
        }

        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not borrow your own book");
        }

        final boolean isAlreadyBorrowed = transactionHistoryRepository.isAllReadyBorrowedByUser(bookId, connectedUser.getName());
        if (isAlreadyBorrowed) {
            throw new OperationNotPermittedException("The requested book is already borrowed");
        }

        BookTransactionHistory bookTransactionHistory = BookTransactionHistory
                .builder()
                .userId(connectedUser.getName())
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();

        return transactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer returnBorrowedBook(Integer bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book can not borrowed because it is archived or not shareable");
        }

        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not borrow or return your own book");
        }

        BookTransactionHistory bookTransactionHistory = transactionHistoryRepository
                .findByBookIdAndUserId(bookId, connectedUser.getName())
                .orElseThrow(() -> new OperationNotPermittedException("You dit not borrow this book"));

        bookTransactionHistory.setReturned(true);

        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book can not borrowed because it is archived or not shareable");
        }

        if (!Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not return a book that you do not own");
        }

        BookTransactionHistory bookTransactionHistory = transactionHistoryRepository
                .findByBookIdAndOwnerId(bookId, connectedUser.getName())
                .orElseThrow(() -> new OperationNotPermittedException("The book is not returned yet. You cannot approve its return"));

        bookTransactionHistory.setReturnApproved(true);

        return transactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public void uploadBookCoverPicture(MultipartFile file, Authentication connectedUser, Integer bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        var bookCover = fileStorageService.saveFile(file, connectedUser.getName());

        book.setBookCover(bookCover);
        bookRepository.save(book);
    }
}
