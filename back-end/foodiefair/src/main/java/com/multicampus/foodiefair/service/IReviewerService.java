package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.*;

import java.util.List;

public interface IReviewerService {
    //리뷰어 랭킹
    public List<UserDTO> list(String topRank);

    //뱃지 리뷰어
    public List<UserDTO> selectReviewerList(PageReviewerRequestDTO pageReviewerRequestDto, List<String> categoryFilters, String selectedBadge);
    public int getReviewerCount(PageReviewerRequestDTO pageReviewerRequestDto, List<String> categoryFilters, String selectedBadge);

    PageReviewerResponseDTO<UserDTO> getReviewerList(PageReviewerRequestDTO pageReviewerRequestDto, List<String> categoryFilters, String selectedBadge);
}
