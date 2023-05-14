package com.multicampus.foodiefair.dao; //IUserDAO

import com.multicampus.foodiefair.dto.ReviewNumDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface IUserDAO {
    public List<UserDTO> getUserList();                 // User 테이블 가져오기

    public void insertUser(UserDTO userDto);            // 회원 가입

    public UserDTO getUserByEmail(String userEmail);    // 회원 정보 가져오기

    public UserDTO getUserById(int id);

    public void updateUser(@Param("userId") int userId, @Param("userImg") String userImg,
                           @Param("userName") String userName, @Param("userTags") String userTags,
                           @Param("userIntro") String userIntro);            // 회원 정보 수정

    public void deleteUser(int userId);                // 회원 탈퇴

    public void updateUserPassword(@Param("userEmail") String userEmail, @Param("userPwd") String userPwd); //비밀번호 변경

    public int deleteDao(String userEmail); //회원삭제하기

    //회원 읽기
    public UserDTO readDao(Map<String, Object> paramMap);
    //대표 칭호
    public ReviewNumDTO readBadge(Map<String, Object> paramMap);
    public int updateBadge(Map<String, Object> paramMap); //회원정보 수정하기

    public int updateDao(Map<String, Object> paramMap); //회원정보 수정하기

    // 기본 뱃지 insert 추가
    public int insertDefaultBadge(String userEmail);

    //닉네임 중복 확인
    public int checkName(Map<String, Object> paramMap);
    public int checkEmail(Map<String, Object> paramMap);
}
