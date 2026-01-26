package com.fatih.germanapp.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProgressResponseDTO {
    private Long lessonId;
    private String LessonTitle;
    private int score;
    private boolean completed;
    private LocalDateTime completedAt;
}
