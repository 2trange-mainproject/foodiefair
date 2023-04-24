package com.multicampus.foodiefair.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Getter
@Setter
public class SaveDTO {
    private int saveId;
    @NotNull
    private String userId;
    @NotNull
    private String productId;
    private LocalDate saveDate;
}
