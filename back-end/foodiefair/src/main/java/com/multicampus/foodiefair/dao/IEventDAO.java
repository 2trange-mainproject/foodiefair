package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IEventDAO {
    public List<ProductDTO> selectEventList(Map<String, Object> paramMap);
    public int getEventCount(Map<String, Object> paramMap);
}
