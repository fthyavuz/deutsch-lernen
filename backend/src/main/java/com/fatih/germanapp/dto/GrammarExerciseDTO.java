package com.fatih.germanapp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarExerciseDTO {
    private Long id;
    private int orderIndex;
    private String sentence;
    private String hint;
}
