package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.UserDTO;
import java.util.List;

public interface IUserService {
    public List<UserDTO> getUserList();
    public void insertUser(UserDTO userDto);
    public UserDTO getUserByEmail(String userEmail);
    public UserDTO getUserById(Long id);
    public void updateUser(UserDTO userDto);
    public void deleteUser(Long userId);
    public void updateUserPassword(String userEmail, String userPwd);
}