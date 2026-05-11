package com.fatih.germanapp.controller;

import com.fatih.germanapp.dto.*;
import com.fatih.germanapp.exception.ResourceNotFoundException;
import com.fatih.germanapp.model.*;
import com.fatih.germanapp.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/grammar")
public class AdminGrammarController {

    private final GrammarTopicRepository topicRepository;
    private final GrammarCardRepository cardRepository;
    private final GrammarExerciseRepository exerciseRepository;
    private final LessonRepository lessonRepository;

    public AdminGrammarController(GrammarTopicRepository topicRepository,
                                  GrammarCardRepository cardRepository,
                                  GrammarExerciseRepository exerciseRepository,
                                  LessonRepository lessonRepository) {
        this.topicRepository = topicRepository;
        this.cardRepository = cardRepository;
        this.exerciseRepository = exerciseRepository;
        this.lessonRepository = lessonRepository;
    }

    // ── Topics ──────────────────────────────────────────────

    @GetMapping("/lesson/{lessonId}")
    public List<GrammarTopicResponseDTO> getByLesson(@PathVariable Long lessonId) {
        return topicRepository.findByLessonId(lessonId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/topics")
    public GrammarTopicResponseDTO createTopic(@RequestBody GrammarTopicRequestDTO request) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        GrammarTopic topic = new GrammarTopic();
        topic.setName(request.getName());
        topic.setLesson(lesson);
        return toResponseDTO(topicRepository.save(topic));
    }

    @PutMapping("/topics/{id}")
    public GrammarTopicResponseDTO updateTopic(@PathVariable Long id, @RequestBody GrammarTopicRequestDTO request) {
        GrammarTopic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));
        topic.setName(request.getName());
        return toResponseDTO(topicRepository.save(topic));
    }

    @DeleteMapping("/topics/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicRepository.deleteById(id);
    }

    // ── Cards ────────────────────────────────────────────────

    @PostMapping("/cards")
    public GrammarCardDTO createCard(@RequestBody GrammarCardRequestDTO request) {
        GrammarTopic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));
        GrammarCard card = new GrammarCard();
        card.setTopic(topic);
        card.setOrderIndex(request.getOrderIndex());
        card.setTitle(request.getTitle());
        card.setExplanation(request.getExplanation());
        card.setExamples(request.getExamples());
        GrammarCard saved = cardRepository.save(card);
        return new GrammarCardDTO(saved.getId(), saved.getOrderIndex(), saved.getTitle(), saved.getExplanation(), saved.getExamples());
    }

    @PutMapping("/cards/{id}")
    public GrammarCardDTO updateCard(@PathVariable Long id, @RequestBody GrammarCardRequestDTO request) {
        GrammarCard card = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        card.setOrderIndex(request.getOrderIndex());
        card.setTitle(request.getTitle());
        card.setExplanation(request.getExplanation());
        card.setExamples(request.getExamples());
        GrammarCard saved = cardRepository.save(card);
        return new GrammarCardDTO(saved.getId(), saved.getOrderIndex(), saved.getTitle(), saved.getExplanation(), saved.getExamples());
    }

    @DeleteMapping("/cards/{id}")
    public void deleteCard(@PathVariable Long id) {
        cardRepository.deleteById(id);
    }

    // ── Exercises ────────────────────────────────────────────

    @PostMapping("/exercises")
    public GrammarExerciseDTO createExercise(@RequestBody GrammarExerciseRequestDTO request) {
        GrammarTopic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));
        GrammarExercise exercise = new GrammarExercise();
        exercise.setTopic(topic);
        exercise.setOrderIndex(request.getOrderIndex());
        exercise.setSentence(request.getSentence());
        exercise.setAnswer(request.getAnswer());
        exercise.setHint(request.getHint());
        GrammarExercise saved = exerciseRepository.save(exercise);
        return new GrammarExerciseDTO(saved.getId(), saved.getOrderIndex(), saved.getSentence(), saved.getHint());
    }

    @PutMapping("/exercises/{id}")
    public GrammarExerciseDTO updateExercise(@PathVariable Long id, @RequestBody GrammarExerciseRequestDTO request) {
        GrammarExercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        exercise.setOrderIndex(request.getOrderIndex());
        exercise.setSentence(request.getSentence());
        exercise.setAnswer(request.getAnswer());
        exercise.setHint(request.getHint());
        GrammarExercise saved = exerciseRepository.save(exercise);
        return new GrammarExerciseDTO(saved.getId(), saved.getOrderIndex(), saved.getSentence(), saved.getHint());
    }

    @DeleteMapping("/exercises/{id}")
    public void deleteExercise(@PathVariable Long id) {
        exerciseRepository.deleteById(id);
    }

    // ── Bulk Import ──────────────────────────────────────────

    @PostMapping("/import")
    public List<GrammarTopicResponseDTO> importGrammar(@RequestBody GrammarImportDTO importDTO) {
        Lesson lesson = lessonRepository.findById(importDTO.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        if (importDTO.getTopics() == null) return List.of();

        return importDTO.getTopics().stream().map(topicDTO -> {
            GrammarTopic topic = new GrammarTopic();
            topic.setName(topicDTO.getName());
            topic.setLesson(lesson);
            GrammarTopic savedTopic = topicRepository.save(topic);

            if (topicDTO.getCards() != null) {
                topicDTO.getCards().forEach(cardDTO -> {
                    GrammarCard card = new GrammarCard();
                    card.setTopic(savedTopic);
                    card.setOrderIndex(cardDTO.getOrderIndex());
                    card.setTitle(cardDTO.getTitle());
                    card.setExplanation(cardDTO.getExplanation());
                    card.setExamples(cardDTO.getExamples());
                    cardRepository.save(card);
                });
            }

            if (topicDTO.getExercises() != null) {
                topicDTO.getExercises().forEach(exDTO -> {
                    GrammarExercise exercise = new GrammarExercise();
                    exercise.setTopic(savedTopic);
                    exercise.setOrderIndex(exDTO.getOrderIndex());
                    exercise.setSentence(exDTO.getSentence());
                    exercise.setAnswer(exDTO.getAnswer());
                    exercise.setHint(exDTO.getHint());
                    exerciseRepository.save(exercise);
                });
            }

            return toResponseDTO(savedTopic);
        }).collect(Collectors.toList());
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
