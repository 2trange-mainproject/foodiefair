package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.SaveDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ISaveDAO {
    int registerSaved(SaveDTO saveDTO);
    int removeSaved(String productId, int userId);
    int savedCount(String productId);
}
