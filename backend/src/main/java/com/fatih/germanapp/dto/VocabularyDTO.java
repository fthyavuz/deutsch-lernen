package com.fatih.germanapp.dto;

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
    private List<ExampleSentenceDTO> exampleSentences;

    public VocabularyDTO(Vocabulary vocabulary, List<com.fatih.germanapp.model.ExampleSentence> sentences) {
        this.id = vocabulary.getId();
        this.germanWord = vocabulary.getGermanWord();
        this.englishMeaning = vocabulary.getEnglishMeaning();
        this.turkishMeaning = vocabulary.getTurkishMeaning();
        this.germanExplanation = vocabulary.getGermanExplanation();
        this.relatedWords = vocabulary.getRelatedWords();

        if (sentences != null) {
            this.exampleSentences = sentences.stream().map(s -> {
                ExampleSentenceDTO dto = new ExampleSentenceDTO();
                dto.setId(s.getId());
                dto.setGermanSentence(s.getGermanSentence());
                dto.setEnglishTranslation(s.getEnglishTranslation());
                dto.setTurkishTranslation(s.getTurkishTranslation());
                return dto;
            }).collect(java.util.stream.Collectors.toList());
        }
    }
}
