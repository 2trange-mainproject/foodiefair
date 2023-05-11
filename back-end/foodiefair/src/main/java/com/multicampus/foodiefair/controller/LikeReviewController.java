package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.service.ILikeReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        int userId = (int) requestBody.get("userId");
        long reviewId = ((Number) requestBody.get("reviewId")).longValue();
        log.info("userId : " + userId + ", reviewId : " + reviewId);

        Integer result = iLikeReviewService.registerLikeReview(reviewId, userId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/likeReview/{reviewId}/{userId}")
    public ResponseEntity<Integer> removeLikeReview (@PathVariable long reviewId, @PathVariable int userId) {
        Integer result = iLikeReviewService.removeLikeReview(reviewId, userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/likeReview/{userId}")
    public ResponseEntity<List<Integer>> likeReviewList (@PathVariable int userId) {
        List<Integer> likeReview = iLikeReviewService.likeReviewList(userId);
        return ResponseEntity.ok(likeReview);
    }
}
