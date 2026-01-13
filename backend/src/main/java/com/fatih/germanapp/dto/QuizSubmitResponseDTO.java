package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizSubmitResponseDTO {
    private Long questionId;

    private String correctAnswer;
    private boolean isCorrect;
}
