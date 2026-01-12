package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonSummaryResponseDTO {
    private Long id;
    private String title;
    private String description;
    private int lessonOrder;
}
