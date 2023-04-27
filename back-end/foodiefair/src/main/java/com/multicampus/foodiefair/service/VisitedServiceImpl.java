package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.VisitedDAO;
import com.multicampus.foodiefair.dto.VisitedDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VisitedServiceImpl implements VisitedService{

    private final VisitedDAO visitedDAO;

    @Override
    public List<Map<String, Object>> getVisitedList(Long ownerId, int offset, int limit) {
        return visitedDAO.selectVisitedList(ownerId, offset, limit);
    }

    @Override
    public int visitedCount(Long ownerId) {
        return visitedDAO.countVisitedList(ownerId);
    }

    @Override
    public int registerVisited(VisitedDTO visitedDTO) {
        return visitedDAO.insertVisited(visitedDTO);
    }

    @Override
    public int removeVisited(Long visitedId) {
        return visitedDAO.deleteVisited(visitedId);
    }
}
