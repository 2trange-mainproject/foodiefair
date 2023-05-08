package com.multicampus.foodiefair.dao.dashboard;

import com.multicampus.foodiefair.dto.QuestionDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface IDashQuestionDAO {
    //댓글 읽기
    public QuestionDTO readDao(Map<String, Object> paramMap);

    //댓글 삭제
    public int deleteDao(Map<String, Object> paramMap);

    //댓글 리스트 출력
    public List<QuestionDTO> selectDashQuestionList(Map<String, Object> paramMap);
    public int getDashQuestionCount(Map<String, Object> paramMap);
}
