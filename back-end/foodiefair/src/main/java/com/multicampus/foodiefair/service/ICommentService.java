package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.CommentDTO;

import java.util.List;

public interface ICommentService {
    int commentInsert(CommentDTO commentDTO);
    int commentDelete(int CommentId);
    List<CommentDTO> commentRead(String productName, int userId);
}
