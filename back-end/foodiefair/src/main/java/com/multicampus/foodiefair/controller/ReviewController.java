package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import com.multicampus.foodiefair.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
@Log4j2
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService iReviewService;

    @PostMapping("/review")
    public ResponseEntity<String> reviewInsert(@Valid @RequestBody ReviewDTO reviewDTO, BindingResult bindingResult) {
        log.info("reviewInsertController");
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        iReviewService.reviewInsert(reviewDTO);
        return ResponseEntity.ok("review success");
    }
}
