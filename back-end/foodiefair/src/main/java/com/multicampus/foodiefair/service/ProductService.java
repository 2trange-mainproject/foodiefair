package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IProductDAO;
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
public class ProductService implements IProductService {
    private final IProductDAO dao;

    private final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Override
    public List<ProductDTO> selectFilteredList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageRequestDto", pageRequestDto);
        paramMap.put("storeFilters", storeFilters);
        paramMap.put("categoryFilters", categoryFilters);
        paramMap.put("sortOrder", sortOrder);

        return dao.selectFilteredList(paramMap);
    }

    @Override
    public int getFilteredCount(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageRequestDto", pageRequestDto);
        paramMap.put("storeFilters", storeFilters);
        paramMap.put("categoryFilters", categoryFilters);
        paramMap.put("sortOrder", sortOrder);

        return dao.getFilteredCount(paramMap);
    }

    @Override
    public PageResponseDTO<ProductDTO> getFilteredList(PageRequestDTO pageRequestDto, List<String> storeFilters, List<String> categoryFilters, String sortOrder) {
        List<ProductDTO> DtoList = selectFilteredList(pageRequestDto, storeFilters, categoryFilters, sortOrder);
        int total = getFilteredCount(pageRequestDto, storeFilters, categoryFilters, sortOrder);

        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageRequestDto(pageRequestDto)
                .build();
    }
}
