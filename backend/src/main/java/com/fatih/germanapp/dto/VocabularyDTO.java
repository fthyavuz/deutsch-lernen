package com.fatih.germanapp.dto;

import com.fatih.germanapp.model.ExampleSentence;
import com.fatih.germanapp.model.Vocabulary;
import lombok.Data;
import java.util.List;

@Data
public class VocabularyDTO {
    private Long id;
    private String germanWord;
    private String englishMeaning;
    private String turkishMeaning;
    private String germanExplanation;
    private String relatedWords;
    private List<ExampleSentence> exampleSentences;

    public VocabularyDTO(Vocabulary vocabulary, List<ExampleSentence> sentences) {
        this.id = vocabulary.getId();
        this.germanWord = vocabulary.getGermanWord();
        this.englishMeaning = vocabulary.getEnglishMeaning();
        this.turkishMeaning = vocabulary.getTurkishMeaning();
        this.germanExplanation = vocabulary.getGermanExplanation();
        this.relatedWords = vocabulary.getRelatedWords();
        this.exampleSentences = sentences;
    }
}
