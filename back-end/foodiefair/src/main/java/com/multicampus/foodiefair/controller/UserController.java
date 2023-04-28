package com.multicampus.foodiefair.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final Map<Long, User> userMap = new HashMap<>();

    @GetMapping("/edit-customer/{id}")
    public ResponseEntity<String> editCustomer(@PathVariable Long id) throws JsonProcessingException {
        logger.debug("editCustomer method called with id: {}", id);
        S3Client s3Client = new S3Client();
        String profileUrl = s3Client.getUserUrl("none.jpg", 3600); // expirationTimeInSeconds를 설정해 주세요.
        User user = userMap.getOrDefault(id, new User(id, "test@test.com", "testuser", "Hello, World!", "#test #user", profileUrl));
        logger.debug("User object: {}", user);

        ObjectMapper objectMapper = new ObjectMapper();             //User 객체를 JSON 문자열로 변환
        String userJson = objectMapper.writeValueAsString(user);
        return new ResponseEntity<>(userJson, HttpStatus.OK);       //String 타입의 응답 메세지와 함께 HTTP 응답 코드를 전송하기 위함. 출력데이터는 JSON 형식
    }

    private static class User {
        private Long id;
        private String email;
        private String nickname;
        private String intro;
        private String tags;
        private String profileUrl;

        public User(Long id, String email, String nickname, String intro, String tags, String profileUrl) {
            this.id = id;
            this.email = email;
            this.nickname = nickname;
            this.intro = intro;
            this.tags = tags;
            this.profileUrl = profileUrl;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getNickname() {
            return nickname;
        }

        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public String getIntro() {
            return intro;
        }

        public void setIntro(String intro) {
            this.intro = intro;
        }

        public String getTags() {
            return tags;
        }

        public void setTags(String tags) {
            this.tags = tags;
        }

        public String getProfileUrl() {
            return profileUrl;
        }

        public void setProfileUrl(String profileUrl) {
            this.profileUrl = profileUrl;
        }
    }
}

