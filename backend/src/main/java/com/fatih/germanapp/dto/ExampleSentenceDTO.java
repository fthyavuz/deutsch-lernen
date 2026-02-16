package com.fatih.germanapp.dto;

import lombok.Data;

@Data
public class ExampleSentenceDTO {
    private Long id;
    private String germanSentence;
    private String englishTranslation;
    private String turkishTranslation;
}
