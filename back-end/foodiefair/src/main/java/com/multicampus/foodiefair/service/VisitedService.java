package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.visited.VisitedDTO;
import com.multicampus.foodiefair.dto.visited.VisitedPageRequestDTO;
import com.multicampus.foodiefair.dto.visited.VisitedPageResponseDTO;

public interface VisitedService {
    // 방명록 목록 가져오기
    VisitedPageResponseDTO getVisitedList(VisitedDTO visitedDto, VisitedPageRequestDTO pageRequestDto);
    // 방명록 등록
    int registerVisited(VisitedDTO visitedDTO);
    // 방명록 삭제
    int removeVisited(Long visitedId);
}
