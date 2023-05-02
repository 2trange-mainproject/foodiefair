package com.multicampus.foodiefair.controller; //TestController
//테스트용컨트롤러이며 RestAPI를 적용한 컨트롤러이다.
//UserController랑 TestController를 동시에 실행하면 오류가 발생하므로 Controller를 실행할 때
//둘 중 하나는 코드를 모두 주석처리하고 실행해야 한다.

import com.multicampus.foodiefair.dto.UserDTO;
import com.multicampus.foodiefair.service.RegisterMail;
import com.multicampus.foodiefair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private RegisterMail registerMail;

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String userEmail, @RequestParam String userPwd, HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        UserDTO userDto = userService.getUserByEmail(userEmail);
        if (userDto != null && userDto.getUserPwd().equals(userPwd)) {
            session.setAttribute("loginUser", userDto);
            result.put("success", true);
            result.put("user", userDto);
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
    public ResponseEntity<Map<String, Object>> signup(@RequestBody UserDTO userDto) throws Exception {
        Map<String, Object> result = new HashMap<>();
        System.out.println("user = " + userDto);
        //태그 기능 구현시 삭제해주세요.
        userDto.setUserTag(null);
        //이미지 파일 업로드 기능을 구현해주세요.

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

}