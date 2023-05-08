package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.FollowDAO;
import com.multicampus.foodiefair.dao.FollowProfileDAO;
import com.multicampus.foodiefair.dto.FollowDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

// FollowService 인터페이스를 구현한 클래스
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowDAO followDAO;
    private final FollowProfileDAO followProfileDAO;

    @Override
    public int removeFollowed(int followingId, int followedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("followingId", followingId);
        paramMap.put("followedId", followedId);

        return followDAO.deleteFollowed(paramMap);
    }

    // 팔로우 생성
    @Override
    public int followUser(FollowDTO followDTO) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("followingId", followDTO.getFollowingId());
        paramMap.put("followedId", followDTO.getFollowedId());

        return followDAO.insertFollowing(paramMap);
    }

    // 팔로우 제거
    @Override
    public int unfollowUser(int followingId, int followedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("followingId", followingId);
        paramMap.put("followedId", followedId);

        return followDAO.deleteFollowing(paramMap);
    }

    // 팔로워 수 반환
    @Override
    public int getFollowedCount(int followedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("followedId", followedId);

        return followDAO.selectFollowerCount(paramMap);
    }

    // 팔로잉 수 반환
    @Override
    public int getFollowingCount(int followingId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("followingId", followingId);

        return followDAO.selectFollowingCount(paramMap);
    }

    // 팔로잉 여부 체크
    @Override
    public Boolean checkFollowStatus(int followingId, int followedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("followingId", followingId);
        paramMap.put("followedId", followedId);

        return followDAO.check(paramMap);
    }

    // 팔로워 프로필 목록 조회 (무한 스크롤 적용)
    @Override
    public ArrayList<HashMap<String, Object>> getFollowerProfiles(int followedId, Long lastFollowId, int perPage, int loggedUserId) {
        return followProfileDAO.selectFollowerProfiles(followedId, lastFollowId, perPage, loggedUserId);
    }

    // 팔로잉 프로필 목록 조회 (무한 스크롤 적용)
    @Override
    public ArrayList<HashMap<String, Object>> getFollowingProfiles(int followingId, Long lastFollowId, int perPage, int loggedUserId) {
        return followProfileDAO.selectFollowingProfiles(followingId, lastFollowId, perPage, loggedUserId);
    }

}
