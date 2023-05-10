package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.PageRequestDTO;
import com.multicampus.foodiefair.dto.PageResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;

import java.util.List;

public interface IEventService {
    public List<ProductDTO> selectEventList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<Integer> eventFilters, String sortOrder, Integer userId);
    public int getEventCount(PageRequestDTO pageRequestDto, List<String> storeFilters, List<Integer> eventFilters, String sortOrder, Integer userId);

    PageResponseDTO<ProductDTO> getEventList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<Integer> eventFilters, String sortOrder, Integer userId);
}
