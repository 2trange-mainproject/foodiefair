package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.PageRequestDTO;
import com.multicampus.foodiefair.dto.PageResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;

import java.util.List;

public interface IProductService {
    public List<ProductDTO> selectFilteredList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder);
    public int getFilteredCount(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder);

    PageResponseDTO<ProductDTO> getFilteredList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder);
}
