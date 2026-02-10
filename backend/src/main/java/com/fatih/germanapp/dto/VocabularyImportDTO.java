package com.fatih.germanapp.dto;

import java.util.List;
import lombok.Data;

@Data
public class VocabularyImportDTO {
    private String germanWord;
    private String englishMeaning;
    private String turkishMeaning;
    private String germanExplanation;
    private String relatedWords;
    private List<ExampleSentenceImportDTO> exampleSentences;
}
