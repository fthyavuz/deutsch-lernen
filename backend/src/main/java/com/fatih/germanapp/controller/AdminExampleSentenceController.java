package com.fatih.germanapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.AdminExampleSentenceRequestDTO;
import com.fatih.germanapp.dto.AdminExampleSentenceResponseDTO;
import com.fatih.germanapp.exception.ResourceNotFoundException;
import com.fatih.germanapp.model.ExampleSentence;
import com.fatih.germanapp.model.Vocabulary;
import com.fatih.germanapp.repository.ExampleSentenceRepository;
import com.fatih.germanapp.repository.VocabularyRepository;

@RestController
@RequestMapping("/api/admin/example-sentences")
public class AdminExampleSentenceController {

    private final ExampleSentenceRepository exampleSentenceRepository;
    private final VocabularyRepository vocabularyRepository;

    public AdminExampleSentenceController(ExampleSentenceRepository exampleSentenceRepository,
            VocabularyRepository vocabularyRepository) {
        this.exampleSentenceRepository = exampleSentenceRepository;
        this.vocabularyRepository = vocabularyRepository;
    }

    // CREATE
    @PostMapping
    public AdminExampleSentenceResponseDTO create(
            @RequestBody AdminExampleSentenceRequestDTO request) {

        Vocabulary vocab = vocabularyRepository.findById(request.getVocabularyId())
                .orElseThrow(() -> new ResourceNotFoundException("Vocabulary not found"));

        ExampleSentence sentence = new ExampleSentence();
        sentence.setVocabulary(vocab);
        sentence.setGermanSentence(request.getGermanSentence());
        sentence.setEnglishTranslation(request.getEnglishTranslation());
        sentence.setTurkishTranslation(request.getTurkishTranslation());

        ExampleSentence saved = exampleSentenceRepository.save(sentence);
        return toResponse(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AdminExampleSentenceResponseDTO update(
            @PathVariable Long id,
            @RequestBody AdminExampleSentenceRequestDTO request) {

        ExampleSentence sentence = exampleSentenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Example sentence not found"));

        sentence.setGermanSentence(request.getGermanSentence());
        sentence.setEnglishTranslation(request.getEnglishTranslation());
        sentence.setTurkishTranslation(request.getTurkishTranslation());

        ExampleSentence updated = exampleSentenceRepository.save(sentence);
        return toResponse(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        exampleSentenceRepository.deleteById(id);
    }

    // LIST by vocabulary
    @GetMapping("/vocabulary/{vocabularyId}")
    public List<AdminExampleSentenceResponseDTO> getByVocabulary(
            @PathVariable Long vocabularyId) {

        return exampleSentenceRepository.findByVocabularyId(vocabularyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AdminExampleSentenceResponseDTO toResponse(ExampleSentence sentence) {
        AdminExampleSentenceResponseDTO res = new AdminExampleSentenceResponseDTO();
        res.setId(sentence.getId());
        res.setGermanSentence(sentence.getGermanSentence());
        res.setEnglishTranslation(sentence.getEnglishTranslation());
        res.setTurkishTranslation(sentence.getTurkishTranslation());
        return res;
    }
}
