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
    public int save(SaveDTO saveDTO) {
        return isaveDAO.save(saveDTO);
    }

    @Override
    public int saveToDelete(SaveDTO saveDTO) {
        return isaveDAO.saveToDelete(saveDTO);
    }

    @Override
    public int savedCount(String productId) {
        return isaveDAO.savedCount(productId);
    }
}
