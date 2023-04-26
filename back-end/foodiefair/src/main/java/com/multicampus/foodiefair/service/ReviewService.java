package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IProductDAO;
import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class ReviewService implements IReviewService{
    private final IReviewDAO iReviewDAO;
    private final IProductDAO iProductDAO;

    @Override
    public ProductDTO productInfo(String productId) {
        return iProductDAO.productInfo(productId);
    }

    @Override
    public int reviewInsert(ReviewDTO reviewDTO) {
        log.info("reviewInsertService");
        return iReviewDAO.reviewInsert(reviewDTO);
    }

    @Override
    public int reviewDelete() {
        return 0;
    }

    @Override
    public int reviewModify() {
        return 0;
    }

    @Override
    public int reviewRead() {
        return 0;
    }
}
