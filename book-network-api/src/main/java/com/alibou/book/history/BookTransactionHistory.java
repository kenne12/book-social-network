package com.alibou.book.history;

import com.alibou.book.book.Book;
import com.alibou.book.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BookTransactionHistory extends BaseEntity {

    private boolean returned;

    @Column(name = "return_approved")
    private boolean returnApproved;

    // @ManyToOne
    // @JoinColumn(name = "user_id")
    // private User user;

    @Column(name = "user_id")
    private String userId;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
}
