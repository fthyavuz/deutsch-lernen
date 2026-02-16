package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLessonRequestDTO {
    private String title;
    private String description;
    private int lessonOrder;
    private Long levelId;
}
