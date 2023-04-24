package com.multicampus.foodiefair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;
import java.util.Map;

// 팔로우 목록에 user id, user profile img 표시하는 데 필요한 데이터를 나타냄
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Integer userId;
    private String userPwd;
    private String userName;
    private String userEmail;
    private String userIntro;
    // JSON userTag 필드를 represent 하기 위해 Map 사용
    private Map<String, Object> userTag;
    // 신고횟수
    private Integer userReport;
    // 이미지의 저장 link를 string으로 저장
    private String userImg;
    // 회원의 정지/비정지
    private Byte locked;
    // 회원의 관리자 권한 여부
    private String userAuth;
    // 카카오 로그인
    private Byte kakao;
    private Date registerDate;
}
