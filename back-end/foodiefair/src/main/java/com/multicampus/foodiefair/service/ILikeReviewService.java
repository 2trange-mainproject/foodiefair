package com.multicampus.foodiefair.service;

import java.util.List;

public interface ILikeReviewService {
    int registerLikeReview(long reviewId, int userId);
    int removeLikeReview(long reviewId, int userId);
    List<Integer> likeReviewList(int userId);

    //int updateLikeReview(long reviewId, int userId, int update);
    //int reviewLikeCount(long reviewId);
}
