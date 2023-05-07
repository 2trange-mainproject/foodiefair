package com.multicampus.foodiefair.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.ArrayList;
import java.util.HashMap;


// Follow 관계를 맺고있는 User의 프로필를 불러오기 위한 인터페이스
// Map의 Key : "userId", "userImg", "userName"

@Mapper
public interface FollowProfileDAO {
    // 무한스크롤 기능 적용. No offset
    ArrayList<HashMap<String, Object>> selectFollowerProfiles(
            @Param("followedId") int followedId,
            @Param("lastFollowId") Long lastFollowId,
            @Param("perPage") int perPage,
            @Param("loggedUserId") int loggedUserId);


    ArrayList<HashMap<String, Object>> selectFollowingProfiles(
            @Param("followingId") int followingId,
            @Param("lastFollowId") Long lastFollowId,
            @Param("perPage") int perPage,
            @Param("loggedUserId") int loggedUserId);


}
