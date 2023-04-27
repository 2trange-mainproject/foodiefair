package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.IProductDAO;
import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.dto.ReviewDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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
    public List<Map<String, Object>> reviewRead(String productId, int offset, int receiptImg, int sort) {
        if(sort==0)
            return iReviewDAO.DateReviewRead(productId, offset, receiptImg);
        else
            return iReviewDAO.LikeReviewRead(productId, offset, receiptImg);
    }
}
