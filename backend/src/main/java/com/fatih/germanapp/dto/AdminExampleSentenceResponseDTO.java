package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminExampleSentenceResponseDTO {
    private Long id;
    private String germanSentence;
    private String englishTranslation;
    private String turkishTranslation;
}
