package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.CommentDTO;
import com.multicampus.foodiefair.service.ICommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/products/comment")
@Log4j2
@RequiredArgsConstructor //final사용하기 위해 생성자 주입
public class CommentController {
    private final ICommentService commentService;

    @PostMapping("/")
    public ResponseEntity<Integer> registerComment(@Valid @RequestBody CommentDTO commentDTO, BindingResult bindingResult) {
        log.info("CommentController");
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(0);
        }
        Integer reviewCommentCount = commentService.registerComment(commentDTO);
        return ResponseEntity.ok(reviewCommentCount);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Integer> commentDelete(@PathVariable int commentId) {
        log.info(commentId);
        Integer reviewCount = commentService.commentDelete(commentId);
        return ResponseEntity.ok(reviewCount);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<List<Map<String, Object>>> commentRead(@PathVariable int reviewId) {
        List<Map<String, Object>> commentDTOList = commentService.commentRead(reviewId);
        return ResponseEntity.ok(commentDTOList);
    }
}