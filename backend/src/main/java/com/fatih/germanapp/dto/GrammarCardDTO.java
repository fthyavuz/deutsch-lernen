package com.fatih.germanapp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarCardDTO {
    private Long id;
    private int orderIndex;
    private String title;
    private String explanation;
    private String examples;
}
