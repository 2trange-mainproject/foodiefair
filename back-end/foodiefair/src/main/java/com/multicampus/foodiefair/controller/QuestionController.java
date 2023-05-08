package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.QuestionDTO;
import com.multicampus.foodiefair.dao.QuestionDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/cscenter")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionDAO questionMapper;

    @PostMapping("/registercs")
    public ResponseEntity<String> registerInquiry(@RequestBody QuestionDTO question) {

        System.out.println("Question userID: " + question.getUserId());
        System.out.println("Question Type: " + question.getQuestionType());
        System.out.println("Question Date: " + question.getQuestionDate());
        System.out.println("Question Content: " + question.getQuestionContent());

        //db에 저장
        questionMapper.insertQuestion(question);

        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}