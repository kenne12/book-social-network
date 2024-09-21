package com.alibou.book.notification;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Notification {
    private NotificationStatus status;
    private String message;
    private String bookTitle;
}
