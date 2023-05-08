package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dao.dashboard.IDashUserDAO;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashUserService implements IDashUserService {
    private final IDashUserDAO dao;

    @Override
    public UserDTO read(int selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.readDao(paramMap);
    }

    @Override
    public int delete(int selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.deleteDao(paramMap);
    }

    @Override
    public int update(int selectedId, int userReport, int locked) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);
        paramMap.put("userReport", userReport);
        paramMap.put("locked", locked);

        return dao.updateDao(paramMap);
    }

    @Override
    public List<UserDTO> selectDashUserList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.selectDashUserList(paramMap);
    }

    @Override
    public int getDashUserCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.getDashUserCount(paramMap);
    }

    @Override
    public PageReviewerResponseDTO<UserDTO> getDashUserList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        List<UserDTO> DtoList = selectDashUserList(pageReviewerRequestDto, sortOrder, searchKeyword);
        int total = getDashUserCount(pageReviewerRequestDto, sortOrder, searchKeyword);

        return PageReviewerResponseDTO.<UserDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageReviewerRequestDto(pageReviewerRequestDto)
                .build();
    }
}
