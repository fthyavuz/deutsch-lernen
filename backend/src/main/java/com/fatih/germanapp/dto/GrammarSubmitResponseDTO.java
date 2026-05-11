package com.fatih.germanapp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarSubmitResponseDTO {
    private boolean correct;
    private String correctAnswer;
}
