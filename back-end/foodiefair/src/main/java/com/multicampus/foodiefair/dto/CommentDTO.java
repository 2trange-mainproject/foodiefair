package com.multicampus.foodiefair.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CommentDTO {
    private int commentId;
    @NotNull
    private String writerId;
    @NotNull
    private String reviewerId;
    @NotNull
    private String comment;
}
