package com.multicampus.foodiefair.dao; //IUserDAO

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

    public void updateUser(@Param("userName") String userName, @Param("userEmail") String userEmail,
                           @Param("userPwd") String userPwd, @Param("userIntro") String userIntro,
                           @Param("userTag") String userTag, @Param("userImg") String userImg);            // 회원 정보 수정

    public void deleteUser(int userId);                // 회원 탈퇴

    public void updateUserPassword(@Param("userEmail") String userEmail, @Param("userPwd") String userPwd); //비밀번호 변경

    public int deleteDao(String userEmail); //회원삭제하기

    //회원 읽기
    public UserDTO readDao(Map<String, Object> paramMap);

    public int updateDao(Map<String, Object> paramMap); //회원정보 수정하기
}