package com.multicampus.foodiefair.dao;

import com.multicampus.foodiefair.dto.visited.VisitedDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Mapper
public interface VisitedDAO {

    // 방명록 리스트 출력
    ArrayList<HashMap<String, Object>> selectVisitedList(Map<String, Object> paramMap);
    // 방명록 갯수 (페이징용)
    int countVisitedList(Map<String, Object> paramMap);
    // 방명록 등록
    int insertVisited(Map<String, Object> paramMap);
    // 방명록 삭제 (작성 회원 + 페이지 소유자)
    int deleteVisited(Map<String, Object> paramMap);
}
