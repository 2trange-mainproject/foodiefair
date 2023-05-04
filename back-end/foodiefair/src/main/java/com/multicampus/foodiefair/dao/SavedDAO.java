package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.saved.SavedDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.ArrayList;
import java.util.HashMap;


@Mapper
public interface SavedDAO {
    int insertSaved(SavedDTO savedDTO);
    int deleteSaved(Long savedId);
    // 상품의 찜 숫자 조회
    int countSavedProduct(String productId);
    // 유저의 찜 상품 숫자 조회
    int countSavedUser(Long userId);
    // 회원 찜 리스트 출력
    ArrayList<HashMap<String, Object>> selectSavedList(Long userId, int offset, int limit);
    ArrayList<HashMap<String, Object>> selectSavedFour(Long userId);


}
