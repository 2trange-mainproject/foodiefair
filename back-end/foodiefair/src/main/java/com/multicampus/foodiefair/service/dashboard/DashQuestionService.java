package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dao.dashboard.IDashCommentDAO;
import com.multicampus.foodiefair.dao.dashboard.IDashQuestionDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.QuestionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashQuestionService implements IDashQuestionService {
    private final IDashQuestionDAO dao;

    @Override
    public QuestionDTO read(long selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.readDao(paramMap);
    }

    @Override
    public int delete(long selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.deleteDao(paramMap);
    }

    @Override
    public List<QuestionDTO> selectDashQuestionList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.selectDashQuestionList(paramMap);
    }

    @Override
    public int getDashQuestionCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.getDashQuestionCount(paramMap);
    }

    @Override
    public PageReviewerResponseDTO<QuestionDTO> getDashQuestionList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        List<QuestionDTO> DtoList = selectDashQuestionList(pageReviewerRequestDto, sortOrder, searchKeyword);
        int total = getDashQuestionCount(pageReviewerRequestDto, sortOrder, searchKeyword);

        return PageReviewerResponseDTO.<QuestionDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageReviewerRequestDto(pageReviewerRequestDto)
                .build();
    }
}
