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
            @PathVariable int userId,
            @RequestParam(required = false) Long lastFollowId,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam("loggedUserId") int loggedUserId) {
        ArrayList<HashMap<String, Object>> profiles = followService.getFollowerProfiles(userId, lastFollowId, perPage, loggedUserId);
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    // 팔로잉 프로필 목록 가져오기 (무한 스크롤 적용)
    @GetMapping("/followings")
    public ResponseEntity<ArrayList<HashMap<String, Object>>> getFollowingProfiles(
            @PathVariable int userId,
            @RequestParam(required = false) Long lastFollowId,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam("loggedUserId") int loggedUserId) {
        ArrayList<HashMap<String, Object>> profiles = followService.getFollowingProfiles(userId, lastFollowId, perPage, loggedUserId);
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    // 팔로워 수 가져오기
    @GetMapping("/followers/count")
    public ResponseEntity<Integer> getFollowedCount(@PathVariable int userId) {
        int count = followService.getFollowedCount(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // 팔로잉 수 가져오기
    @GetMapping("/followings/count")
    public ResponseEntity<Integer> getFollowingCount(@PathVariable int userId) {
        int count = followService.getFollowingCount(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // 유저 팔로우
    @PostMapping("/follow")
    public ResponseEntity<String> followUser(
            @RequestBody FollowDTO followDTO) {
        int result = followService.followUser(followDTO);
        if (result == 1) {
            return ResponseEntity.ok("Following added successfully");
        } else {
            return ResponseEntity.badRequest().body("Error adding saved");
        }
    }

    // 유저 언팔로우
    @DeleteMapping("/unfollow")
    public ResponseEntity<String> unfollowUser(
            @RequestParam("loggedUserId") int loggedUserId,
            @RequestParam int followedId) {
        int result = followService.unfollowUser(loggedUserId, followedId);
        if (result >= 1) {
            return ResponseEntity.ok("Saved removed successfully");
        } else {
            return ResponseEntity.badRequest().body("Error removing saved");
        }
    }

    // 다른 유저의 자신 팔로우 취소
    @DeleteMapping("/follower")
    public ResponseEntity<Void> removeFollowed(@PathVariable int userId, @RequestParam int followingId) {
        followService.removeFollowed(followingId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 팔로잉 여부 확인
    @GetMapping("/following-check")
    public ResponseEntity<Boolean> checkFollowStatus(
            @RequestHeader("X-UserId") int loggedInUserId,
            @RequestParam int followedId) {
        boolean isFollowing = followService.checkFollowStatus(loggedInUserId, followedId);
        return new ResponseEntity<>(isFollowing, HttpStatus.OK);
    }
}
