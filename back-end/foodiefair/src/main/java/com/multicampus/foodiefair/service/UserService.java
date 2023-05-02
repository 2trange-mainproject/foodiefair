package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.dao.IUserDAO;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    @Autowired
    private final IUserDAO userDAO;

    @Override
    public List<UserDTO> getUserList() {
        return userDAO.getUserList();
    }

    @Override
    public void insertUser(UserDTO userDto) {
        userDAO.insertUser(userDto);
    }

    @Override
    public UserDTO getUserByEmail(String userEmail) {
        return userDAO.getUserByEmail(userEmail);
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userDAO.getUserById(id);
    }

    @Override
    public void updateUser(UserDTO userDto) {
        userDAO.updateUser(userDto);
    }

    @Override
    public void deleteUser(Long userId) {
        userDAO.deleteUser(userId);
    }

    @Override
    public void updateUserPassword(String userEmail, String userPwd) {
        System.out.println("UserServiceImpl.updateUserPassword");
        System.out.println("userEmail = " + userEmail);
        System.out.println("userPwd = " + userPwd);
        userDAO.updateUserPassword(userEmail, userPwd);
    }
}