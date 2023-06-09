package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ICommentDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@Service
public class CommentService implements ICommentService {
    private final ICommentDAO iCommentDAO;

    @Override
    public int registerComment(CommentDTO commentDTO) {
        log.info("CommentServiceInsert");
        int result = iCommentDAO.registerComment(commentDTO);
        if(result > 0) {
            return iCommentDAO.reviewCommentCount(commentDTO.getReviewId());
        }
        return result;
    }

    @Override
    public int commentDelete(long commentId) {
        log.info("CommentServiceDelete");
        int reviewId = iCommentDAO.findReviewId(commentId);
        iCommentDAO.commentDelete(commentId);
        return iCommentDAO.reviewCommentCount(reviewId);
    }

    @Override
    public List<Map<String, Object>> commentRead(long reviewId) {
        log.info("commentRead");
        return iCommentDAO.commentRead(reviewId);
    }
}
