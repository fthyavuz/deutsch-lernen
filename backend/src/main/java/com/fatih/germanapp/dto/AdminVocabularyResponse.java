package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminVocabularyResponse {

    private Long id;

    private String germanWord;
    private String englishMeaning;
    private String turkishMeaning;

    private String germanExplanation;
    private String relatedWords;
}
