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
    public int insert(String productId, int userId, String goodReviews, String badReviews, int receiptImg, String reviewImg) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("userId", userId);
        paramMap.put("goodReviews", goodReviews);
        paramMap.put("badReviews", badReviews);
        paramMap.put("receiptImg", receiptImg);
        paramMap.put("reviewImg", reviewImg);

        return dao.insertDao(paramMap);
    }

    @Override
    public int updatePlusReviewNum(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.updatePlusReviewNum(paramMap);
    }

    @Override
    public int updateMinusReviewNum(long reviewId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("reviewId", reviewId);

        return dao.updateMinusReviewNum(paramMap);
    }

    @Override
    public int reviewCount(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.reviewCount(paramMap);
    }

    @Override
    public int reviewDownCount(long reviewId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("reviewId", reviewId);

        return dao.reviewDownCount(paramMap);
    }

    @Override
    public String getSmallCategory(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.getSmallCategory(paramMap);
    }

    @Override
    public void updateUserBadge(String productId, int userId, String smallCategory) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("userId", userId);
        paramMap.put("smallCategory", smallCategory);

        dao.updateUserBadge(paramMap);
    }

    //창환오빠 부분
    @Override
    public int reviewDelete(long reviewId) {
        dao.commentDelete(reviewId);
        return dao.reviewDelete(reviewId);
    }

    @Override
    public int reviewModify() {
        return 0;
    }

    @Override
    public List<ReviewDTO> reviewRead(String productId, int offset, int receiptImg, int sort) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("offset", offset);
        paramMap.put("receiptImg", receiptImg);

        if(sort==0) {
            return dao.dateReviewRead(paramMap);
        } else {
            return dao.likeReviewRead(paramMap);
        }
    }
}
