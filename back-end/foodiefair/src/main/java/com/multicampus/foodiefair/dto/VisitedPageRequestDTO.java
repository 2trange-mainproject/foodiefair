package com.multicampus.foodiefair.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisitedPageRequestDTO {
    @Builder.Default
    @Min(value = 1)
    @Positive
    private int page=1;
    @Builder.Default
    @Min(value = 5)
    @Max(value = 100)
    private int size=5;
}
