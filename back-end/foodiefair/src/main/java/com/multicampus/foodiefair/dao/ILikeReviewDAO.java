package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ILikeReviewDAO {
    int registerLikeReview(int reviewId, int userId);
    int removeLikeReview(int reviewId, int userId);
    int updateLikeReview(int reviewId, int userId, int update);
    int reviewLikeCount(int reviewId);
}
