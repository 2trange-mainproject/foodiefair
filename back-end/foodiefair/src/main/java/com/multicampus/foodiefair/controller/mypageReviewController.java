package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.ReviewDTO;
import com.multicampus.foodiefair.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/mypage/{userId}")
public class mypageReviewController {

    private final IReviewService iReviewService;


    @GetMapping("/reviews")
    public ResponseEntity<Map<String, Object>> mypageReviewRead(@RequestParam int userId, @RequestParam int offset, @RequestParam int receiptImg, @RequestParam int sort) {

        List<ReviewDTO> reviewlist = iReviewService.mypageReviewRead(userId, offset, receiptImg, sort);

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

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
