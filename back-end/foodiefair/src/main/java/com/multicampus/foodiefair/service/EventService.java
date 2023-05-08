package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IEventDAO;
import com.multicampus.foodiefair.dto.PageRequestDTO;
import com.multicampus.foodiefair.dto.PageResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EventService implements IEventService {
    private final IEventDAO dao;

    private final Logger logger = LoggerFactory.getLogger(EventService.class);

    @Override
    public List<ProductDTO> selectEventList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<Integer> eventFilters, String sortOrder) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageRequestDto", pageRequestDto);
        paramMap.put("storeFilters", storeFilters);
        paramMap.put("eventFilters", eventFilters);
        paramMap.put("sortOrder", sortOrder);

        return dao.selectEventList(paramMap);
    }

    @Override
    public int getEventCount(PageRequestDTO pageRequestDto, List<String> storeFilters, List<Integer> eventFilters, String sortOrder) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageRequestDto", pageRequestDto);
        paramMap.put("storeFilters", storeFilters);
        paramMap.put("eventFilters", eventFilters);
        paramMap.put("sortOrder", sortOrder);

        return dao.getEventCount(paramMap);
    }

    @Override
    public PageResponseDTO<ProductDTO> getEventList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<Integer> eventFilters, String sortOrder) {
        List<ProductDTO> DtoList = selectEventList(pageRequestDto, storeFilters, eventFilters, sortOrder);
        int total = getEventCount(pageRequestDto, storeFilters, eventFilters, sortOrder);

        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageRequestDto(pageRequestDto)
                .build();
    }
}
