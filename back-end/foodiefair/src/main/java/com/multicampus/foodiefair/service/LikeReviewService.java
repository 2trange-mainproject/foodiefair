package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ILikeReviewDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Log4j2
@RequiredArgsConstructor
@Service
public class LikeReviewService implements ILikeReviewService{
    private final ILikeReviewDAO iLikeReviewDAO;

    @Override
    public int registerLikeReview(int reviewId, int userId) {
        int result = iLikeReviewDAO.registerLikeReview(reviewId, userId);
        if(result > 0) {
            if(iLikeReviewDAO.updateLikeReview(reviewId, userId, result) > 0)
                return iLikeReviewDAO.reviewLikeCount(reviewId);
        }
        return result;
    }

    @Override
    public int removeLikeReview(int reviewId, int userId) {
        int result = iLikeReviewDAO.removeLikeReview(reviewId, userId);
        if(result > 0) {
            if(iLikeReviewDAO.updateLikeReview(reviewId, userId, result*-1) > 0)
                return iLikeReviewDAO.reviewLikeCount(reviewId);
        }
        return result;
    }
}
