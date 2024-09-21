package com.alibou.book.utils;

import com.alibou.book.book.PageResponse;
import org.springframework.data.domain.Page;

import java.util.function.Function;

public class Utils {

    public static  <T, V> PageResponse<V> formatPageResponse(Page<T> page, Function<T, V> mapper) {

        var content = page.getContent().stream().map(mapper).toList();

        return PageResponse.<V>builder()
                .content(content)
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .totalElements(page.getTotalElements())
                .number(page.getNumber())
                .size(page.getSize())
                .build();
    }
}
