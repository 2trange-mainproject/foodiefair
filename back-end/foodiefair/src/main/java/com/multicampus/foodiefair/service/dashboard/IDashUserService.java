package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.UserDTO;

import java.util.List;

public interface IDashUserService {
    // 회원 읽기
    public UserDTO read(String selectedId);

    // 회원 삭제
    public int delete(String selectedId);

    // 회원 수정
    public int update(String selectedId, Integer userReport, Integer locked);

    // 리스트 출력
    public List<UserDTO> selectDashUserList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
    public int getDashUserCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);

    PageReviewerResponseDTO<UserDTO> getDashUserList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
}
