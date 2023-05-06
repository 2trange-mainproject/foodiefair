package com.multicampus.foodiefair.controller.dashboard;

import com.multicampus.foodiefair.controller.S3Client;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.service.dashboard.IDashProductService;
import com.multicampus.foodiefair.service.dashboard.IDashUserService;
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
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/dashboard")
public class DashUserController {
    @Autowired
    private IDashUserService dashUserService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // Delete
    @DeleteMapping("/user-delete/{userId}")
    public ResponseEntity<String> userDelete(
            @PathVariable("userId") int userId) {

        dashUserService.delete(userId);

        return ResponseEntity.ok("success");
    }

    // Read
    @GetMapping("/user-read/{userId}")
    public ResponseEntity<Map<String, Object>> userRead(
            @PathVariable("userId") int userId) {

        UserDTO user = dashUserService.read(userId);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        String objectKey = user.getUserImg();
        String url = s3Client.getUserUrl(objectKey, 3600);
        user.setUserImg(url);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("userRead", user);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    // Update
    @PutMapping("/user-update/{userId}")
    public ResponseEntity<String> userUpdate(
            @PathVariable("userId") int userId,
            @RequestParam("updatedUserReport") int userReport,
            @RequestParam("updatedUserLocked") int locked) {

        dashUserService.update(userId, userReport, locked);

        // 처리 코드 작성
        return ResponseEntity.ok("success");
    }

    // 리스트 출력
    @GetMapping("/user-list")
    public ResponseEntity<Map<String, Object>> UserList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "12"));
        String sortOrder = requestParams.get("sortOrder");
        String searchKeyword = requestParams.get("searchKeyword");

        PageReviewerRequestDTO pageReviewerRequestDTO = PageReviewerRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        PageReviewerResponseDTO<UserDTO> pageReviewerResponseDTO = dashUserService.getDashUserList(pageReviewerRequestDTO, sortOrder, searchKeyword);

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
