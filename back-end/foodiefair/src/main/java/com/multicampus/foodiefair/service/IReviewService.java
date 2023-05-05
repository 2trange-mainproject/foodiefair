package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.ReviewDTO;

import java.util.List;
import java.util.Map;

public interface IReviewService {
    int reviewInsert(ReviewDTO reviewDTO);
    int reviewCount(String productId);
    int reviewDelete(int reviewId);
    int reviewModify();
    List<Map<String, Object>> reviewRead(String productId, int offset, int receiptImg, int sort);
}