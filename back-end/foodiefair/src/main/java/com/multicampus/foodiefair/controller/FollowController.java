package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.FollowDTO;
import com.multicampus.foodiefair.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/mypage/{userId}")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;


    // 팔로워 프로필 목록 가져오기 (무한 스크롤 적용)
    @GetMapping("/followers")
    public ResponseEntity<ArrayList<HashMap<String, Object>>> getFollowerProfiles(
            @PathVariable Long userId,
            @RequestParam(required = false) Long lastFollowId,
            @RequestParam(defaultValue = "10") int perPage) {
        ArrayList<HashMap<String, Object>> profiles = followService.getFollowerProfiles(userId, lastFollowId, perPage);
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    // 팔로잉 프로필 목록 가져오기 (무한 스크롤 적용)
    @GetMapping("/followings")
    public ResponseEntity<ArrayList<HashMap<String, Object>>> getFollowingProfiles(
            @PathVariable Long userId,
            @RequestParam(required = false) Long lastFollowId,
            @RequestParam(defaultValue = "10") int perPage) {
        ArrayList<HashMap<String, Object>> profiles = followService.getFollowingProfiles(userId, lastFollowId, perPage);
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    // 팔로워 수 가져오기
    @GetMapping("/followers/count")
    public ResponseEntity<Integer> getFollowedCount(@PathVariable Long userId) {
        int count = followService.getFollowedCount(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // 팔로잉 수 가져오기
    @GetMapping("/followings/count")
    public ResponseEntity<Integer> getFollowingCount(@PathVariable Long userId) {
        int count = followService.getFollowingCount(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // 유저 팔로우
    @PostMapping("/follow")
    public ResponseEntity<Void> followUser(
            @PathVariable Long userId,
            @RequestBody FollowDTO followDTO) {
        followService.followUser(followDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // 유저 언팔로우
    @DeleteMapping("/unfollow")
    public ResponseEntity<Void> unfollowUser(
            @RequestHeader("X-UserId") Long loggedInUserId,
            @RequestParam Long followedId) {
        followService.unfollowUser(loggedInUserId, followedId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 다른 유저의 자신 팔로우 취소
    @DeleteMapping("/follower")
    public ResponseEntity<Void> removeFollowed(@PathVariable Long userId, @RequestParam Long followingId) {
        followService.removeFollowed(followingId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 팔로잉 여부 확인
    @GetMapping("/following-check")
    public ResponseEntity<Boolean> checkFollowStatus(
            @RequestHeader("X-UserId") Long loggedInUserId,
            @RequestParam Long followedId) {
        boolean isFollowing = followService.checkFollowStatus(loggedInUserId, followedId);
        return new ResponseEntity<>(isFollowing, HttpStatus.OK);
    }
}

