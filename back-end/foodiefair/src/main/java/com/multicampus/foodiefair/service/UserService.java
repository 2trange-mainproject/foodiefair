package com.multicampus.foodiefair.service; //UserService.

import com.multicampus.foodiefair.dto.ReviewNumDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.dao.IUserDAO;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDTO> getUserList() {
        return userDAO.getUserList();
    }

    @Override
    public void insertUser(UserDTO userDto) {
        passwordEncode(userDto);
        userDAO.insertUser(userDto);
    }

    @Override
    public UserDTO getUserByEmail(String userEmail) {
        return userDAO.getUserByEmail(userEmail);
    }

    @Override
    public UserDTO getUserById(int id) {
        return userDAO.getUserById(id);
    }

    @Override
    public void updateUser(int userId, String userImg, String userName, String userTags, String userIntro) {
        System.out.println("userId = " + userId);
        System.out.println("userImg = " + userImg);
        System.out.println("userName = " + userName);
        System.out.println("userTags = " + userTags);
        System.out.println("userIntro = " + userIntro);
        userDAO.updateUser(userId, userImg, userName, userTags, userIntro);
    }


    @Override
    public void deleteUser(int userId) {
        userDAO.deleteUser(userId);
    }

    @Override
    public void updateUserPassword(String userEmail, String userPwd) {
        System.out.println("UserServiceImpl.updateUserPassword");
        System.out.println("userEmail = " + userEmail);
        System.out.println("passwordEncoder.encode(userPwd) = " + passwordEncoder.encode(userPwd));
        userDAO.updateUserPassword(userEmail, passwordEncoder.encode(userPwd));
    }

    @Override
    public void delete(String userEmail) throws Exception {
        userDAO.deleteDao(userEmail);
    }

    private void passwordEncode(UserDTO userDto) {
        String encodePwd = passwordEncoder.encode(userDto.getUserPwd());
        System.out.println("encodePwd = " + encodePwd);
        userDto.setUserPwd(encodePwd);
    }

    @Override
    public UserDTO read(int selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return userDAO.readDao(paramMap);
    }

    @Override
    public ReviewNumDTO readBadge(int selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return userDAO.readBadge(paramMap);
    }

    @Override
    public int updateBadge(int selectedId, String selectedBadge) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);
        paramMap.put("selectedBadge", selectedBadge);

        return userDAO.updateBadge(paramMap);
    }
}