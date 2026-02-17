package com.fatih.germanapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.QuizQuestionResponseDTO;
import com.fatih.germanapp.dto.QuizSubmitRequestDTO;
import com.fatih.germanapp.dto.QuizSubmitResponseDTO;
import com.fatih.germanapp.model.QuizQuestion;
import com.fatih.germanapp.repository.QuizQuestionRepository;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizController(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @GetMapping("/lesson/{lessonId}")
    public List<QuizQuestionResponseDTO> getQuizByLesson(@PathVariable Long lessonId) {
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByLessonId(lessonId);
        return quizQuestions.stream().map(quizQuestion -> {
            QuizQuestionResponseDTO dto = new QuizQuestionResponseDTO();
            dto.setId(quizQuestion.getId());
            dto.setQuestion(quizQuestion.getQuestion());
            dto.setType(quizQuestion.getType());
            dto.setOptionA(quizQuestion.getOptionA());
            dto.setOptionB(quizQuestion.getOptionB());
            dto.setOptionC(quizQuestion.getOptionC());
            dto.setOptionD(quizQuestion.getOptionD());
            dto.setMatchingPairs(quizQuestion.getMatchingPairs());
            return dto;
        }).toList();
    }

    @PostMapping("/submit")
    public QuizSubmitResponseDTO submitQuiz(@RequestBody QuizSubmitRequestDTO request) {
        QuizQuestion quizQuestion = quizQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Quiz question not found"));
        QuizSubmitResponseDTO response = new QuizSubmitResponseDTO();
        response.setQuestionId(request.getQuestionId());

        // For MATCHING type, the correct answer is the matchingPairs field if
        // correctAnswer is empty
        String actualCorrectAnswer = quizQuestion.getCorrectAnswer();
        if (quizQuestion.getType().toString().equals("MATCHING")
                && (actualCorrectAnswer == null || actualCorrectAnswer.isEmpty())) {
            actualCorrectAnswer = quizQuestion.getMatchingPairs();
        }

        response.setCorrectAnswer(actualCorrectAnswer);

        boolean isCorrect;
        if ("MATCHING".equals(quizQuestion.getType().toString())) {
            isCorrect = validateMatchingAnswer(request.getSelectedAnswer(), actualCorrectAnswer);
        } else {
            isCorrect = request.getSelectedAnswer().equals(actualCorrectAnswer);
        }

        response.setCorrect(isCorrect);
        return response;
    }

    private boolean validateMatchingAnswer(String selectedAnswer, String correctAnswer) {
        if (selectedAnswer == null || correctAnswer == null) {
            return false;
        }

        // Parse and normalize selected answer
        java.util.Set<String> selectedPairs = java.util.Arrays.stream(selectedAnswer.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty() && s.contains(":"))
                .map(s -> {
                    String[] parts = s.split(":");
                    return parts[0].trim() + ":" + parts[1].trim();
                })
                .collect(java.util.stream.Collectors.toSet());

        // Parse and normalize correct answer
        java.util.Set<String> correctPairs = java.util.Arrays.stream(correctAnswer.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty() && s.contains(":"))
                .map(s -> {
                    String[] parts = s.split(":");
                    return parts[0].trim() + ":" + parts[1].trim();
                })
                .collect(java.util.stream.Collectors.toSet());

        return selectedPairs.equals(correctPairs);
    }
}
