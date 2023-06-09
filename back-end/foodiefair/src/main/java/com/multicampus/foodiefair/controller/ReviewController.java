package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.ReviewDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/products/review")
@Log4j2
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService iReviewService;

    @GetMapping("/reviewRead")
    public ResponseEntity<Map<String, Object>> reviewRead(@RequestParam String productId, @RequestParam int offset, @RequestParam int receiptImg, @RequestParam int sort) {
        log.info("reviewReadController");
        log.info("productId : " + productId + ", offset : " + offset + ", receiptImg : " + receiptImg + ", sort : " + sort);

        List<ReviewDTO> reviewlist = iReviewService.reviewRead(productId, offset, receiptImg, sort);

        S3Client s3Client = new S3Client();
        for (ReviewDTO review : reviewlist) {
            String objectKey = review.getUserImg();
            String url = s3Client.getUserUrl(objectKey, 3600);
            review.setUserImg(url);

            String foodKey = review.getReviewImg();
            if(foodKey != null){
                String foodurl = s3Client.getReviewUrl(foodKey, 3600);
                review.setReviewImg(foodurl);
            }
        }

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("dtoList", reviewlist);
        log.info("ResultMap : ", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @DeleteMapping("/reviewDelete/{reviewId}")
    public ResponseEntity<Map<String, Object>> reviewDelete (@PathVariable long reviewId) {
        Map<String, Object> resultMap = new HashMap<>();

        iReviewService.updateMinusReviewNum(reviewId);

        int reviewCount = iReviewService.reviewDownCount(reviewId);
        resultMap.put("reviewCount", reviewCount);
        resultMap.put("status", "success");

        iReviewService.reviewDelete(reviewId);

        return ResponseEntity.ok(resultMap);
    }

    @GetMapping("/reviewReadOne/{reviewId}")
    public ResponseEntity<Map<String, Object>> reviewReadOne (@PathVariable long reviewId) {
        Map<String, Object> reviewOne = iReviewService.reviewReadOne(reviewId);
        return ResponseEntity.ok(reviewOne);
    }

    @PatchMapping("/reviewModify")
    public ResponseEntity<String> reviewModify(@RequestParam long reviewId,
                                               @RequestParam String goodReviews,
                                               @RequestParam String badReviews,
                                               @RequestParam(required = false) MultipartFile reviewImg) {
        log.info(reviewImg);
        iReviewService.reviewModify(reviewId, goodReviews, badReviews, reviewImg);
        return ResponseEntity.ok("success");
    }
}