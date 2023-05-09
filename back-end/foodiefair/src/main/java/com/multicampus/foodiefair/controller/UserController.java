package com.multicampus.foodiefair.controller; //TestController

import com.amazonaws.services.dynamodbv2.xspec.S;
import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.service.RegisterMail;
import com.multicampus.foodiefair.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
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
import java.security.Principal;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;
    private final RegisterMail registerMail;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsServiceImpl;

    private Collection<? extends GrantedAuthority> getUserAuthorities(Principal principal) {
        if (principal == null) {
            return Collections.emptyList();
        }
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(principal.getName());
        return userDetails.getAuthorities();
    }

    //MultipartFile을 File로 변환하는 메서드
    public File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        Path tempDir = Files.createTempDirectory("");
        File file = new File(tempDir.toFile(), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> login(Principal principal, @RequestParam String userEmail, @RequestParam String userPwd, HttpSession session, HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();
        UserDTO userDto = userService.getUserByEmail(userEmail);
        System.out.println("passwordEncoder.matches(userPwd, userDto.getUserPwd()) = " + passwordEncoder.matches(userPwd, userDto.getUserPwd()));
        
        //Locked되어 있는 경우 로그인 불가능
        if(userDto.getLocked() == 1){
            session.invalidate();
            result.put("success", false);
            result.put("locked", true);
            return ResponseEntity.badRequest().body(result);
        }
        
        if (userDto != null && passwordEncoder.matches(userPwd, userDto.getUserPwd())) {
            S3Client s3Client = new S3Client();
            String objectKey = userDto.getUserImg();
            String url = s3Client.getUserUrl(objectKey, 3600);
            userDto.setUserImg(url);

            session.setAttribute("loginUser", userDto);

            UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(userDto.getUserEmail());

            Collection<? extends GrantedAuthority> authorities = getUserAuthorities(principal);
            result.put("auth", authorities);
            result.put("success", true);
            result.put("user", userDto);

            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //인증된 사용자인지 확인..
            Authentication authenticatedUser = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication: " + authenticatedUser);
            System.out.println("Authorities: " + authenticatedUser.getAuthorities());

            // Create a cookie
            Cookie cookie = new Cookie("UserCookie", Integer.toString(userDto.getUserId()));
            cookie.setMaxAge(60 * 60 * 24); // 1 day
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            System.out.println(cookie.getValue());

            // Add the cookie to the response
            response.addCookie(cookie);

            return ResponseEntity.ok(result);
        } else {
            session.invalidate();
            result.put("success", false);
            result.put("locked", false);
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session, HttpServletResponse response) {
        session.invalidate();

        // 쿠키 삭제
        Cookie cookie = new Cookie("loginUser", "");
        cookie.setMaxAge(0); // Expire the cookie immediately
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        // 쿠키 삭제 후 클라이언트로 응답을 보내는 이유 : 웹 브라우저가 쿠키를 삭제하도록 지시하기 위함.
        response.addCookie(cookie);

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
            System.out.println("objectKey : " + objectKey + ", imageurl : " + imageurl );
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
    public ResponseEntity<Map<String, Object>> userUpdate( HttpSession session,
            @RequestParam("userId") int userId,
            @RequestParam("userImg") MultipartFile userImg,
            @RequestParam("userName") String userName,
            @RequestParam("userTags") String userTags,
            @RequestParam("userIntro") String userIntro,
            @RequestParam("userEmail") String userEmail
    ) throws Exception{

        if (!userImg.isEmpty()) {
            File file = convertMultipartFileToFile(userImg);
            S3Client s3Client = new S3Client();
            String objectKey = userImg.getOriginalFilename();
            s3Client.uploadUserFile(file, objectKey);
        }

        System.out.println("userImg = " + userImg.getOriginalFilename());

        userService.updateUser(userId, userImg.getOriginalFilename(), userName, userTags, userIntro);

        UserDTO userDto = userService.getUserByEmail(userEmail);
        S3Client s3Client = new S3Client();
        String userImgUrl = userDto.getUserImg();
        String url = s3Client.getUserUrl(userImgUrl, 3600);
        userDto.setUserImg(url);

        session.setAttribute("loginUser", userDto);

        Map<String, Object> result = new HashMap<>();
        result.put("user", userDto);
        result.put("success", true);
        result.put("message", "회원정보 수정에 성공하였습니다.");
        return ResponseEntity.ok(result);
    }


    @PutMapping("/user-delete/{userEmail}")
    public ResponseEntity<String> deleteUser(@PathVariable("userEmail") String userEmail, HttpSession session, HttpServletResponse response) {
        try {
            userService.delete(userEmail);

            session.invalidate();

            // Delete the cookie
            Cookie cookie = new Cookie("loginUser", "");
            cookie.setMaxAge(0); // Expire the cookie immediately
            cookie.setHttpOnly(true);
            cookie.setPath("/");

            response.addCookie(cookie);

            return ResponseEntity.ok("success");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user-read/{userId}")
    public ResponseEntity<Map<String, Object>> userRead(
            @PathVariable("userId") int userId) {

        UserDTO user = userService.read(userId);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        String objectKey = user.getUserImg();
        String url = s3Client.getUserUrl(objectKey, 3600);
        user.setUserImg(url);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("userRead", user);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

}