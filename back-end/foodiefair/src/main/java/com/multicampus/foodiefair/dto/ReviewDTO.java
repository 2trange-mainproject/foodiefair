package com.multicampus.foodiefair.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ReviewDTO {
    private Integer reviewId;       // 리뷰ID
    private Integer userId;         // 회원ID
    private String productId;       // 상품ID
    private Integer reviewLikes;    // 좋아요수
    private Date reviewDate;        // 등록일자
    private String goodReviews;     // 좋았던 점
    private String badReviews;      // 아쉬웠던 점
    private Integer receiptImg;     // 영수증 사진
    private String reviewImg;       // 음식 사진 사진 주소 알려줌

    private String positiveKeyword;
    private String negativeKeyword;
}
