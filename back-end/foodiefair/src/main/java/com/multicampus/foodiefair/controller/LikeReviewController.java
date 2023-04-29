package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.service.ILikeReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/products/review")
@Log4j2
@RequiredArgsConstructor
public class LikeReviewController {
    private final ILikeReviewService iLikeReviewService;

    @PostMapping("/likeReview")
    public ResponseEntity<String> likeReviewInsert (@RequestBody Map<String, Object> requestBody) {
        iLikeReviewService.likeReviewInsert((int)requestBody.get("userId"), (int)requestBody.get("reviewId"));
        return ResponseEntity.ok("likeReviewInsert success");
    }

    @DeleteMapping("/likeReviewDelete/{userId}/{reviewId}")
    public ResponseEntity<String> likeReviewDelete (@PathVariable int userId, @PathVariable int reviewId) {
        iLikeReviewService.likeReviewDelete(userId, reviewId);
        return ResponseEntity.ok("likeReviewDelete success");
    }
}
