package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ICommentDAO {
    int commentInsert(CommentDTO commentDTO);
    int commentDelete(int CommentId);
    List<CommentDTO> commentRead(int reviewId);
}
