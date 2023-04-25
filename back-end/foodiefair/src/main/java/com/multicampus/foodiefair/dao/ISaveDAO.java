package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.SaveDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ISaveDAO {
    int save(SaveDTO saveDTO);
    int saveToDelete(SaveDTO saveDTO);
    int savedCount(String productId);
}
