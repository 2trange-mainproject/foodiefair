package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.SavedDAO;
import com.multicampus.foodiefair.dto.saved.SavedDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageRequestDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class SavedServiceImpl implements SavedService{

    private final SavedDAO savedDAO;

    @Override
    public int registerSaved(SavedDTO savedDTO) {
        return savedDAO.insertSaved(savedDTO);
    }

    @Override
    public int removeSaved(Long savedId) {
        return savedDAO.deleteSaved(savedId);
    }

    @Override
    public int getSavedProductCount(String productId) {
        return savedDAO.countSavedProduct(productId);
    }

    @Override
    public int getSavedUserCount(Long userId) {
        return savedDAO.countSavedUser(userId);
    }

    @Override
    public SavedPageResponseDTO getSavedList(SavedDTO savedDTO, SavedPageRequestDTO pageRequestDTO) {
        // 페이지에 표시될 데이터 목록 조회
        ArrayList<HashMap<String, Object>> dataList = savedDAO.selectSavedList(savedDTO.getUserId(),
                (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize(), pageRequestDTO.getSize());

        // 전체 방명록 개수 조회
        int total = savedDAO.countSavedUser(savedDTO.getUserId());

        // 페이지 정보를 포함한 VisitedPageResponseDTO 객체 생성
        return SavedPageResponseDTO.withAll()
                .pageRequestDto(pageRequestDTO)
                .dataList(dataList)
                .total(total)
                .build();
    }
}
