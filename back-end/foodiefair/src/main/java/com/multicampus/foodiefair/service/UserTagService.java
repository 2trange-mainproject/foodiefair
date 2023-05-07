package com.multicampus.foodiefair.service;

import org.json.JSONArray;
import org.json.JSONObject;

public interface UserTagService {
    String getUserTags(int userId);
    String getUserBadges(int userId);
}
