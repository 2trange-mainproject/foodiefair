package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.service.UserTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage/{userId}")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserTagController {

    private final UserTagService userTagService;

    // 유저 마이태그 목록 가져오기
    @GetMapping("/userTags")
    public ResponseEntity<String> getUserTags(@PathVariable int userId) {
        String userTags = userTagService.getUserTags(userId);
        return new ResponseEntity<>(userTags, HttpStatus.OK);
    }

    @GetMapping("/userBadges")
    public ResponseEntity<String> getUserBadges(@PathVariable int userId) {
        String userBadges = userTagService.getUserBadges(userId);
        return new ResponseEntity<>(userBadges, HttpStatus.OK);
    }

    @GetMapping("/userSelectedBadge")
    public ResponseEntity<String> getUserSelectedBadge(@PathVariable int userId) {
        String selectedBadge = userTagService.getUserSelectedBadge(userId);
        return new ResponseEntity<>(selectedBadge, HttpStatus.OK);
    }
}
