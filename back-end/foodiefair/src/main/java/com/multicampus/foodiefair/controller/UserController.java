package com.multicampus.foodiefair.controller; //TestController

import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.service.RegisterMail;
import com.multicampus.foodiefair.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;
    private final RegisterMail registerMail;
    private final PasswordEncoder passwordEncoder;

    //MultipartFile을 File로 변환하는 메서드
    public File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        Path tempDir = Files.createTempDirectory("");
        File file = new File(tempDir.toFile(), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String userEmail, @RequestParam String userPwd, HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        UserDTO userDto = userService.getUserByEmail(userEmail);
        System.out.println("passwordEncoder.matches(userDto.getUserPwd(), passwordEncoder.encode(userPwd) = " + passwordEncoder.matches(userPwd, userDto.getUserPwd()));
        if (userDto != null && passwordEncoder.matches(userPwd, userDto.getUserPwd())) {
            S3Client s3Client = new S3Client();
            String objectKey = userDto.getUserImg();
            String url = s3Client.getUserUrl(objectKey, 3600);
            userDto.setUserImg(url);

            session.setAttribute("loginUser", userDto);
            result.put("success", true);
            result.put("user", userDto);

            //인증된 사용자인지 확인..
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication: " + authentication);
            System.out.println("Authorities: " + authentication.getAuthorities());

            return ResponseEntity.ok(result);
        } else {
            session.invalidate();
            result.put("success", false);
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestParam String userEmail) {
        Map<String, Object> result = new HashMap<>();
        System.out.println("userEmail = " + userEmail);
        UserDTO userDto = userService.getUserByEmail(userEmail);
        if (userDto != null) {
            // 계정 찾기 성공
            result.put("success", true);
            result.put("message", "계정 찾기에 성공했습니다.");
            return ResponseEntity.ok(result);
        } else {
            // 계정 찾기 실패
            result.put("success", false);
            result.put("message", "해당 이메일로 등록된 계정이 없습니다.");
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/mail-confirm")
    public ResponseEntity<Map<String, Object>> mailConfirm(@RequestParam String userEmail) throws Exception {
        System.out.println("이메일 : " + userEmail);
        Map<String, Object> result = new HashMap<>();
        String code = registerMail.sendSimpleMessage(userEmail);

        System.out.println("인증코드 : " + code);
        if(StringUtils.hasText(code)) {
            result.put("success", true);
            result.put("message", code);
            return ResponseEntity.ok(result);
        }
        result.put("success", false);
        result.put("message", "인증코드 전송에 실패 하였습니다.");
        return ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestParam("userName") String userName,
                                                      @RequestParam("userEmail") String userEmail,
                                                      @RequestParam("userPwd") String userPwd,
                                                      @RequestParam("userTag") String userTag,
                                                      @RequestParam("userIntro") String userIntro,
                                                      @RequestParam("userTags") String userTags,
                                                      @RequestParam("userImg") MultipartFile userImg) throws Exception {
        Map<String, Object> result = new HashMap<>();
        UserDTO userDto = new UserDTO();
        userDto.setUserName(userName);
        userDto.setUserEmail(userEmail);
        userDto.setUserPwd(userPwd);
        userDto.setUserTag(userTag);
        userDto.setUserIntro(userIntro);
        userDto.setUserTags(userTags);
        userDto.setUserImg(userImg.getOriginalFilename());

        System.out.println("user = " + userDto);
        userDto.setUserTag(userDto.getUserTags());
        System.out.println(userDto.getUserTag());

        if (!userImg.isEmpty()) {
            File file = convertMultipartFileToFile(userImg);
            S3Client s3Client = new S3Client();
            String objectKey = userImg.getOriginalFilename();
            String imageurl = s3Client.uploadUserFile(file, objectKey);
        }

        System.out.println(userDto.getUserImg());

        UserDTO userByEmail = userService.getUserByEmail(userDto.getUserEmail());
        //이메일이 중복인 데이터 insert시 다른곳에서 오류 발생함, 이메일 중복X
        if(ObjectUtils.isEmpty(userByEmail)) {
            userService.insertUser(userDto);

            result.put("success", true);
            result.put("message", "회원가입에 성공하였습니다.");
            return ResponseEntity.ok(result);
        }

        result.put("success", false);
        result.put("message", "이미 가입된 회원입니다.");
        return ResponseEntity.badRequest().body(result);
    }

    @PutMapping("/password-modify")
    public ResponseEntity<Map<String, Object>> mailConfirm(@RequestParam String userEmail, @RequestParam String userPwd) throws Exception {
        System.out.println("userEmail = " + userEmail);
        System.out.println("userPwd = " + userPwd);
        userService.updateUserPassword(userEmail, userPwd);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "비밀번호 수정에 성공하였습니다.");
        return ResponseEntity.ok(result);
    }

    //Modify
    @PutMapping("/modify")
    public ResponseEntity<Map<String, Object>> userUpdate(
            @RequestParam("userName") String userName,
            @RequestParam("userPwd") String userPwd,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("userIntro") String userIntro,
            @RequestParam("userImg") String userImg,
            @RequestParam("userTag") String userTag
    ) throws Exception{
        System.out.println("userName = " + userName);
        System.out.println("userPwd = " + userPwd);
        System.out.println("userEmail = " + userEmail);
        System.out.println("userIntro = " + userIntro);
        System.out.println("userImg = " + userImg);
        System.out.println("userTag = " + userTag);
        userService.updateUser(userName, userPwd, userEmail, userIntro, userImg, userTag);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "회원정보 수정에 성공하였습니다.");
        return ResponseEntity.ok(result);
    }


    @DeleteMapping("/user-delete/{userEmail}")
    public ResponseEntity<String> deleteUser(@PathVariable("userEmail") String userEmail) {
        try {
            userService.delete(userEmail);
            return ResponseEntity.ok("success");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}