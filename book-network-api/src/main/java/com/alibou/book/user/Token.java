package com.alibou.book.user;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Entity
public class Token implements Serializable {

    @Id
    @GeneratedValue
    private Integer id;

    private String token;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

     @ManyToOne
     @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "id")
     private User user;
}
