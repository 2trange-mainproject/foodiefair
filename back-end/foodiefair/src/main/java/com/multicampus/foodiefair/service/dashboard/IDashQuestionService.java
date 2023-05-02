package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.QuestionDTO;

import java.util.List;

public interface IDashQuestionService {
    // 문의 읽기
    public QuestionDTO read(String selectedId);

    // 문의 삭제
    public int delete(String selectedId);

    // 리스트 출력
    public List<QuestionDTO> selectDashQuestionList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
    public int getDashQuestionCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);

    PageReviewerResponseDTO<QuestionDTO> getDashQuestionList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
}
