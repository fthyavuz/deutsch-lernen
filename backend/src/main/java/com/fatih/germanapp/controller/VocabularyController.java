package com.fatih.germanapp.controller;

import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.VocabularyDTO;
import com.fatih.germanapp.model.ExampleSentence;
import com.fatih.germanapp.model.Vocabulary;
import com.fatih.germanapp.repository.ExampleSentenceRepository;
import com.fatih.germanapp.repository.VocabularyRepository;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/vocabularies")
public class VocabularyController {

    private final VocabularyRepository vocabularyRepository;
    private final ExampleSentenceRepository exampleSentenceRepository;

    public VocabularyController(VocabularyRepository vocabularyRepository,
            ExampleSentenceRepository exampleSentenceRepository) {
        this.vocabularyRepository = vocabularyRepository;
        this.exampleSentenceRepository = exampleSentenceRepository;
    }

    // GET vocabularies for a lesson
    @GetMapping("/lesson/{lessonId}")
    public List<VocabularyDTO> getVocabulariesByLesson(@PathVariable Long lessonId) {

        List<Vocabulary> vocabularies = vocabularyRepository.findByLessonId(lessonId);

        // Convert to DTO
        return vocabularies.stream().map(v -> {
            List<ExampleSentence> sentences = exampleSentenceRepository.findByVocabularyId(v.getId());
            return new VocabularyDTO(v, sentences);
        }).toList();
    }
}
