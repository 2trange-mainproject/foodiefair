package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ILikeReviewDAO {
    int registerLikeReview(Map<String, Object> paramMap);
    int removeLikeReview(Map<String, Object> paramMap);
    int updateLikeReview(Map<String, Object> paramMap);
    int reviewLikeCount(Map<String, Object> paramMap);
    List<Integer> likeReviewList(int userId);
}