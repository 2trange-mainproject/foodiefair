/*
package com.multicampus.apitest;

import com.multicampus.apitest.dto.PageRequestDTO;
import com.multicampus.apitest.dto.PageResponseDTO;
import com.multicampus.apitest.dto.ProductDTO;
import com.multicampus.apitest.service.IProductService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
@Log4j2
public class ProductControllerTest {

    @Autowired
    private IProductService productService;

    @Test
    public void testFilteredList() {
        // 조건에 따른 페이징이 잘 작동하는지 확인하기 위한 테스트
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(1)
                .size(15)
                .build();
        List<String> storeFilters = Arrays.asList("GS25");
        Integer festivalFilter = 3;

        PageResponseDTO<ProductDTO> pageResponseDTO = productService.getFilteredList(pageRequestDTO, storeFilters, festivalFilter);

        // 페이지에 상품이 출력되는지 확인
        assertNotEquals(0, pageResponseDTO.getDtoList().size(), "상품이 페이지에 출력되지 않음");

        // 페이지에 출력되는 상품이 조건에 맞게 필터되었는지 확인
        for (ProductDTO productDTO : pageResponseDTO.getDtoList()) {
            boolean matchFilter = false;
            for (String filter : storeFilters) {
                if (productDTO.getFixedTag().contains(filter)) {
                    matchFilter = true;
                    break;
                }
            }
            assert matchFilter : "필터링된 상품이 조건에 맞지 않음";
            log.info("상품 ID: {}, 상품명: {}, FixedTag: {}", productDTO.getProductId(), productDTO.getProductName(), productDTO.getFixedTag());
        }
    }
}
*/
