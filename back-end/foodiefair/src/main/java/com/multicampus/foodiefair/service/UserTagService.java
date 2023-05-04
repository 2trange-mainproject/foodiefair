package com.multicampus.foodiefair.service;

import org.json.JSONArray;
import org.json.JSONObject;

public interface UserTagService {
    String getUserTags(Long userId);
    String getUserBadges(Long userId);
}
