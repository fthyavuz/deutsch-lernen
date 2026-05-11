package com.fatih.germanapp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarTopicRequestDTO {
    private Long lessonId;
    private String name;
}
