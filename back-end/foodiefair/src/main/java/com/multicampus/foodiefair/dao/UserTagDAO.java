package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface UserTagDAO {
    String selectUserTagList(Map<String, Object> paramMap);
    String selectUserBadgeList(Map<String, Object> paramMap);
}
