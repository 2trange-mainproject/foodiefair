package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IReviewDAO {
    int findReviewId(String productId, int userId);
    int reviewInsert(ReviewDTO reviewDTO);
    int reviewDelete(int reviewId);
    //int reviewModify(); 시간 나면 하기
    int reviewRead(); // 페이징
}