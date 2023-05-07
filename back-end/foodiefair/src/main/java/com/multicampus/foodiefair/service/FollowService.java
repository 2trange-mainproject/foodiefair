package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.FollowDTO;
import java.util.ArrayList;
import java.util.HashMap;

// Follow 서비스 용 인터페이스
public interface FollowService {
    int removeFollowed(int followingId, int followedId);
    int followUser(FollowDTO followDTO);
    int unfollowUser(int followingId, int followedId);
    // 팔로워 수 조회
    int getFollowedCount(int followedId);
    // 팔로잉 수 조회
    int getFollowingCount(int followingId);
    Boolean checkFollowStatus(int followingId, int followedId);
    // 팔로워 프로필 목록 조회 (무한 스크롤 적용)
    ArrayList<HashMap<String, Object>> getFollowerProfiles(int followedId, Long lastFollowId, int perPage, int loggedUserId);
    // 팔로잉 프로필 목록 조회 (무한 스크롤 적용)
    ArrayList<HashMap<String, Object>> getFollowingProfiles(int followingId, Long lastFollowId, int perPage, int loggedUserId);
}
