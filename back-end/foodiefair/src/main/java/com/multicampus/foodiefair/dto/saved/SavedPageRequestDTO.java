package com.multicampus.foodiefair.dto.saved;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavedPageRequestDTO {
    @Builder.Default
    @Min(value = 1)
    @Positive
    private int page=1;
    @Builder.Default
    private int size=15;
}
