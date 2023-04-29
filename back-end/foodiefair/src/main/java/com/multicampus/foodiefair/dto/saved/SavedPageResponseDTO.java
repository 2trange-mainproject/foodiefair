package com.multicampus.foodiefair.dto.saved;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import java.util.ArrayList;
import java.util.HashMap;

@Getter
@ToString
public class SavedPageResponseDTO {
    private final ArrayList<HashMap<String, Object>> dataList;    // 페이지에 표시될 데이터 목록
    private int page;            // 현재 페이지 번호
    private int size;            // 한 페이지에 표시할 데이터 수
    private int totalPages;      // 전체 페이지 수
    private int startPage;       // 시작 페이지 번호
    private int endPage;         // 마지막 페이지 번호
    private boolean prev;        // 이전 페이지 존재 여부
    private boolean next;        // 다음 페이지 존재 여부

    @Builder(builderMethodName = "withAll")
    public SavedPageResponseDTO(SavedPageRequestDTO pageRequestDto, ArrayList<HashMap<String, Object>> dataList, int total) {
        this.page = pageRequestDto.getPage();
        this.size = pageRequestDto.getSize();
        this.totalPages = (int) (Math.ceil((double)total / 15.0));
        this.dataList = dataList;
        this.endPage = (int) (Math.ceil(this.page / 15.0)) * 15;
        this.startPage = this.endPage - 14;
        int last = (int) (Math.ceil((total / (double) size)));
        this.endPage = Math.min(endPage, last);
        this.prev = this.startPage > 1;
        this.next = total > this.endPage * this.size;
    }
}
