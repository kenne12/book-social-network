package com.alibou.book.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {

    @Query("""
            SELECT history FROM BookTransactionHistory history
            WHERE history.user.id = :userId
            """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, @Param("userId") Integer userId);

    @Query("SELECT history FROM BookTransactionHistory history WHERE history.book.owner.id = :userId")
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, @Param("userId") Integer userId);

    @Query("SELECT (COUNT (*) > 0) AS isBorrowed FROM BookTransactionHistory bth WHERE bth.user.id = :userId AND bth.book.id = :bookId AND bth.returnApproved = false")
    boolean isAllReadyBorrowedByUser(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    @Query("SELECT bth FROM BookTransactionHistory bth WHERE bth.user.id = :userId AND bth.book.id = :bookId AND bth.returned = false AND bth.returnApproved = false")
    Optional<BookTransactionHistory> findByBookIdAndUserId(@Param("bookId") Integer bookId, @Param("userId") Integer userId);


    @Query("SELECT bth FROM BookTransactionHistory bth WHERE bth.book.owner.id = :userId AND bth.book.id = :bookId AND bth.returned = true AND bth.returnApproved = false")
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(@Param("bookId") Integer bookId, @Param("userId") Integer userId);
}
