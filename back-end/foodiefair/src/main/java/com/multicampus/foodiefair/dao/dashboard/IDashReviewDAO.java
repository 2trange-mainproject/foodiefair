package com.multicampus.foodiefair.dao.dashboard;

import com.multicampus.foodiefair.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IDashReviewDAO {
    //리뷰 읽기
    public ReviewDTO readDao(Map<String, Object> paramMap);

    //리뷰 삭제
    public int deleteDao(Map<String, Object> paramMap);

    //리뷰 리스트 출력
    public List<ReviewDTO> selectDashReviewList(Map<String, Object> paramMap);
    public int getDashReviewCount(Map<String, Object> paramMap);
}
