package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizSubmitRequestDTO {
    private Long questionId;
    private String selectedAnswer;
}