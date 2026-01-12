package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizSubmitResponse {
    private Long questionId;

    private String correctAnswer;
    private boolean isCorrect;
}
