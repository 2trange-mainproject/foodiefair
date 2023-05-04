package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final IReviewDAO dao;

    @Override
    public List<ReviewDTO> list(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.listDao(paramMap);
    }

    @Override
    public int updatePositive(String productId, String positiveKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("positiveKeyword", positiveKeyword);

        return dao.updatePositiveDao(paramMap);
    }

    @Override
    public int updateNegative(String productId, String negativeKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("negativeKeyword", negativeKeyword);

        return dao.updateNegativeDao(paramMap);
    }

    @Override
    public int insert(String productId, Integer userId, String goodReviews, String badReviews, Integer receiptImg, String reviewImg) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("userId", userId);
        paramMap.put("goodReviews", goodReviews);
        paramMap.put("badReviews", badReviews);
        paramMap.put("receiptImg", receiptImg);
        paramMap.put("reviewImg", reviewImg);

        return dao.insertDao(paramMap);
    }
}
