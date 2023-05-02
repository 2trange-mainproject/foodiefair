package com.multicampus.foodiefair.dao; //IUserDAO

import com.multicampus.foodiefair.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IUserDAO {
    public List<UserDTO> getUserList();                 // User 테이블 가져오기
    public void insertUser(UserDTO userDto);            // 회원 가입
    public UserDTO getUserByEmail(String userEmail);    // 회원 정보 가져오기
    public UserDTO getUserById(Long id);
    public void updateUser(UserDTO userDto);            // 회원 정보 수정
    public void deleteUser(Long userId);                // 회원 탈퇴
    public void updateUserPassword(@Param("userEmail") String userEmail,@Param("userPwd") String userPwd); //비밀번호 변경
}