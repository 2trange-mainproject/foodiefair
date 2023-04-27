package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IReviewDAO {
    int findReviewId(String productId, int userId);
    int reviewInsert(ReviewDTO reviewDTO);
    int reviewDelete(int reviewId);
    //int reviewModify(); 시간 나면 하기
    List<Map<String, Object>> DateReviewRead(String productId, int offset, int receiptImg);
    List<Map<String, Object>> LikeReviewRead(String productId, int offset, int receiptImg);
}