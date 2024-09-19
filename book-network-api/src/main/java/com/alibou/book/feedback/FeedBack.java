package com.alibou.book.feedback;

import com.alibou.book.book.Book;
import com.alibou.book.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class FeedBack extends BaseEntity {

    private Double note;
    private String comment;

    @ManyToOne
    @JoinColumn(name = "book_id", referencedColumnName = "id")
    private Book book;
}
