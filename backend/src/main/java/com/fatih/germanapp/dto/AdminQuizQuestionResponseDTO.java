package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminQuizQuestionResponseDTO {
    private Long id;
    private QuizQuestionType type;
    private String question;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String matchingPairs;

    private String correctAnswer;
}
