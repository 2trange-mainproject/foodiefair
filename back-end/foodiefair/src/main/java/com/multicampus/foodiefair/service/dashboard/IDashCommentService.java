package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dto.CommentDTO;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;

import java.util.List;

public interface IDashCommentService {
    // 댓글 읽기
    public CommentDTO read(long selectedId);

    // 댓글 삭제
    public int delete(long selectedId);

    // 리스트 출력
    public List<CommentDTO> selectDashCommentList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
    public int getDashCommentCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);

    PageReviewerResponseDTO<CommentDTO> getDashCommentList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
}
