package com.multicampus.foodiefair.dao.dashboard;

import com.multicampus.foodiefair.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IDashCommentDAO {
    //댓글 읽기
    public CommentDTO readDao(Map<String, Object> paramMap);

    //댓글 삭제
    public int deleteDao(Map<String, Object> paramMap);

    //댓글 리스트 출력
    public List<CommentDTO> selectDashCommentList(Map<String, Object> paramMap);
    public int getDashCommentCount(Map<String, Object> paramMap);
}
