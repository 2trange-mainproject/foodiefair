package com.multicampus.foodiefair.service;

public interface ILikeReviewService {
    int likeReviewInsert(int userId, int reviewId);
    int likeReviewDelete(int userId, int reviewId);
}
