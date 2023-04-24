package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dao.CommentDAO;
import com.multicampus.foodiefair.dto.CommentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentDAO commentDAO;

    @Override
    public void commentInsert(CommentDTO commentDTO) {
        log.info("CommentServiceInsert");

    }

    @Override
    public void commentDelete(int CommentId) {

    }
}
