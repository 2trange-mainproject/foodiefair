package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dao.dashboard.IDashCommentDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
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
public class DashCommentService implements IDashCommentService {
    private final IDashCommentDAO dao;

    @Override
    public CommentDTO read(long selectedId) {
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
    public List<CommentDTO> selectDashCommentList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.selectDashCommentList(paramMap);
    }

    @Override
    public int getDashCommentCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.getDashCommentCount(paramMap);
    }

    @Override
    public PageReviewerResponseDTO<CommentDTO> getDashCommentList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        List<CommentDTO> DtoList = selectDashCommentList(pageReviewerRequestDto, sortOrder, searchKeyword);
        int total = getDashCommentCount(pageReviewerRequestDto, sortOrder, searchKeyword);

        return PageReviewerResponseDTO.<CommentDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageReviewerRequestDto(pageReviewerRequestDto)
                .build();
    }
}
