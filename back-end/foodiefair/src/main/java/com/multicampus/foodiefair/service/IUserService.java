package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.UserDTO;
import java.util.List;

public interface IUserService {
    public List<UserDTO> getUserList();
    public void insertUser(UserDTO userDto);
    public UserDTO getUserByEmail(String userEmail);
    public UserDTO getUserById(int id);
    public void updateUser(String userName, String userEmail, String userPwd,
                           String userIntro, String userTag, String userImg);
    public void deleteUser(int userId);
    public void updateUserPassword(String userEmail, String userPwd);
    public void delete(String userEmail) throws Exception;
}