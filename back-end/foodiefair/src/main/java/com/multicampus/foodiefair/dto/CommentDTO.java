package com.multicampus.foodiefair.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CommentDTO {
    private long commentId;      // 댓글ID
    private int userId;         // 회원ID
    private long reviewId;       // 리뷰ID
    private String commentContent;  // 댓글내용
    private Date commentDate;       // 작성날짜
}
