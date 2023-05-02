package com.multicampus.foodiefair.service.dashboard;

import com.multicampus.foodiefair.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface IDashProductService {
    // 상품 읽기
    public ProductDTO read(String selectedId);

    //상품 추가
    public int insert(String productId, String productName, Integer productPrice, String productFestival, String productTag, String productImg);
    
    // 상품 삭제
    public int delete(String selectedId);

    //상품 수정
    public int update(String productId, String productName, Integer productPrice, String productFestival, String productTag);

    // 리스트 출력
    public List<ProductDTO> selectDashProductList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
    public int getDashProductCount(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);

    PageReviewerResponseDTO<ProductDTO> getDashProductList(PageReviewerRequestDTO pageReviewerRequestDto, String sortOrder, String searchKeyword);
}
