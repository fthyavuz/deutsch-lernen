package com.fatih.germanapp.dto;

import lombok.Data;

@Data
public class QuizQuestionImportDTO {
    private QuizQuestionType type;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String matchingPairs;
    private String correctAnswer;
}
