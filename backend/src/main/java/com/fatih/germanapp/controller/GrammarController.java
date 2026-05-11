package com.fatih.germanapp.controller;

import com.fatih.germanapp.dto.*;
import com.fatih.germanapp.model.*;
import com.fatih.germanapp.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grammar")
public class GrammarController {

    private final GrammarTopicRepository topicRepository;
    private final GrammarCardRepository cardRepository;
    private final GrammarExerciseRepository exerciseRepository;

    public GrammarController(GrammarTopicRepository topicRepository,
                             GrammarCardRepository cardRepository,
                             GrammarExerciseRepository exerciseRepository) {
        this.topicRepository = topicRepository;
        this.cardRepository = cardRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @GetMapping("/lesson/{lessonId}")
    public List<GrammarTopicResponseDTO> getByLesson(@PathVariable Long lessonId) {
        return topicRepository.findByLessonId(lessonId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/submit")
    public GrammarSubmitResponseDTO submit(@RequestBody GrammarSubmitRequestDTO request) {
        GrammarExercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        boolean correct = normalizeEszett(request.getUserAnswer().trim()).equalsIgnoreCase(normalizeEszett(exercise.getAnswer().trim()));
        return new GrammarSubmitResponseDTO(correct, exercise.getAnswer());
    }

    private String normalizeEszett(String s) {
        return s.replace("ß", "ss").replace("ẞ", "SS");
    }

    private GrammarTopicResponseDTO toResponseDTO(GrammarTopic topic) {
        List<GrammarCardDTO> cards = cardRepository.findByTopicIdOrderByOrderIndex(topic.getId())
                .stream()
                .map(c -> new GrammarCardDTO(c.getId(), c.getOrderIndex(), c.getTitle(), c.getExplanation(), c.getExamples()))
                .collect(Collectors.toList());

        List<GrammarExerciseDTO> exercises = exerciseRepository.findByTopicIdOrderByOrderIndex(topic.getId())
                .stream()
                .map(e -> new GrammarExerciseDTO(e.getId(), e.getOrderIndex(), e.getSentence(), e.getHint()))
                .collect(Collectors.toList());

        GrammarTopicResponseDTO dto = new GrammarTopicResponseDTO();
        dto.setId(topic.getId());
        dto.setLessonId(topic.getLesson().getId());
        dto.setName(topic.getName());
        dto.setCards(cards);
        dto.setExercises(exercises);
        return dto;
    }
}
