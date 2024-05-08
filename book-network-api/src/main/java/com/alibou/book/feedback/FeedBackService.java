package com.alibou.book.feedback;

import com.alibou.book.book.Book;
import com.alibou.book.book.BookRepository;
import com.alibou.book.book.PageResponse;
import com.alibou.book.exception.OperationNotPermittedException;
import com.alibou.book.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedBackService {

    private final BookRepository bookRepository;
    private final FeedBackMapper feedBackMapper;
    private final FeedBackRepository feedBackRepository;

    public Integer save(FeedBackRequest request, Authentication connectedUser) {

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + request.bookId()));

        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("You can not give a feedback for an archived or not shareable book");
        }

        //User user = (User) connectedUser.getPrincipal();

        /*if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You can not give a feedback to your own book");
        }*/

        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not give a feedback to your own book");
        }

        FeedBack feedBack = feedBackMapper.toFeedBack(request);
        return feedBackRepository.save(feedBack).getId();
    }

    public PageResponse<FeedBackResponse> findAllFeedBacksByBook(Integer bookId, int page, int size, Authentication connectedUser) {

        Pageable pageable = PageRequest.of(page, size);
        User user = (User) connectedUser.getPrincipal();

        Page<FeedBack> feedBacks = feedBackRepository.findAllByBookId(bookId, pageable);

        List<FeedBackResponse> feedBackResponses = feedBacks.getContent().stream()
                .map(f -> feedBackMapper.toFeedBackResponse(f, user.getId()))
                .toList();

        return PageResponse.<FeedBackResponse>builder()
                .content(feedBackResponses)
                .number(feedBacks.getNumber())
                .size(feedBacks.getSize())
                .totalElements(feedBacks.getTotalElements())
                .totalPages(feedBacks.getTotalPages())
                .first(feedBacks.isFirst())
                .last(feedBacks.isLast())
                .build();
    }
}
