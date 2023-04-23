package com.multicampus.foodiefair.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin("*")
@RequestMapping("/enroll")
public class EnrollController {
    @PostMapping("/reviews")
    public ResponseEntity<String> comment() {
        return ResponseEntity.ok("success");
    }
}