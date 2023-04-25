package com.multicampus.foodiefair.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Getter
@Setter
public class ReviewDTO {
    private int reviewId;
    private int userId;
    private String productId;
    private int reviewLikes;
    private LocalDate reviewDate;
    @NotNull
    private String reviewTitle;
    @Size(min = 20)
    private String goodReviews;
    @Size(min = 20)
    private String badReviews;
    private boolean receiptImg;
    private String reviewImg;
}
