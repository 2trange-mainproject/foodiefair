package com.multicampus.foodiefair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VisitedDTO {
    private Long visitedId;    // 방명록 고유 ID
    private Long writerId;     // 방명록 작성자
    private Long ownerId;   // [마이페이지]에서 띄울 방명록들을 결정하는, 해당 [마이페이지]의 소유자
    private Date visitedDate;   // 방명록 작성일자
    private String visitedContent;   // 방명록 내용 (아주 짧게 유지)

}
