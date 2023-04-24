package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ICommentDAO {
    int commentInsert(CommentDTO commentDTO);
    int commentDelete(int CommentId);
}
