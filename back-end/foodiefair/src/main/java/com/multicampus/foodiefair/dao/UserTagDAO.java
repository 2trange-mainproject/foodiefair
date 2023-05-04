package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserTagDAO {
    String selectUserTagList(Long userId);
    String selectUserBadgeList(Long userId);
}
