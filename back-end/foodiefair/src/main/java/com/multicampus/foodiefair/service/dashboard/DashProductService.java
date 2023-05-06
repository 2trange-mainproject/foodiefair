package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dao.dashboard.IDashProductDAO;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashProductService implements IDashProductService {
    private final IDashProductDAO dao;

    @Override
    public ProductDTO read(String selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.readDao(paramMap);
    }

    @Override
    public int insert(String productId, String productName, int productPrice, String productFestival, String productTag, String productImg) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("productName", productName);
        paramMap.put("productPrice", productPrice);
        paramMap.put("productFestival", productFestival);
        paramMap.put("productTag", productTag);
        paramMap.put("productImg", productImg);

        return dao.insertDao(paramMap);
    }

    @Override
    public int delete(String selectedId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("selectedId", selectedId);

        return dao.deleteDao(paramMap);
    }

    @Override
    public int update(String productId, String productName, int productPrice, String productFestival, String productTag) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("productName", productName);
        paramMap.put("productPrice", productPrice);
        paramMap.put("productFestival", productFestival);
        paramMap.put("productTag", productTag);

        return dao.updateDao(paramMap);
    }

    @Override
    public List<ProductDTO> selectDashProductList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.selectDashProductList(paramMap);
    }

    @Override
    public int getDashProductCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("pageReviewerRequestDto", pageReviewerRequestDto);
        paramMap.put("sortOrder", sortOrder);
        paramMap.put("searchKeyword", searchKeyword);

        return dao.getDashProductCount(paramMap);
    }

    @Override
    public PageReviewerResponseDTO<ProductDTO> getDashProductList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword) {
        List<ProductDTO> DtoList = selectDashProductList(pageReviewerRequestDto, sortOrder, searchKeyword);
        int total = getDashProductCount(pageReviewerRequestDto, sortOrder, searchKeyword);

        return PageReviewerResponseDTO.<ProductDTO>withAll()
                .dtoList(DtoList)
                .total(total)
                .pageReviewerRequestDto(pageReviewerRequestDto)
                .build();
    }
}
