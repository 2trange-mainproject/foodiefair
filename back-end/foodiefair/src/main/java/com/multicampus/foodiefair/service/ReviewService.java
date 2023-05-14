package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.controller.S3Client;
import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final IReviewDAO dao;

    @Override
    public List<ReviewDTO> list(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.listDao(paramMap);
    }

    @Override
    public int updatePositive(String productId, String positiveKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("positiveKeyword", positiveKeyword);

        return dao.updatePositiveDao(paramMap);
    }

    @Override
    public int updateNegative(String productId, String negativeKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("negativeKeyword", negativeKeyword);

        return dao.updateNegativeDao(paramMap);
    }

    @Override
    public int insert(String productId, int userId, String goodReviews, String badReviews, int receiptImg, String reviewImg) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("userId", userId);
        paramMap.put("goodReviews", goodReviews);
        paramMap.put("badReviews", badReviews);
        paramMap.put("receiptImg", receiptImg);
        paramMap.put("reviewImg", reviewImg);
        if(dao.reviewSearch(paramMap)==0) {
            return dao.insertDao(paramMap);
        } else {
            return -1;
        }
    }

    @Override
    public int updatePlusReviewNum(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.updatePlusReviewNum(paramMap);
    }

    @Override
    public int updateMinusReviewNum(long reviewId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("reviewId", reviewId);

        return dao.updateMinusReviewNum(paramMap);
    }

    @Override
    public int reviewCount(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.reviewCount(paramMap);
    }

    @Override
    public int reviewDownCount(long reviewId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("reviewId", reviewId);

        return dao.reviewDownCount(paramMap);
    }

    @Override
    public String getSmallCategory(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return dao.getSmallCategory(paramMap);
    }

    @Override
    public void updateUserBadge(String productId, int userId, String smallCategory) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("userId", userId);
        paramMap.put("smallCategory", smallCategory);

        dao.updateUserBadge(paramMap);
    }

    //창환오빠 부분
    @Override
    public int reviewDelete(long reviewId) {
        dao.commentDelete(reviewId);
        return dao.reviewDelete(reviewId);
    }

    public File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        Path tempDir = Files.createTempDirectory("");
        File file = new File(tempDir.toFile(), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    @Override
    public int reviewModify(long reviewId, String goodReviews, String badReviews, MultipartFile reviewImg) {
        String reviewKey=null;
        try {
            if (reviewImg != null) {
                // 이미지를 네이버 클라우드 플랫폼 버킷에 올림.
                File reviewFile = convertMultipartFileToFile(reviewImg);

                S3Client s3Client = new S3Client();
                reviewKey = reviewImg.getOriginalFilename();
                s3Client.uploadReviewFile(reviewFile, reviewKey);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return dao.reviewModify(reviewId, goodReviews, badReviews, reviewKey);
    }

    @Override
    public Map<String, Object> reviewReadOne(long reviewId) {
        return dao.reviewReadOne(reviewId);
    }

    @Override
    public List<ReviewDTO> reviewRead(String productId, int offset, int receiptImg, int sort) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("offset", offset);
        paramMap.put("receiptImg", receiptImg);

        if(sort==0) {
            return dao.dateReviewRead(paramMap);
        } else {
            return dao.likeReviewRead(paramMap);
        }
    }

    @Override
    public List<ReviewDTO> mypageReviewRead(int userId, int offset, int receiptImg, int sort) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);
        paramMap.put("offset", offset);
        paramMap.put("receiptImg", receiptImg);

        if(sort==0) {
            return dao.mypageDateReviewRead(paramMap);
        } else {
            return dao.mypageLikeReviewRead(paramMap);
        }
    }
}
