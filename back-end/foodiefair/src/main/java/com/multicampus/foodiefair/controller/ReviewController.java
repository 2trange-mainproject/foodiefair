package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.ReviewDTO;
import com.multicampus.foodiefair.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/products/review")
@Log4j2
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService iReviewService;

    @PostMapping("/reviewInsert")
    public ResponseEntity<String> reviewInsert(@Valid @RequestBody ReviewDTO reviewDTO, BindingResult bindingResult) {
        log.info("reviewInsertController");
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        iReviewService.reviewInsert(reviewDTO);
        return ResponseEntity.ok("review success");
    }

    @GetMapping("/reviewRead")
    public ResponseEntity<List<Map<String, Object>>> reviewRead(@RequestParam String productId, @RequestParam int offset, @RequestParam int receiptImg, @RequestParam int sort) {
        log.info("reviewReadController");
        log.info(offset);
        return ResponseEntity.ok(iReviewService.reviewRead(productId, offset, receiptImg, sort));
    }

    @DeleteMapping("/reviewDelete/{reviewId}")
    public ResponseEntity<String> reviewDelete (@PathVariable int reviewId) {
        iReviewService.reviewDelete(reviewId);
        return ResponseEntity.ok("review delete success");
    }
}