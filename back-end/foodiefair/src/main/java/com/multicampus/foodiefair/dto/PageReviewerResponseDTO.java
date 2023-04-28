package com.multicampus.foodiefair.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class PageReviewerResponseDTO<E> {
    private int page;
    private int size;
    private int total;
    //시작페이지 번호
    private int start;
    //끝페이지 번호
    private int end;
    //이전페이지의 존재 여부
    private boolean prev;
    //다음페이지의 존재 여부
    private boolean next;
    private List<E> dtoList;
    @Builder(builderMethodName = "withAll")
    public PageReviewerResponseDTO(PageReviewerRequestDTO pageReviewerRequestDto, List<E> dtoList, int total){
        this.page = pageReviewerRequestDto.getPage();
        this.size = pageReviewerRequestDto.getSize();
        this.total = total;
        this.dtoList = dtoList;
        this.end = (int)(Math.ceil(this.page / 12.0 )) * 12;
        this.start = this.end - 11;
        int last = (int)(Math.ceil((total/(double)size)));
        this.end = Math.min(end, last);
        this.prev = this.start > 1;
        this.next = total > this.end * this.size;
    }
}
