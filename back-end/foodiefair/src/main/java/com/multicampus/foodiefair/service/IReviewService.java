package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;

import java.util.List;
import java.util.Map;

public interface IReviewService {
    int reviewInsert(ReviewDTO reviewDTO);
    ProductDTO productInfo(String productId);
    int reviewCount(String productId);
    int reviewDelete();
    int reviewModify();
    List<Map<String, Object>> reviewRead(String productId, int offset, int receiptImg, int sort);
}