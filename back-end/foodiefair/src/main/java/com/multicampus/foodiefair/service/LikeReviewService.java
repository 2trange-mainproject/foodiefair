package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ILikeReviewDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@Service
public class LikeReviewService implements ILikeReviewService{
    private final ILikeReviewDAO iLikeReviewDAO;

    @Override
    public int registerLikeReview(long reviewId, int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("reviewId", reviewId);
        paramMap.put("userId", userId);

        int result = iLikeReviewDAO.registerLikeReview(paramMap);
        if(result > 0) {
            paramMap.put("update", result);
            if(iLikeReviewDAO.updateLikeReview(paramMap) > 0)
                return iLikeReviewDAO.reviewLikeCount(paramMap);
        }
        return result;
    }

    @Override
    public int removeLikeReview(long reviewId, int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("reviewId", reviewId);
        paramMap.put("userId", userId);

        int result = iLikeReviewDAO.removeLikeReview(paramMap);
        if(result > 0) {
            paramMap.put("update", result*-1);
            if(iLikeReviewDAO.updateLikeReview(paramMap) > 0)
                return iLikeReviewDAO.reviewLikeCount(paramMap);
        }
        return result;
    }
}
