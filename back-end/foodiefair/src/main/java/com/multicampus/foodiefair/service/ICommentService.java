package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.CommentDTO;

public interface ICommentService {
    public int commentInsert(CommentDTO commentDTO);
    public int commentDelete(int CommentId);
}
