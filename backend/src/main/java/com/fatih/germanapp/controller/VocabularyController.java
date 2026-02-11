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

import lombok.extern.slf4j.Slf4j;
import com.fatih.germanapp.exception.ResourceNotFoundException;
import com.fatih.germanapp.repository.LessonRepository;

@Slf4j
@RestController
@RequestMapping("/api/vocabularies")
public class VocabularyController {

    private final VocabularyRepository vocabularyRepository;
    private final ExampleSentenceRepository exampleSentenceRepository;
    private final LessonRepository lessonRepository;

    public VocabularyController(VocabularyRepository vocabularyRepository,
            ExampleSentenceRepository exampleSentenceRepository,
            LessonRepository lessonRepository) {
        this.vocabularyRepository = vocabularyRepository;
        this.exampleSentenceRepository = exampleSentenceRepository;
        this.lessonRepository = lessonRepository;
    }

    // GET vocabularies for a lesson
    @GetMapping("/lesson/{lessonId}")
    public List<VocabularyDTO> getVocabulariesByLesson(@PathVariable Long lessonId) {
        log.info("Fetching vocabularies for lesson id: {}", lessonId);

        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson with id " + lessonId + " not found");
        }

        List<Vocabulary> vocabularies = vocabularyRepository.findByLessonId(lessonId);

        // Convert to DTO
        return vocabularies.stream().map(v -> {
            List<ExampleSentence> sentences = exampleSentenceRepository.findByVocabularyId(v.getId());
            return new VocabularyDTO(v, sentences);
        }).toList();
    }
}
