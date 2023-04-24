package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.ICommentDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Log4j2
@RequiredArgsConstructor
@Service
public class CommentService implements ICommentService {
    private final ICommentDAO icommentDAO;

    @Override
    public int commentInsert(CommentDTO commentDTO) {
        log.info("CommentServiceInsert");
        log.info(commentDTO.getCommentId());
        log.info(commentDTO.getWriterId());
        log.info(commentDTO.getReviewerId());
        log.info(commentDTO.getComment());
        return icommentDAO.commentInsert(commentDTO);
    }

    @Override
    public int commentDelete(int CommentId) {
        log.info("CommentServiceDelete");
        log.info(CommentId);
        return icommentDAO.commentDelete(CommentId);
    }
}
