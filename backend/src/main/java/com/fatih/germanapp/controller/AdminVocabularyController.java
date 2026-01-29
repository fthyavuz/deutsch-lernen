package com.fatih.germanapp.controller;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fatih.germanapp.repository.VocabularyRepository;
import com.fatih.germanapp.dto.AdminVocabularyRequestDTO;
import com.fatih.germanapp.dto.AdminVocabularyResponse;
import com.fatih.germanapp.exception.ResourceNotFoundException;
import com.fatih.germanapp.model.Lesson;
import com.fatih.germanapp.model.Vocabulary;
import com.fatih.germanapp.repository.LessonRepository;

@RestController
@RequestMapping("/api/admin/vocabularies")
public class AdminVocabularyController {

    private final VocabularyRepository vocabularyRepository;
    private final LessonRepository lessonRepository;

    public AdminVocabularyController(VocabularyRepository vocabularyRepository,
            LessonRepository lessonRepository) {
        this.vocabularyRepository = vocabularyRepository;
        this.lessonRepository = lessonRepository;
    }

    // CREATE
    @PostMapping
    public AdminVocabularyResponse createVocabulary(
            @RequestBody AdminVocabularyRequestDTO request) {

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Vocabulary vocabulary = new Vocabulary();
        vocabulary.setGermanWord(request.getGermanWord());
        vocabulary.setEnglishMeaning(request.getEnglishMeaning());
        vocabulary.setTurkishMeaning(request.getTurkishMeaning());
        vocabulary.setGermanExplanation(request.getGermanExplanation());
        vocabulary.setRelatedWords(request.getRelatedWords());
        vocabulary.setLesson(lesson);

        Vocabulary saved = vocabularyRepository.save(vocabulary);
        return toResponse(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AdminVocabularyResponse updateVocabulary(
            @PathVariable Long id,
            @RequestBody AdminVocabularyRequestDTO request) {

        Vocabulary vocabulary = vocabularyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vocabulary not found"));

        vocabulary.setGermanWord(request.getGermanWord());
        vocabulary.setEnglishMeaning(request.getEnglishMeaning());
        vocabulary.setTurkishMeaning(request.getTurkishMeaning());
        vocabulary.setGermanExplanation(request.getGermanExplanation());
        vocabulary.setRelatedWords(request.getRelatedWords());

        Vocabulary updated = vocabularyRepository.save(vocabulary);
        return toResponse(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteVocabulary(@PathVariable Long id) {
        vocabularyRepository.deleteById(id);
    }

    // LIST by lesson
    @GetMapping("/lesson/{lessonId}")
    public List<AdminVocabularyResponse> getByLesson(
            @PathVariable Long lessonId) {

        return vocabularyRepository.findByLessonId(lessonId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AdminVocabularyResponse toResponse(Vocabulary vocabulary) {
        AdminVocabularyResponse response = new AdminVocabularyResponse();
        response.setId(vocabulary.getId());
        response.setGermanWord(vocabulary.getGermanWord());
        response.setEnglishMeaning(vocabulary.getEnglishMeaning());
        response.setTurkishMeaning(vocabulary.getTurkishMeaning());
        response.setGermanExplanation(vocabulary.getGermanExplanation());
        response.setRelatedWords(vocabulary.getRelatedWords());
        return response;
    }
}
