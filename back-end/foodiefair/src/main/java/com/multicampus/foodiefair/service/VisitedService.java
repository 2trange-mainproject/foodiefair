package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.VisitedDTO;

import java.util.List;
import java.util.Map;

public interface VisitedService {
    // 방명록 목록 가져오기
    List<Map<String, Object>> getVisitedList(Long ownerId, int offset, int limit);
    // 방명록 갯수
    int visitedCount(Long ownerId);
    // 방명록 등록
    int registerVisited(VisitedDTO visitedDTO);
    // 방명록 삭제
    int removeVisited(Long visitedId);
}
