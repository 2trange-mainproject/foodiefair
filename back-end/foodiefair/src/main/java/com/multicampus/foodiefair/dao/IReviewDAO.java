package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;

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
}
