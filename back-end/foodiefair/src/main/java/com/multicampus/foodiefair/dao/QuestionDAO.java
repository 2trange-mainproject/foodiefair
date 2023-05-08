package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.QuestionDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionDAO {
    void insertQuestion(QuestionDTO question);
}