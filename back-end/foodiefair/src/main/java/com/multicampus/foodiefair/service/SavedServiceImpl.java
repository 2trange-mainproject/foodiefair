package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.SavedDAO;
import com.multicampus.foodiefair.dto.saved.SavedDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageRequestDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SavedServiceImpl implements SavedService{

    private final SavedDAO savedDAO;

    @Override
    public int registerSaved(SavedDTO savedDTO) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", savedDTO.getUserId());
        paramMap.put("productId", savedDTO.getProductId());

        return savedDAO.insertSaved(paramMap);
    }

    @Override
    public int removeSaved(String productId, int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);
        paramMap.put("productId", productId);

        return savedDAO.deleteSaved(paramMap);
    }

    @Override
    public int getSavedProductCount(String productId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        return savedDAO.countSavedProduct(paramMap);
    }

    @Override
    public int getSavedUserCount(int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);

        return savedDAO.countSavedUser(paramMap);
    }

    @Override
    public SavedPageResponseDTO getSavedList(SavedDTO savedDTO, SavedPageRequestDTO pageRequestDTO) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", savedDTO.getUserId());
        paramMap.put("offset", (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize());
        paramMap.put("limit", pageRequestDTO.getSize());

        // 페이지에 표시될 데이터 목록 조회
        ArrayList<HashMap<String, Object>> dataList = savedDAO.selectSavedList(paramMap);

        // 전체 방명록 개수 조회
        int total = savedDAO.countSavedUser(paramMap);

        // 페이지 정보를 포함한 VisitedPageResponseDTO 객체 생성
        return SavedPageResponseDTO.withAll()
                .pageRequestDto(pageRequestDTO)
                .dataList(dataList)
                .total(total)
                .build();
    }

    @Override
    public ArrayList<HashMap<String, Object>> getSavedFour(int userId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);

        return savedDAO.selectSavedFour(paramMap);
    }
}
