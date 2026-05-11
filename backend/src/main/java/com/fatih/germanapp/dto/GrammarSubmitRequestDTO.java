package com.fatih.germanapp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarSubmitRequestDTO {
    private Long exerciseId;
    private String userAnswer;
}
