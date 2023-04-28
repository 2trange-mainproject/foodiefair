package com.multicampus.foodiefair.dto;

import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class QuestionDTO {
    private int questionId; //문의id
    private String userId; //회원id
    private String questionType; //문의 종류
    private Date questionDate; //문의 시간
    private String questionContent; //문의 내용
}
