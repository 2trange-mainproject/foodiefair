package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.PageRequestDTO;
import com.multicampus.foodiefair.dto.PageResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.service.IEventService;
import com.multicampus.foodiefair.service.IProductService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class ProductController {
    @Autowired
    private IProductService productService;

    @Autowired
    private IEventService eventService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // Read
    @GetMapping("/product-read/{productId}")
    public ResponseEntity<Map<String, Object>> ProductRead(
            @PathVariable("productId") String productId) {
        logger.info(productId);

        productService.update(productId);                       //해당 상품 조회수 1 올리기
        ProductDTO product = productService.read(productId);    //상품 읽기

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        String objectKey = product.getProductImg();
        logger.info(objectKey);
        String url = s3Client.getProductUrl(objectKey, 3600);
        product.setProductImg(url);
        logger.info(product.getProductImg());

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("productRead", product);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/food-list")
    public ResponseEntity<Map<String, Object>> foodList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "15"));
        List<String> storeFilters = Arrays.stream(requestParams.getOrDefault("stores", "").replaceAll("\\[|\\]", "").split(","))
                .map(s -> s.replaceAll("\"", ""))
                .collect(Collectors.toList());
        List<String> categoryFilters = Arrays.stream(requestParams.getOrDefault("categories", "").replaceAll("\\[|\\]", "").split(","))
                .map(s -> s.replaceAll("\"", ""))
                .collect(Collectors.toList());
        logger.info("storeFilters : {}", storeFilters);
        logger.info("categoryFilters : {}", categoryFilters);
        String sortOrder = requestParams.get("sortOrder");
        String searchKeyword = requestParams.get("searchKeyword");
        logger.info("searchKeyword : {}", searchKeyword);

        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .storeFilters(storeFilters)
                .categoryFilters(categoryFilters)
                .build();

        PageResponseDTO<ProductDTO> pageResponseDTO = productService.getFilteredList(pageRequestDTO, storeFilters, categoryFilters, sortOrder, searchKeyword);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        for (ProductDTO product : pageResponseDTO.getDtoList()) {
            String objectKey = product.getProductImg();
            String url = s3Client.getProductUrl(objectKey, 3600); // 이미지 파일에 대한 SignedUrl을 생성
            product.setProductImg(url);
        }

        int totalCount = pageResponseDTO.getTotal();

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", totalCount);
        resultMap.put("dtoList", pageResponseDTO.getDtoList());
        resultMap.put("page", page);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/event-list")
    public ResponseEntity<Map<String, Object>> eventList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "15"));
        List<String> storeFilters = Arrays.stream(requestParams.getOrDefault("stores", "").replaceAll("\\[|\\]", "").split(","))
                .map(s -> s.replaceAll("\"", ""))
                .collect(Collectors.toList());
        List<String> eventFiltersStrings = Arrays.asList(requestParams.getOrDefault("events", "").split(","));
        List<Integer> eventFilters = eventFiltersStrings.stream().map(s -> s.replaceAll("\\[|\\]", "")).map(Integer::parseInt).collect(Collectors.toList());
        String sortOrder = requestParams.get("sortOrder");

        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .storeFilters(storeFilters)
                .eventFilters(eventFilters)
                .build();

        PageResponseDTO<ProductDTO> pageResponseDTO = eventService.getEventList(pageRequestDTO, storeFilters, eventFilters, sortOrder);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        for (ProductDTO product : pageResponseDTO.getDtoList()) {
            String objectKey = product.getProductImg();
            String url = s3Client.getProductUrl(objectKey, 3600); // 이미지 파일에 대한 SignedUrl을 생성
            product.setProductImg(url);
        }

        int totalCount = pageResponseDTO.getTotal();
        int filteredCount = totalCount; // 필터링된 상품 개수를 계산합니다.

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", totalCount);
        resultMap.put("totalFiltered", filteredCount);
        resultMap.put("dtoList", pageResponseDTO.getDtoList());
        resultMap.put("page", page);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
