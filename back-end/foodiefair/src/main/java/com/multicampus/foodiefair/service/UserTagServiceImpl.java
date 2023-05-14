package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.UserTagDAO;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserTagServiceImpl implements UserTagService{

    private final UserTagDAO userTagDAO;

    @Override
    public String getUserTags(int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);

        return userTagDAO.selectUserTagList(paramMap);
    }

    @Override
    public String getUserBadges(int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);

        return userTagDAO.selectUserBadgeList(paramMap);
    }

    @Override
    public String getUserSelectedBadge(int userId) {
        return userTagDAO.selectUserSelectedBadge(userId);
    }
}
