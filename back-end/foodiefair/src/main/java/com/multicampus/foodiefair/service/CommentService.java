package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ICommentDAO;
import com.multicampus.foodiefair.dao.IProductDAO;
import com.multicampus.foodiefair.dao.IReviewDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Log4j2
@RequiredArgsConstructor
@Service
public class CommentService implements ICommentService {
    private final ICommentDAO iCommentDAO;
    private final IProductDAO iProductDAO;
    private final IReviewDAO iReviewDAO;

    @Override
    public int commentInsert(CommentDTO commentDTO) {
        log.info("CommentServiceInsert");
        return iCommentDAO.commentInsert(commentDTO);
    }

    @Override
    public int commentDelete(int CommentId) {
        log.info("CommentServiceDelete");
        return iCommentDAO.commentDelete(CommentId);
    }

    @Override
    public List<CommentDTO> commentRead(String productName, int userId) { // 리펙토링 테이블 조인해서 resultMap 사용하기.
        log.info("commentRead");
        String productId = iProductDAO.findProductId(productName);
        int reviewId = iReviewDAO.findReviewId(productId, userId);

        return iCommentDAO.commentRead(reviewId);
    }
}
