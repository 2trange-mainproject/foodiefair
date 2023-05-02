package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.service.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
@Log4j2
@RequiredArgsConstructor
public class ProductController {
    private final IProductService iProductService;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> productInfo(@PathVariable String productId) {
        log.info("productInfo");
        return ResponseEntity.ok(iProductService.productInfo(productId));
    }
}
