package com.multicampus.foodiefair.dao.dashboard;

import com.multicampus.foodiefair.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface IDashProductDAO {
    //상품 읽기
    public ProductDTO readDao(Map<String, Object> paramMap);

    //상품 추가
    public int insertDao(Map<String, Object> paramMap);

    //상품 삭제
    public int deleteDao(Map<String, Object> paramMap);

    //상품 수정
    public int updateDao(Map<String, Object> paramMap);

    //리스트 출력
    public List<ProductDTO> selectDashProductList(Map<String, Object> paramMap);
    public int getDashProductCount(Map<String, Object> paramMap);
}
