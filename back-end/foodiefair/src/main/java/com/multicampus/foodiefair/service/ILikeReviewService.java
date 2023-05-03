package com.multicampus.foodiefair.service;

public interface ILikeReviewService {
    int registerLikeReview(int reviewId, int userId);
    int removeLikeReview(int reviewId, int userId);
}
