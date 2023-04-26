package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;

public interface IReviewService {
    int reviewInsert(ReviewDTO reviewDTO);
    ProductDTO productInfo(String productId);
    int reviewDelete();
    int reviewModify();
    int reviewRead(); //int 타입 아님 list...
}