package com.multicampus.foodiefair;

import com.multicampus.foodiefair.dao.ICommentDAO;
import com.multicampus.foodiefair.dao.IProductDAO;
import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
class FoodiefairApplicationTests {
    @Autowired
    IProductDAO iProductDAO;
    @Autowired
    IReviewDAO iReviewDAO;
    @Autowired
    ICommentDAO iCommentDAO;

    @Test
    void findProductId() {
        String productName="productName 05";
        String productId = iProductDAO.findProductId(productName);
        log.info(productId);
    }

    @Test
    void findReviewId() {
        String productId="AC1234";
        int userId=4;
        int reviewId = iReviewDAO.findReviewId(productId, userId);
        log.info(reviewId);
    }

    @Test
    void findComment() {
        int reviewId=5;
        List<CommentDTO> commentDTOList = iCommentDAO.commentRead(reviewId);
        for (CommentDTO commentDTO : commentDTOList) {
            log.info(commentDTO.getCommentContent());
        }
    }
}