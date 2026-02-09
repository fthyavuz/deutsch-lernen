
package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminQuizQuestionRequestDTO {

    private Long lessonId;

    private QuizQuestionType type;
    private String question;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String matchingPairs;

    private String correctAnswer;

}