package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.*;

import java.util.List;

public interface IReviewService {
    //키워드 리스트
    public List<ReviewDTO> list(String productId);

    //긍정, 부정 키워드 추가
    public int updatePositive(String productId, String positiveKeyword);
    public int updateNegative(String productId, String negativeKeyword);

    public int updateKeywords(String productId, String positiveKeyword, String negativeKeyword);

    //리뷰 추가
    public int insert(String productId, Integer userId, String goodReviews, String badReviews, Integer receiptImg, String reviewImg);
}
