package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminVocabularyRequest {

    private Long lessonId;

    private String germanWord;
    private String englishMeaning;
    private String turkishMeaning;

    private String germanExplanation;
    private String relatedWords;
}
