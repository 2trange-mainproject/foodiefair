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
    public int likeReviewInsert(int userId, int reviewId) {
        return iLikeReviewDAO.likeReviewInsert(userId, reviewId);
    }

    @Override
    public int likeReviewDelete(int userId, int reviewId) {
        log.info(userId);
        log.info(reviewId);
        return iLikeReviewDAO.likeReviewDelete(userId, reviewId);
    }
}
