package com.multicampus.foodiefair.service;

import com.multicampus.foodiefair.dto.CommentDTO;

import java.util.List;
import java.util.Map;

public interface ICommentService {
    int commentInsert(CommentDTO commentDTO);
    int commentDelete(int CommentId);
    List<Map<String, Object>> commentRead(int reviewId);
}
