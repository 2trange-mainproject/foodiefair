package com.multicampus.foodiefair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
    @Builder.Default
    @Min(value = 1)
    @Positive
    private int page = 1;
    @Builder.Default
    @Min(value = 15)
    @Max(value = 100)
    @Positive
    private int size = 15;

    private List<String> storeFilters;
    private List<Integer> eventFilters;
    private List<String> categoryFilters;

    // 페이징에 finished를 위해 추가한 부분
    @Builder.Default
    private boolean finished = false;

    @Builder.Default
    private String keyword = "";

    @Builder.Default
    private String from = "";

    @Builder.Default
    private String to = "";

    public int getSkip() {
        return (page - 1) * size;
    }

}
