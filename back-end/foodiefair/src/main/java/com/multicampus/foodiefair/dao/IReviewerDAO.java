package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IReviewerDAO {
    //리뷰어 랭킹
    public List<UserDTO> listDao(Map<String, Object> paramMap);

    //뱃지 리뷰어
    public List<UserDTO> selectReviewerList(Map<String, Object> paramMap);
    public int getReviewerCount(Map<String, Object> paramMap);
}
