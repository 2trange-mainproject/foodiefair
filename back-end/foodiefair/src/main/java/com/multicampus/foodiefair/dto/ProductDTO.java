package com.multicampus.foodiefair.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ProductDTO {
    private String productId;           // 상품ID
    private String productName;         // 상품명
    private String fixedTag;            // 고정태그
    private String productImg;          // 상품 사진
    private Integer productPrice;       // 상품 가격
    private Date releaseDate;           // 날짜
    private Integer productViews;       // 조회수
    private Integer productReviews;     // 리뷰개수
    private Integer productSaved;       // 찜개수
    private Integer productEvent;    // 행사정보
}
