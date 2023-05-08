package com.multicampus.foodiefair.service;

public interface ILikeReviewService {
    int registerLikeReview(long reviewId, int userId);
    int removeLikeReview(long reviewId, int userId);

    //int updateLikeReview(long reviewId, int userId, int update);
    //int reviewLikeCount(long reviewId);
}
