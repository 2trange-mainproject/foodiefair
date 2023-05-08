package com.multicampus.foodiefair.controller.dashboard;

import com.multicampus.foodiefair.controller.S3Client;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.CommentDTO;
import com.multicampus.foodiefair.service.dashboard.IDashCommentService;
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
public class DashCommentController {
    @Autowired
    private IDashCommentService dashCommentService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // Delete
    @DeleteMapping("/comment-delete/{commentId}")
    public ResponseEntity<String> commentDelete(
            @PathVariable("commentId") long commentId) {

        dashCommentService.delete(commentId);

        return ResponseEntity.ok("success");
    }

    // Read
    @GetMapping("/comment-read/{commentId}")
    public ResponseEntity<Map<String, Object>> commentRead(
            @PathVariable("commentId") long commentId) {

        CommentDTO comment = dashCommentService.read(commentId);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("commentRead", comment);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    // 리스트 출력
    @GetMapping("/comment-list")
    public ResponseEntity<Map<String, Object>> CommentList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "12"));
        String sortOrder = requestParams.get("sortOrder");
        String searchKeyword = requestParams.get("searchKeyword");

        PageReviewerRequestDTO pageReviewerRequestDTO = PageReviewerRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        PageReviewerResponseDTO<CommentDTO> pageReviewerResponseDTO = dashCommentService.getDashCommentList(pageReviewerRequestDTO, sortOrder, searchKeyword);

        int totalCount = pageReviewerResponseDTO.getTotal();

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", totalCount);
        resultMap.put("dtoList", pageReviewerResponseDTO.getDtoList());
        resultMap.put("page", page);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
