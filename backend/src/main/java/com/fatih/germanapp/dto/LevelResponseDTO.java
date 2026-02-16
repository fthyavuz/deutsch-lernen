package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class LevelResponseDTO {
    private Long id;
    private String code;
    private String title;
    private String description;
    private int displayOrder;
    private List<LessonSummaryResponseDTO> lessons;
}
