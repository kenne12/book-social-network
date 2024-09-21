package com.alibou.book.book;

import com.alibou.book.common.BaseEntity;
import com.alibou.book.feedback.FeedBack;
import com.alibou.book.history.BookTransactionHistory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@EntityListeners(AuditingEntityListener.class)
public class Book extends BaseEntity {

    private String title;

    @Column(name ="author_name")
    private String authorName;
    private String isbn;
    private String synopsis;

    @Column(name = "book_cover")
    private String bookCover;

    private boolean archived;
    private boolean shareable;

    // @ManyToOne
    // @JoinColumn(name = "user_id", referencedColumnName = "id")
    // private User owner;

    @OneToMany(mappedBy = "book")
    private List<FeedBack> feedBacks;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory> histories;

    @Transient
    public double getRate() {
        if (feedBacks == null || feedBacks.isEmpty()) {
            return 0.0;
        }

        var rate = this.feedBacks.stream()
                .mapToDouble(FeedBack::getNote)
                .average()
                .orElse(0.0);

        return Math.round(rate * 10.0) / 10.0;
    }
}
