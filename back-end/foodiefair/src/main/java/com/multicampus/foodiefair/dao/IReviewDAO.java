package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Mapper
public interface IReviewDAO {
    //키워드 리스트 출력
    public List<ReviewDTO> listDao(Map<String, Object> paramMap);

    //긍정, 부정 키워드 추가
    public int updatePositiveDao(Map<String, Object> paramMap);
    public int updateNegativeDao(Map<String, Object> paramMap);

    //리뷰 추가
    public int insertDao(Map<String, Object> paramMap);

    //리뷰 추가 시 리뷰 개수 1개 올리기
    public int updatePlusReviewNum(Map<String, Object> paramMap);

    //리뷰 삭제 시 리뷰 개수 1개 줄이기
    public int updateMinusReviewNum(Map<String, Object> paramMap);

    //리뷰 개수
    public int reviewCount(Map<String, Object> paramMap);
    public int reviewDownCount(Map<String, Object> paramMap);

    //뱃지 부여
    public String getSmallCategory(Map<String, Object> paramMap);
    public void updateUserBadge(Map<String, Object> paramMap);

    //창환 오빠 부분
    public int findReviewId(String productId, int userId);
    public int reviewInsert(ReviewDTO reviewDTO);
    public int reviewDelete(long reviewId);
    public int commentDelete(long reviewId);
    public Map<String, Object> reviewReadOne(long reviewId);
    public int reviewModify(long reviewId, String goodReviews, String badReviews, String reviewImg);
    public List<ReviewDTO> dateReviewRead(Map<String, Object> paramMap);
    public List<ReviewDTO> likeReviewRead(Map<String, Object> paramMap);
}
