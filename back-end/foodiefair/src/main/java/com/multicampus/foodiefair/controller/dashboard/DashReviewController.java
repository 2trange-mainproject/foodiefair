package com.multicampus.foodiefair.controller.dashboard;

import com.multicampus.foodiefair.controller.S3Client;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import com.multicampus.foodiefair.service.dashboard.IDashReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/dashboard")
public class DashReviewController {
    @Autowired
    private IDashReviewService dashReviewService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // Delete
    @DeleteMapping("/review-delete/{reviewId}")
    public ResponseEntity<String> reviewDelete(
            @PathVariable("reviewId") String reviewId) {

        dashReviewService.delete(reviewId);

        return ResponseEntity.ok("success");
    }

    // Read
    @GetMapping("/review-read/{reviewId}")
    public ResponseEntity<Map<String, Object>> reviewRead(
            @PathVariable("reviewId") String reviewId) {

        ReviewDTO review = dashReviewService.read(reviewId);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        String objectKey = review.getReviewImg();
        String url = s3Client.getReviewUrl(objectKey, 3600);
        review.setReviewImg(url);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("reviewRead", review);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    // 리스트 출력
    @GetMapping("/review-list")
    public ResponseEntity<Map<String, Object>> ReviewList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "12"));
        String sortOrder = requestParams.get("sortOrder");
        String searchKeyword = requestParams.get("searchKeyword");

        PageReviewerRequestDTO pageReviewerRequestDTO = PageReviewerRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        PageReviewerResponseDTO<ReviewDTO> pageReviewerResponseDTO = dashReviewService.getDashReviewList(pageReviewerRequestDTO, sortOrder, searchKeyword);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        for (ReviewDTO review : pageReviewerResponseDTO.getDtoList()) {
            String objectKey = review.getReviewImg();
            String url = s3Client.getReviewUrl(objectKey, 3600);
            review.setReviewImg(url);
        }

        int totalCount = pageReviewerResponseDTO.getTotal();

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", totalCount);
        resultMap.put("dtoList", pageReviewerResponseDTO.getDtoList());
        resultMap.put("page", page);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
