package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.CommentDTO;
import com.multicampus.foodiefair.service.ICommentService;
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
@RequiredArgsConstructor //final사용하기 위해 생성자 주입
public class CommentController {
    private final ICommentService commentService;

    @PostMapping("/comment") //댓글
    public ResponseEntity<String> comment(@Valid @RequestBody CommentDTO commentDTO, BindingResult bindingResult) {
        log.info("CommentController");
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        commentService.commentInsert(commentDTO);
        return ResponseEntity.ok("comment success");
    }

    @DeleteMapping("/commentDelete/{commentId}")
    public ResponseEntity<String> commentDelete(@PathVariable int commentId) {
        log.info(commentId);
        commentService.commentDelete(commentId);
        return ResponseEntity.ok("comment delete");
    }
}