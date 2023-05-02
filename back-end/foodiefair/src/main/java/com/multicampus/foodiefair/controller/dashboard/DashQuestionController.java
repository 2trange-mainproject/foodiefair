package com.multicampus.foodiefair.controller.dashboard;

import com.multicampus.foodiefair.dto.QuestionDTO;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.service.dashboard.IDashQuestionService;
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
public class DashQuestionController {
    @Autowired
    private IDashQuestionService dashQuestionService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // Delete
    @DeleteMapping("/question-delete/{questionId}")
    public ResponseEntity<String> questionDelete(
            @PathVariable("questionId") String questionId) {

        dashQuestionService.delete(questionId);

        return ResponseEntity.ok("success");
    }

    // Read
    @GetMapping("/question-read/{questionId}")
    public ResponseEntity<Map<String, Object>> questionRead(
            @PathVariable("questionId") String questionId) {

        QuestionDTO question = dashQuestionService.read(questionId);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("questionRead", question);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    // 리스트 출력
    @GetMapping("/question-list")
    public ResponseEntity<Map<String, Object>> QuestionList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "12"));
        String sortOrder = requestParams.get("sortOrder");
        String searchKeyword = requestParams.get("searchKeyword");

        PageReviewerRequestDTO pageReviewerRequestDTO = PageReviewerRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        PageReviewerResponseDTO<QuestionDTO> pageReviewerResponseDTO = dashQuestionService.getDashQuestionList(pageReviewerRequestDTO, sortOrder, searchKeyword);

        int totalCount = pageReviewerResponseDTO.getTotal();

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", totalCount);
        resultMap.put("dtoList", pageReviewerResponseDTO.getDtoList());
        resultMap.put("page", page);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
