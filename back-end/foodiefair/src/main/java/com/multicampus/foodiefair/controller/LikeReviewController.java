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
    public ResponseEntity<Integer> registerLikeReview (@RequestBody Map<String, Object> requestBody) {
        Integer result = iLikeReviewService.registerLikeReview((int)requestBody.get("reviewId"), (int)requestBody.get("userId"));
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/likeReview/{reviewId}/{userId}")
    public ResponseEntity<Integer> removeLikeReview (@PathVariable int reviewId, @PathVariable int userId) {
        Integer result = iLikeReviewService.removeLikeReview(reviewId, userId);
        return ResponseEntity.ok(result);
    }
}
