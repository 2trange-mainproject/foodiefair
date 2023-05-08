package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.saved.SavedDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Mapper
public interface SavedDAO {
    int insertSaved(Map<String, Object> paramMap);
    int deleteSaved(Map<String, Object> paramMap);
    // 상품의 찜 숫자 조회
    int countSavedProduct(Map<String, Object> paramMap);
    // 유저의 찜 상품 숫자 조회
    int countSavedUser(Map<String, Object> paramMap);
    // 회원 찜 리스트 출력
    ArrayList<HashMap<String, Object>> selectSavedList(Map<String, Object> paramMap);
    ArrayList<HashMap<String, Object>> selectSavedFour(Map<String, Object> paramMap);


}
