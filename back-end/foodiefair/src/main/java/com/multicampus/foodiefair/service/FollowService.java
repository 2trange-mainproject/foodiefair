package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.FollowDTO;

import java.util.List;
import java.util.Map;

// Follow 서비스 용 인터페이스
public interface FollowService {
    void removeFollowed(Long followingId, Long followedId);
    void followUser(FollowDTO followDTO);
    void unfollowUser(Long followingId, Long followedId);
    int getFollowedCount(Long followedId);
    int getFollowingCount(Long followingId);
    Boolean checkFollowStatus(Long followingId, Long followedId);
    // 팔로워 프로필 목록 조회 (무한 스크롤 적용)
    List<Map<String, Object>> getFollowerProfiles(Long followedId);
    // 팔로잉 프로필 목록 조회 (무한 스크롤 적용)
    List<Map<String, Object>> getFollowingProfiles(Long followingId);
}
