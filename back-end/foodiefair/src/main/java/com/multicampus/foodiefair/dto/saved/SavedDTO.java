package com.multicampus.foodiefair.dto.saved;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SavedDTO {
    private Long savedId;
    private Integer userId;
    private String productId;
    private Date savedDate;

}
