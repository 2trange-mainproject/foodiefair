package com.multicampus.foodiefair.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProductDTO { // 필요 없을 거 같음. 일단 만듦
    private String productId;
    private String productName;
    private String fixedTag;
    private String productImg;
    private int productPrice;
    private LocalDate releaseDate;
    private int productViews;
    private int productReviews;
    private int productSaved;
    private int productFestival;
}
