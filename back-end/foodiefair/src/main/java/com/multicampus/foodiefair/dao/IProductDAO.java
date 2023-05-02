package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IProductDAO {
    //상품 읽기
    public ProductDTO readDao(Map<String, Object> paramMap);

    public List<ProductDTO> selectFilteredList(Map<String, Object> paramMap);
    public int getFilteredCount(Map<String, Object> paramMap);
}
