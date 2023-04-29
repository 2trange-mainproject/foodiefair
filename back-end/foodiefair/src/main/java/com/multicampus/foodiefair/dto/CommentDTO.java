package com.multicampus.foodiefair.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Getter
@Setter
public class CommentDTO {
    private int commentId;
    @NotNull
    private int userId;
    @NotNull
    private int reviewId;
    @NotNull
    private String commentContent;
    private LocalDate commentDate;
}
