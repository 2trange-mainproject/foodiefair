package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IReviewDAO {
    int findReviewId(String productId, int userId);
    int reviewInsert(ReviewDTO reviewDTO);
    int reviewCount(String productId);
    int reviewDelete(int reviewId);
    int commentDelete(int reviewId);
    //int reviewModify(); 시간 나면 하기
    List<Map<String, Object>> dateReviewRead(String productId, int offset, int receiptImg);
    List<Map<String, Object>> likeReviewRead(String productId, int offset, int receiptImg);
}