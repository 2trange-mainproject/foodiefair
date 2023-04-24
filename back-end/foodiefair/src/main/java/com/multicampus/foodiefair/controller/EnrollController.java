package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.CommentDTO;
import com.multicampus.foodiefair.service.ICommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin("*")
@RequestMapping("/products")
@Log4j2
@RequiredArgsConstructor //final사용하기 위해 생성자 주입
public class EnrollController {
    private final ICommentService commentService;

    @PostMapping("/comment") //댓글
    public ResponseEntity<String> comment(@Valid @RequestBody CommentDTO commentDTO, BindingResult bindingResult) {
        log.info("EnrollController");
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        commentService.commentInsert(commentDTO);
        return ResponseEntity.ok("comment success");
    }

//    @PostMapping("/save") // 찜 하기
//    public ResponseEntity<String> save (@Valid @RequestBody SaveDTO saveDTO, BindingResult bindingResult) {
//        log.info(saveDTO.getSaveId());
//        log.info(saveDTO.getUserId());
//        log.info(saveDTO.getProductId());
//        log.info(saveDTO.getSaveDate());
//        if(bindingResult.hasErrors()) {
//            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
//        }
//        return ResponseEntity.ok("save success");
//    }
//
//    @PostMapping("/savedToDelete") // 찜 삭제
//        public ResponseEntity<String> savedToDelete (@Valid @RequestBody SaveDTO saveDTO, BindingResult bindingResult) {
//        log.info(saveDTO.getSaveId());
//        log.info(saveDTO.getUserId());
//        log.info(saveDTO.getProductId());
//        log.info(saveDTO.getSaveDate());
//        if(bindingResult.hasErrors()) {
//            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
//        }
//        return ResponseEntity.ok("Delete success");
//    }
}