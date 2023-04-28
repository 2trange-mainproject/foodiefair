package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.VisitedDAO;
import com.multicampus.foodiefair.dto.VisitedDTO;
import com.multicampus.foodiefair.dto.VisitedPageRequestDTO;
import com.multicampus.foodiefair.dto.VisitedPageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VisitedServiceImpl implements VisitedService{

    private final VisitedDAO visitedDAO;

    @Override
    public VisitedPageResponseDTO getVisitedList(VisitedDTO visitedDTO, VisitedPageRequestDTO pageRequestDTO) {
        // 페이지에 표시될 데이터 목록 조회
        List<Map<String, Object>> dataList = visitedDAO.selectVisitedList(visitedDTO.getOwnerId(),
                (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize(), pageRequestDTO.getSize());

        // 전체 방명록 개수 조회
        int total = visitedDAO.countVisitedList(visitedDTO.getOwnerId());

        // 페이지 정보를 포함한 VisitedPageResponseDTO 객체 생성
        return VisitedPageResponseDTO.withAll()
                .pageRequestDto(pageRequestDTO)
                .dataList(dataList)
                .total(total)
                .build();
    }

    @Override
    public int registerVisited(VisitedDTO visitedDTO) {
        return visitedDAO.insertVisited(visitedDTO);
    }

    @Override
    public int removeVisited(Long visitedId) {
        int result = visitedDAO.deleteVisited(visitedId);
        if (result == 1) {
            System.out.println("Visited removed successfully with ID: " + visitedId);
        } else if (result == 0){
            System.out.println("Error removing visited with ID: " + visitedId);
        } else {
            System.out.println("result : "+result+"visitedId : " + visitedId);
        }
        return result;
    }
}
