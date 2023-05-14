package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.*;
import com.multicampus.foodiefair.service.IReviewerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class ReviewerController {
    @Autowired
    private IReviewerService reviewerService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @GetMapping("/reviewer-rank")
    public ResponseEntity<Map<String, Object>> reviewerRank(
            @RequestParam Map<String, String> requestParams) {
        String topRank = requestParams.get("topRank");

        S3Client s3Client = new S3Client();
        List<UserDTO> userList = reviewerService.list(topRank);

        for (UserDTO user : userList) {
            String objectKey = user.getUserImg();
            String url = s3Client.getUserUrl(objectKey, 3600);
            user.setUserImg(url);
        }

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("dtoList", userList);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/reviewer-badge")
    public ResponseEntity<Map<String, Object>> reviewerBadge(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "15"));
        List<String> categoryFilters = Arrays.stream(requestParams.getOrDefault("categories", "").replaceAll("\\[|\\]", "").split(","))
                .map(s -> s.replaceAll("\"", ""))
                .collect(Collectors.toList());
        String selectedBadge = requestParams.get("selectedBadge");
        logger.info(String.valueOf(categoryFilters));
        logger.info(selectedBadge);

        PageReviewerRequestDTO pageReviewerRequestDTO = PageReviewerRequestDTO.builder()
                .page(page)
                .size(size)
                .categoryFilters(categoryFilters)
                .build();

        PageReviewerResponseDTO<UserDTO> pageReviewerResponseDTO = reviewerService.getReviewerList(pageReviewerRequestDTO, categoryFilters, selectedBadge);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        for (UserDTO user : pageReviewerResponseDTO.getDtoList()) {
            String objectKey = user.getUserImg();
            String url = s3Client.getUserUrl(objectKey, 3600);
            user.setUserImg(url);
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
