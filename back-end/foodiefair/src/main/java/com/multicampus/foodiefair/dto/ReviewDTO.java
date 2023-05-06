package com.multicampus.foodiefair.dto;

import lombok.Data;

import javax.validation.constraints.Size;
import java.util.Date;

@Data
public class ReviewDTO {
    private long reviewId;       // 리뷰ID
    private int userId;         // 회원ID
    private String productId;       // 상품ID
    private long reviewLikes;    // 좋아요수
    private Date reviewDate;        // 등록일자
    @Size(min = 20)
    private String goodReviews;     // 좋았던 점
    @Size(min = 20)
    private String badReviews;      // 아쉬웠던 점
    private int receiptImg;     // 영수증 사진
    private String reviewImg;       // 음식 사진 사진 주소 알려줌

    private String positiveKeyword;
    private String negativeKeyword;

    private String userName;
    private String userImg;
    private int commentNum;
}
