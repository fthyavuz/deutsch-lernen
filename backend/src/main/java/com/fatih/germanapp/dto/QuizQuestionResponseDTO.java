package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizQuestionResponseDTO {
    private Long id;
    private String question;
    private QuizQuestionType type;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private String matchingPairs;

}
