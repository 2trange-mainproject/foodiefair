package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.CommentDTO;

import java.util.List;
import java.util.Map;

public interface ICommentService {
    int registerComment(CommentDTO commentDTO);
    int commentDelete(int commentId);
    List<Map<String, Object>> commentRead(int reviewId);
}
