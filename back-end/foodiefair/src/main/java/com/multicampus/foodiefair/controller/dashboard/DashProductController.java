package com.multicampus.foodiefair.controller.dashboard;

import com.multicampus.foodiefair.controller.S3Client;
import com.multicampus.foodiefair.dto.PageReviewerRequestDTO;
import com.multicampus.foodiefair.dto.PageReviewerResponseDTO;
import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.service.dashboard.IDashProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.File;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/dashboard")
public class DashProductController {
    @Autowired
    private IDashProductService dashProductService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    //MultipartFile을 File로 변환하는 메서드
    public File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        Path tempDir = Files.createTempDirectory("");
        File file = new File(tempDir.toFile(), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    // Create
    @PostMapping("/product-add")
    public ResponseEntity<String> addProduct(
            @RequestParam("productId") String productId,
            @RequestParam("productName") String productName,
            @RequestParam("productPrice") int productPrice,
            @RequestParam("productFestival") String productFestival,
            @RequestParam("productTag") String productTag,
            @RequestParam("productImg") MultipartFile productImg) {

        try {
            // 이미지를 네이버 클라우드 플랫폼 버킷에 올림.
            File file = convertMultipartFileToFile(productImg);
            S3Client s3Client = new S3Client();
            String objectKey = productImg.getOriginalFilename();
            String imageUrl = s3Client.uploadFile(file, objectKey);
            logger.info(imageUrl);

            // imageUrl을 데이터베이스에 저장. (ProductDTO와 IDashProductService 사용)
            dashProductService.insert(productId, productName, productPrice, productFestival, productTag, objectKey);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }

        // 처리 코드 작성
        return ResponseEntity.ok("success");
    }

    // Delete
    @DeleteMapping("/product-delete/{productId}")
    public ResponseEntity<String> productDelete(
            @PathVariable("productId") String productId) {

        dashProductService.delete(productId);

        return ResponseEntity.ok("success");
    }

    // Update
    @PutMapping("/product-update/{productId}")
    public ResponseEntity<String> productUpdatePost(
            @PathVariable("productId") String productId,
            @RequestParam("updatedProductName") String productName,
            @RequestParam("updatedProductPrice") int productPrice,
            @RequestParam("updatedProductFestival") String productFestival,
            @RequestParam("updatedProductTagJson") String productTag) {

        dashProductService.update(productId, productName, productPrice, productFestival, productTag);

        // 처리 코드 작성
        return ResponseEntity.ok("success");
    }

    // Read
    @GetMapping("/product-read/{productId}")
    public ResponseEntity<Map<String, Object>> ProductRead(
            @PathVariable("productId") String productId) {

        ProductDTO product = dashProductService.read(productId);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        String objectKey = product.getProductImg();
        String url = s3Client.getProductUrl(objectKey, 3600);
        product.setProductImg(url);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("productRead", product);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    // 리스트 출력
    @GetMapping("/product-list")
    public ResponseEntity<Map<String, Object>> ProductList(
            @RequestParam Map<String, String> requestParams) {
        int page = Integer.parseInt(requestParams.getOrDefault("page", "1"));
        int size = Integer.parseInt(requestParams.getOrDefault("size", "12"));
        String sortOrder = requestParams.get("sortOrder");
        String searchKeyword = requestParams.get("searchKeyword");

        PageReviewerRequestDTO pageReviewerRequestDTO = PageReviewerRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        PageReviewerResponseDTO<ProductDTO> pageReviewerResponseDTO = dashProductService.getDashProductList(pageReviewerRequestDTO, sortOrder, searchKeyword);

        // 파일 URL 생성
        S3Client s3Client = new S3Client();
        for (ProductDTO product : pageReviewerResponseDTO.getDtoList()) {
            String objectKey = product.getProductImg();
            String url = s3Client.getProductUrl(objectKey, 3600);
            product.setProductImg(url);
        }

        int totalCount = pageReviewerResponseDTO.getTotal();

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", totalCount);
        resultMap.put("dtoList", pageReviewerResponseDTO.getDtoList());
        resultMap.put("page", page);
        logger.info("ResultMap: {}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

}
