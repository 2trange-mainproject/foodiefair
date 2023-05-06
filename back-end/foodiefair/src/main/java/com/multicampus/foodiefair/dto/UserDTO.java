package com.multicampus.foodiefair.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {
    private int userId;         // 회원ID
    private String userPwd;         // 비밀번호
    private String userName;        // 닉네임
    private String userEmail;       // 이메일
    private String userIntro;       // 자기소개
    private String userTag;         // 마이태그
    private int userReport;     // 신고횟수
    private String userImg;         // 프로필 사진 서버 링크와 연결
    private int locked;         // 로그인 불가
    private String userAuth;        // 관리자권한
    private Boolean kakao;          // 카카오 로그인
    private Date registerDate;      // 가입날짜
    
    //1~3등 때문에 추가한 부분
    private Integer user_rank;
    //뱃지 리뷰어에 출력할 리뷰개수
    private Integer totalReviewCount;
    //여러 개 받아오는 거
    private String userTags;
}
