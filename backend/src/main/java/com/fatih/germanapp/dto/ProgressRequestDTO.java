package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProgressRequestDTO {
    private Long lessonId;
    private Long userId;
    private int score;
    private boolean completed;

}
