package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ISaveDAO;
import com.multicampus.foodiefair.dto.SaveDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SaveService implements ISaveService{
    private final ISaveDAO isaveDAO;

    @Override
    public int registerSaved(SaveDTO saveDTO) {
        return isaveDAO.registerSaved(saveDTO);
    }

    @Override
    public int removeSaved(String productId, int userId) {
        return isaveDAO.removeSaved(productId, userId);
    }

    @Override
    public int savedCount(String productId) {
        return isaveDAO.savedCount(productId);
    }
}
