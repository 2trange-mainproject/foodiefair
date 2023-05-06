package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ISaveDAO;
import com.multicampus.foodiefair.dto.SaveDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("userId", userId);

        return isaveDAO.removeSaved(paramMap);
    }

    @Override
    public int savedCount(String productId) {
        return isaveDAO.savedCount(productId);
    }
}
