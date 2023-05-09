package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.ReviewDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.service.IReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class KeywordController {
    @Autowired
    private IReviewService reviewService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // NaverCombineKorean 인스턴스 생성
    private NaverCombineKorean naverCombineKorean = new NaverCombineKorean();

    @GetMapping("/keyword/{productId}")
    public ResponseEntity<Map<String, Object>> listKeyword(
            @PathVariable("productId") String productId) {

        List<ReviewDTO> keywordList = reviewService.list(productId);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("dtoList", keywordList);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    //MultipartFile을 File로 변환하는 메서드
    public File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        Path tempDir = Files.createTempDirectory("");
        File file = new File(tempDir.toFile(), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    @PostMapping("/review-add")
    public ResponseEntity<Map<String, Object>> addReview(
            @RequestParam("productId") String productId,
            @RequestParam("userId") int userId,
            @RequestParam("goodReviews") String goodReviews,
            @RequestParam("badReviews") String badReviews,
            @RequestParam(value = "receiptImg", required = false) MultipartFile receiptImg,
            @RequestParam(value = "reviewImg", required = false) MultipartFile reviewImg) {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String reviewKey = null;
            if (reviewImg != null) {
                // 이미지를 네이버 클라우드 플랫폼 버킷에 올림.
                File reviewFile = convertMultipartFileToFile(reviewImg);

                S3Client s3Client = new S3Client();
                reviewKey = reviewImg.getOriginalFilename();
                String imageUrl = s3Client.uploadReviewFile(reviewFile, reviewKey);
                logger.info(reviewKey);
                logger.info(imageUrl);
            }

            Integer receiptBoolean = (receiptImg == null) ? 0 : 1;
            logger.info("영수증 : " + receiptBoolean);

            // imageUrl을 데이터베이스에 저장. (ProductDTO와 IDashProductService 사용)
            reviewService.insert(productId, userId, goodReviews, badReviews, receiptBoolean, reviewKey);
            
            // 해당 상품의 리뷰 개수 1개 올리기
            reviewService.updatePlusReviewNum(productId);
            int reviewCount = reviewService.reviewCount(productId);
            resultMap.put("reviewCount", reviewCount);

            //영수증 인증이 되어있다면 뱃지 얻을 때인지 확인하고 뱃지주기
            if(receiptBoolean == 1){
                String smallCategory =  reviewService.getSmallCategory(productId);
                smallCategory = smallCategory.replace("#", "");
                reviewService.updateUserBadge(productId, userId, smallCategory);
            }

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMap);
        }

        //키워드 추출
        try {
            List<String> negative = naverCombineKorean.extractNegativeKeywords(badReviews);
            for (String n : negative) {
                logger.info(n);
                reviewService.updateNegative(productId, n);
            }

            List<String> positive = naverCombineKorean.extractPositiveKeywords(goodReviews);
            for (String p : positive) {
                logger.info(p);
                reviewService.updatePositive(productId, p);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 처리 코드 작성
        resultMap.put("status", "success");
        return ResponseEntity.ok(resultMap);
    }
}
