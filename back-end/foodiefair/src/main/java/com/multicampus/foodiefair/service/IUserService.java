package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.ReviewNumDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface IUserService {
    public List<UserDTO> getUserList();
    public void insertUser(UserDTO userDto);
    public UserDTO getUserByEmail(String userEmail);
    public UserDTO getUserById(int id);
    public void updateUser(int userId, String userImg, String userName, String userTags, String userIntro);
    public void deleteUser(int userId);
    public void updateUserPassword(String userEmail, String userPwd);
    public void delete(String userEmail) throws Exception;
    public UserDTO read(int selectedId);
    public ReviewNumDTO readBadge(int selectedId);
    public int updateBadge(int selectedId, String selectedBadge);
    public int checkName(String userName);
    public int checkEmail(String userEmail);
}