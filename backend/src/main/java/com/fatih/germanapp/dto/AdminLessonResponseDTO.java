package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLessonResponseDTO {
    private Long id;
    private String title;
    private String description;
    private int lessonOrder;
    private Long levelId;
    private String levelCode;
}
