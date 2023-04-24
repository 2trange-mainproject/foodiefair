package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.FollowDTO;
import org.apache.ibatis.annotations.Mapper;

// Follow 관련 데이터베이스 작업을 위한 인터페이스
@Mapper
public interface FollowDAO {
    // 다른 유저의 자신 팔로우 취소
    public int deleteFollowed(Long followingId, Long followedId);
    // 유저 팔로우
    public int insertFollowing(FollowDTO followDTO);
    // 유저 언팔로우
    public int deleteFollowing(Long followingId, Long followedId);
    // 나를 Follow하는 유저 수
    public int selectFollowerCount(Long followedId);
    // 내가 Follow하는 유저 수
    public int selectFollowingCount(Long followingId);
    // 팔로우 상태 확인 (내가 팔로우 중인지)
    public Boolean check(Long followingId, Long followedId);
}
