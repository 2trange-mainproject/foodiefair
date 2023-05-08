package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.VisitedDAO;
import com.multicampus.foodiefair.dto.visited.VisitedDTO;
import com.multicampus.foodiefair.dto.visited.VisitedPageRequestDTO;
import com.multicampus.foodiefair.dto.visited.VisitedPageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VisitedServiceImpl implements VisitedService{

    private final VisitedDAO visitedDAO;

    @Override
    public VisitedPageResponseDTO getVisitedList(VisitedDTO visitedDTO, VisitedPageRequestDTO pageRequestDTO) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("ownerId", visitedDTO.getOwnerId());
        paramMap.put("offset", (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize());
        paramMap.put("limit", pageRequestDTO.getSize());

        // 페이지에 표시될 데이터 목록 조회
        ArrayList<HashMap<String, Object>> dataList = visitedDAO.selectVisitedList(paramMap);

        // 전체 방명록 개수 조회
        int total = visitedDAO.countVisitedList(paramMap);

        // 페이지 정보를 포함한 VisitedPageResponseDTO 객체 생성
        return VisitedPageResponseDTO.withAll()
                .pageRequestDto(pageRequestDTO)
                .dataList(dataList)
                .total(total)
                .build();
    }

    @Override
    public int registerVisited(VisitedDTO visitedDTO) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("writerId", visitedDTO.getWriterId());
        paramMap.put("ownerId", visitedDTO.getOwnerId());
        paramMap.put("visitedDate", visitedDTO.getVisitedDate());
        paramMap.put("visitedContent", visitedDTO.getVisitedContent());

        return visitedDAO.insertVisited(paramMap);
    }

    @Override
    public int removeVisited(Long visitedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("visitedId", visitedId);

        return visitedDAO.deleteVisited(paramMap);
    }
}
