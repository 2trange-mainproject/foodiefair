package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.ProductDTO;

public interface IProductService {
    ProductDTO productInfo(String productId);
}
