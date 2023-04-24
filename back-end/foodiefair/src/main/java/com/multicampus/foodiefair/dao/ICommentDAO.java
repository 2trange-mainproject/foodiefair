package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ICommentDAO {
    public int commentInsert(CommentDTO commentDTO);
    public int commentDelete(int CommentId);
}
