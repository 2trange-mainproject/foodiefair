package com.multicampus.foodiefair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 팔로우/언팔로우 작업에 필요한 데이터
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FollowDTO {
    // 팔로우 고유 ID
    private Long followId;
    // 팔로잉 하는 userId
    private Integer followingId;
    // 팔로우 받는 userId
    private Integer followedId;
}
