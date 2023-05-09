package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.*;

import java.util.List;
import java.util.Map;

public interface IReviewService {
    //키워드 리스트
    public List<ReviewDTO> list(String productId);

    //긍정, 부정 키워드 추가
    public int updatePositive(String productId, String positiveKeyword);
    public int updateNegative(String productId, String negativeKeyword);

    //리뷰 추가
    public int insert(String productId, int userId, String goodReviews, String badReviews, int receiptImg, String reviewImg);

    //리뷰 개수 올리고 내리기
    public int updatePlusReviewNum(String productId);
    public int updateMinusReviewNum(long reviewId);

    public int reviewCount(String productId);
    public int reviewDownCount(long reviewId);

    //뱃지 얻기
    public String getSmallCategory(String productId);
    public void updateUserBadge(String productId, int userId, String smallCategory);

    //창환 오빠 부분
    int reviewDelete(long reviewId);
    int reviewModify();

    List<ReviewDTO> reviewRead(String productId, int offset, int receiptImg, int sort);
}
