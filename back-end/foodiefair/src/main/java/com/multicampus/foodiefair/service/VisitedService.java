package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.VisitedDTO;
import com.multicampus.foodiefair.dto.VisitedPageRequestDTO;
import com.multicampus.foodiefair.dto.VisitedPageResponseDTO;

import java.util.List;
import java.util.Map;

public interface VisitedService {
    // 방명록 목록 가져오기
    VisitedPageResponseDTO getVisitedList(VisitedDTO visitedDto, VisitedPageRequestDTO pageRequestDto);
    // 방명록 등록
    int registerVisited(VisitedDTO visitedDTO);
    // 방명록 삭제
    int removeVisited(Long visitedId);
}
