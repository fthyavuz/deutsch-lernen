package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminExampleSentenceRequestDTO {
    private Long vocabularyId;

    private String germanSentence;
    private String englishTranslation;
    private String turkishTranslation;
}
