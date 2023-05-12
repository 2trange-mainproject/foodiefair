package com.multicampus.foodiefair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewNumDTO {
    private Long userId;
    private String reviewNum;
    private String userBadge;
    private String selectedBadge;
}
