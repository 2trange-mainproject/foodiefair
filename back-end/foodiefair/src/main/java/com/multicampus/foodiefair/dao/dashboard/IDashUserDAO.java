package com.multicampus.foodiefair.dao.dashboard;

import com.multicampus.foodiefair.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IDashUserDAO {
    //회원 읽기
    public UserDTO readDao(Map<String, Object> paramMap);

    //회원 삭제
    public int deleteDao(Map<String, Object> paramMap);

    //회원 수정
    public int updateDao(Map<String, Object> paramMap);

    //회원 리스트 출력
    public List<UserDTO> selectDashUserList(Map<String, Object> paramMap);
    public int getDashUserCount(Map<String, Object> paramMap);
}
