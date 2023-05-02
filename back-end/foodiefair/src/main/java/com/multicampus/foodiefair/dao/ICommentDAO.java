package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ICommentDAO {
    int commentInsert(CommentDTO commentDTO);
    int commentDelete(int commentId);
    List<Map<String, Object>> commentRead(int reviewId);
}
