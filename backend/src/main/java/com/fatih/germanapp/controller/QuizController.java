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
        response.setCorrectAnswer(quizQuestion.getCorrectAnswer());

        // For MATCHING type, compare pairs as sets (order-independent)
        boolean isCorrect;
        if ("MATCHING".equals(quizQuestion.getType().toString())) {
            isCorrect = validateMatchingAnswer(request.getSelectedAnswer(), quizQuestion.getCorrectAnswer());
        } else {
            // For other types, simple string comparison
            isCorrect = request.getSelectedAnswer().equals(quizQuestion.getCorrectAnswer());
        }

        response.setCorrect(isCorrect);
        return response;
    }

    private boolean validateMatchingAnswer(String selectedAnswer, String correctAnswer) {
        if (selectedAnswer == null || correctAnswer == null) {
            return false;
        }

        // Parse both answers into sets of pairs
        java.util.Set<String> selectedPairs = new java.util.HashSet<>(
                java.util.Arrays.asList(selectedAnswer.split("\\|")));
        java.util.Set<String> correctPairs = new java.util.HashSet<>(
                java.util.Arrays.asList(correctAnswer.split("\\|")));

        // Compare sets (order doesn't matter)
        return selectedPairs.equals(correctPairs);
    }

}
