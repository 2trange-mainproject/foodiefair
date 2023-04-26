package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IProductDAO {
    String findProductId(String productName); //안 써도 될 거 같음
    ProductDTO productInfo(String productId);
}
