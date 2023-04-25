package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

// Follow 관계를 맺고있는 User의 프로필를 불러오기 위한 인터페이스
// Map의 Key : "userId", "userImg", "userName"

@Mapper
public interface FollowProfileDAO {
    // 무한스크롤 기능 적용. No offset
    List<Map<String, Object>> selectFollowerProfiles(
            @Param("followedId") Long followedId,
            @Param("lastFollowId") Long lastFollowId,
            @Param("perPage") int perPage);

    List<Map<String, Object>> selectFollowingProfiles(
            @Param("followingId") Long followingId,
            @Param("lastFollowId") Long lastFollowId,
            @Param("perPage") int perPage);

}
