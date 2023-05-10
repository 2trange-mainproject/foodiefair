package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.PageRequestDTO;
import com.multicampus.foodiefair.dto.PageResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;

import java.util.List;

public interface IProductService {
    // 상품 읽기
    public ProductDTO read(String selectedId);

    public int update(String selectedId);
    
    // 리스트 출력
    public List<ProductDTO> selectFilteredList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder, String searchKeyword, Integer userId);
    public int getFilteredCount(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder, String searchKeyword, Integer userId);

    PageResponseDTO<ProductDTO> getFilteredList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder, String searchKeyword, Integer userId);
}
