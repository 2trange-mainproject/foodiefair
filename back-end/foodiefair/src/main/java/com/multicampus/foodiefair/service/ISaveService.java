package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.SaveDTO;

public interface ISaveService {
    int save(SaveDTO saveDTO);
    int saveToDelete(SaveDTO saveDTO);
    int savedCount(String productId);
}
