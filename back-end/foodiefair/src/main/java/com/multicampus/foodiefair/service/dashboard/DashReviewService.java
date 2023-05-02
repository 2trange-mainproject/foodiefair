package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dao.dashboard.IDashReviewDAO;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashReviewService implements IDashReviewService {
    private final IDashReviewDAO dao;

    @Override
    public ReviewDTO read(String selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.readDao(paramMap);
    }

    @Override
    public int delete(String selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.deleteDao(paramMap);
    }

    @Override
    public List<ReviewDTO> selectDashReviewList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.selectDashReviewList(paramMap);
    }

    @Override
    public int getDashReviewCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.getDashReviewCount(paramMap);
    }

    @Override
    public PageReviewerResponseDTO<ReviewDTO> getDashReviewList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        List<ReviewDTO> DtoList = selectDashReviewList(pageReviewerRequestDto, sortOrder, searchKeyword);
        int total = getDashReviewCount(pageReviewerRequestDto, sortOrder, searchKeyword);

        return PageReviewerResponseDTO.<ReviewDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageReviewerRequestDto(pageReviewerRequestDto)
                .build();
    }
}
