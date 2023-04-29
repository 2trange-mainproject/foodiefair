package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ILikeReviewDAO {
    int likeReviewInsert(int userId, int reviewId);
    int likeReviewDelete(int userId, int reviewId);
}
