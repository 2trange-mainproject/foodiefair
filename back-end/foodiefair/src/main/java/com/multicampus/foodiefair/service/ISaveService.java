package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.SaveDTO;

public interface ISaveService {
    int registerSaved(SaveDTO saveDTO);
    int removeSaved(String productId, int userId);
    int savedCount(String productId);
}
