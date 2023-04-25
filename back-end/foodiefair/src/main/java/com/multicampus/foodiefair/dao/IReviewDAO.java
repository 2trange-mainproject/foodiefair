package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IReviewDAO {
    int findReviewId(String productId, int userId);
}
