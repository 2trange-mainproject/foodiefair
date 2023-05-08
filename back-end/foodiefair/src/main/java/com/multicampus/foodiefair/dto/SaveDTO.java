package com.multicampus.foodiefair.dto;

import lombok.Data;

import java.util.Date;

@Data
public class SaveDTO {
    private long saveId;
    private int userId;
    private String productId;
    private Date saveDate;
}
