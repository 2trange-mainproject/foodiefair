package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.CommentDTO;

public interface ICommentService {
    int commentInsert(CommentDTO commentDTO);
    int commentDelete(int CommentId);
}
