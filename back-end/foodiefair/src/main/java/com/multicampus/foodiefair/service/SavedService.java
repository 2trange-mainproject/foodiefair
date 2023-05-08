package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.saved.SavedDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageRequestDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageResponseDTO;

import java.util.ArrayList;
import java.util.HashMap;

public interface SavedService {
    int registerSaved(SavedDTO savedDTO);
    int removeSaved(String productId, int userId);
    // 상품의 찜 숫자 조회
    int getSavedProductCount(String productId);
    // 유저의 찜 상품 숫자 조회
    int getSavedUserCount(int userId);
    // 회원 찜 리스트 출력
    SavedPageResponseDTO getSavedList(SavedDTO savedDTO, SavedPageRequestDTO pageRequestDTO);
    ArrayList<HashMap<String,Object>> getSavedFour(int userId);
}
