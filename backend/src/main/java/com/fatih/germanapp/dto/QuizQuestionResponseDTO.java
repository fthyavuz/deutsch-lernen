package com.fatih.germanapp.dto;

import com.fatih.germanapp.model.QuizType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizQuestionResponseDTO {
    private Long id;
    private String question;
    private QuizType type;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

}
