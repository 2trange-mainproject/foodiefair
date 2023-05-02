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
    public int commentInsert(CommentDTO commentDTO) {
        log.info("CommentServiceInsert");
        return iCommentDAO.commentInsert(commentDTO);
    }

    @Override
    public int commentDelete(int commentId) {
        log.info("CommentServiceDelete");
        return iCommentDAO.commentDelete(commentId);
    }

    @Override
    public List<Map<String, Object>> commentRead(int reviewId) {
        log.info("commentRead");
        return iCommentDAO.commentRead(reviewId);
    }
}
