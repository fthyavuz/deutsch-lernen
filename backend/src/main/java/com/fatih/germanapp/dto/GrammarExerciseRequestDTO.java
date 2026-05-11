package com.fatih.germanapp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarExerciseRequestDTO {
    private Long topicId;
    private int orderIndex;
    private String sentence;
    private String answer;
    private String hint;
}
