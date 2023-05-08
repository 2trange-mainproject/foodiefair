package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.SaveDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface ISaveDAO {
    int registerSaved(SaveDTO saveDTO);
    int removeSaved(Map<String, Object> paramMap);
    int savedCount(Map<String, Object> paramMap);
    int updatePlusSave(Map<String, Object> paramMap);
    int updateMinusSave(Map<String, Object> paramMap);
}

