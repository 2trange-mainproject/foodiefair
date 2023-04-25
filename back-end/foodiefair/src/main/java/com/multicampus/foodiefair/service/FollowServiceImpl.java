package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.FollowDAO;
import com.multicampus.foodiefair.dao.FollowProfileDAO;
import com.multicampus.foodiefair.dto.FollowDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

// FollowService 인터페이스를 구현한 클래스
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowDAO followDAO;
    private final FollowProfileDAO followProfileDAO;

    @Override
    public void removeFollowed(Long followingId, Long followedId) {
        followDAO.deleteFollowed(followingId, followedId);
    }

    // 팔로우 생성
    @Override
    public void followUser(FollowDTO followDTO) {
        followDAO.insertFollowing(followDTO);
    }

    // 팔로우 제거
    @Override
    public void unfollowUser(Long followingId, Long followedId) {
        followDAO.deleteFollowing(followingId, followedId);
    }

    // 팔로워 수 반환
    @Override
    public int getFollowedCount(Long followedId) {
        return followDAO.selectFollowerCount(followedId);
    }

    // 팔로잉 수 반환
    @Override
    public int getFollowingCount(Long followingId) {
        return followDAO.selectFollowingCount(followingId);
    }

    // 팔로잉 여부 체크
    @Override
    public Boolean checkFollowStatus(Long followingId, Long followedId) {
        return followDAO.check(followingId, followedId);
    }

    // 팔로워 프로필 목록 조회 (무한 스크롤 적용)
    @Override
    public List<Map<String, Object>> getFollowerProfiles(Long followedId, Long lastFollowId, int perPage) {
        return followProfileDAO.selectFollowerProfiles(followedId, lastFollowId, perPage);
    }

    // 팔로잉 프로필 목록 조회 (무한 스크롤 적용)
    @Override
    public List<Map<String, Object>> getFollowingProfiles(Long followingId, Long lastFollowId, int perPage) {
        return followProfileDAO.selectFollowingProfiles(followingId, lastFollowId, perPage);
    }

}
