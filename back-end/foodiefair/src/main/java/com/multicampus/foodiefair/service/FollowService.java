package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.FollowDTO;
import java.util.ArrayList;
import java.util.HashMap;

// Follow 서비스 용 인터페이스
public interface FollowService {
    void removeFollowed(Long followingId, Long followedId);
    void followUser(FollowDTO followDTO);
    void unfollowUser(Long followingId, Long followedId);
    // 팔로워 수 조회
    int getFollowedCount(Long followedId);
    // 팔로잉 수 조회
    int getFollowingCount(Long followingId);
    Boolean checkFollowStatus(Long followingId, Long followedId);
    // 팔로워 프로필 목록 조회 (무한 스크롤 적용)
    ArrayList<HashMap<String, Object>> getFollowerProfiles(Long followedId, Long lastFollowId, int perPage);
    // 팔로잉 프로필 목록 조회 (무한 스크롤 적용)
    ArrayList<HashMap<String, Object>> getFollowingProfiles(Long followingId, Long lastFollowId, int perPage);
}
