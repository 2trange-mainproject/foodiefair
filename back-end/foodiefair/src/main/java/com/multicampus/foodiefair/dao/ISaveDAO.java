package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.SaveDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface ISaveDAO {
    int registerSaved(SaveDTO saveDTO);
    int removeSaved(Map<String, Object> paramMap);
    int savedCount(String productId);
}

