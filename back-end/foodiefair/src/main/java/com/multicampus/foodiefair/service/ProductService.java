package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IProductDAO;
import com.multicampus.foodiefair.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final IProductDAO iProductDAO;

    @Override
    public ProductDTO productInfo(String productId) {
        return iProductDAO.productInfo(productId);
    }
}
