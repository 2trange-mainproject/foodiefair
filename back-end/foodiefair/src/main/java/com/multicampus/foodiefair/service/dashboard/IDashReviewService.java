package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;

import java.util.List;

public interface IDashReviewService {
    // 리뷰 읽기
    public ReviewDTO read(String selectedId);

    // 리뷰 삭제
    public int delete(String selectedId);

    // 리스트 출력
    public List<ReviewDTO> selectDashReviewList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
    public int getDashReviewCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);

    PageReviewerResponseDTO<ReviewDTO> getDashReviewList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
}
