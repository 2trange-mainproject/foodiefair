package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.UserTagDAO;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class UserTagServiceImpl implements UserTagService{

    private final UserTagDAO userTagDAO;


    @Override
    public String getUserTags(int userId) {
        return userTagDAO.selectUserTagList(userId);
    }

    @Override
    public String getUserBadges(int userId) {
        return userTagDAO.selectUserBadgeList(userId);
    }
}
