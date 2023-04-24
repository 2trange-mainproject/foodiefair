package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.CommentDTO;

public interface CommentService {
    public void commentInsert(CommentDTO commentDTO);
    public void commentDelete(int CommentId);
}
