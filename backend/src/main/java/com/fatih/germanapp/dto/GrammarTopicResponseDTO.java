package com.fatih.germanapp.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarTopicResponseDTO {
    private Long id;
    private Long lessonId;
    private String name;
    private List<GrammarCardDTO> cards;
    private List<GrammarExerciseDTO> exercises;
}
