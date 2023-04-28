package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IProductDAO {
    public List<ProductDTO> selectFilteredList(Map<String, Object> paramMap);
    public int getFilteredCount(Map<String, Object> paramMap);
}
