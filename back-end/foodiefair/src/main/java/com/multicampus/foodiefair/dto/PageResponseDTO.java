package com.multicampus.foodiefair.dto;

import java.util.List;

public class PageResponseDTO {
    private int page;
    private int size;
    private int total;
//    private int start;
//    private int end;
//    private boolean prev;
//    private boolean next;
    private List<ReviewDTO> reviewList;
}
