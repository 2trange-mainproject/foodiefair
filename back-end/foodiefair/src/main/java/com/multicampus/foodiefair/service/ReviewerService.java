package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IReviewerDAO;
import com.multicampus.foodiefair.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewerService implements IReviewerService{
    private final IReviewerDAO dao;

    //리뷰어 랭킹
    @Override
    public List<UserDTO> list(String topRank) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("topRank", topRank);

        return dao.listDao(paramMap);
    }

    //뱃지 리뷰어
    @Override
    public List<UserDTO> selectReviewerList(PageReviewerRequestDTO pageReviewerRequestDto, List<String> categoryFilters, String selectedBadge) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("categoryFilters", categoryFilters);
        paramMap.put("selectedBadge", selectedBadge);

        return dao.selectReviewerList(paramMap);
    }

    @Override
    public int getReviewerCount(PageReviewerRequestDTO pageReviewerRequestDto, List<String> categoryFilters, String selectedBadge) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("categoryFilters", categoryFilters);
        paramMap.put("selectedBadge", selectedBadge);

        return dao.getReviewerCount(paramMap);
    }

    @Override
    public PageReviewerResponseDTO<UserDTO> getReviewerList(PageReviewerRequestDTO pageReviewerRequestDto, List<String> categoryFilters, String selectedBadge) {
        List<UserDTO> DtoList = selectReviewerList(pageReviewerRequestDto, categoryFilters, selectedBadge);
        int total = getReviewerCount(pageReviewerRequestDto, categoryFilters, selectedBadge);

        return PageReviewerResponseDTO.<UserDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageReviewerRequestDto(pageReviewerRequestDto)
                .build();
    }
}
