package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.saved.SavedDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.ArrayList;
import java.util.HashMap;


@Mapper
public interface SavedDAO {
    int insertSaved(SavedDTO savedDTO);
    int deleteSaved( String productId, int userId);
    // 상품의 찜 숫자 조회
    int countSavedProduct(String productId);
    // 유저의 찜 상품 숫자 조회
    int countSavedUser(int userId);
    // 회원 찜 리스트 출력
    ArrayList<HashMap<String, Object>> selectSavedList(int userId, int offset, int limit);
    ArrayList<HashMap<String, Object>> selectSavedFour(int userId);


}
