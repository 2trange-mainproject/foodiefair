package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.SaveDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ILikeReviewDAO {
    int likeSave(SaveDTO saveDTO);
    int likeSaveToDelete(SaveDTO saveDTO);
    int likeSavedCount(String productId);
    // 더 필요함.. reviewnum 테이블도 생각해야 함
}
