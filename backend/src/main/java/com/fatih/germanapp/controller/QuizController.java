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
import com.fatih.germanapp.dto.QuizSubmitResponse;
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
            return dto;
        }).toList();
    }

    @PostMapping("/submit")
    public QuizSubmitResponse submitQuiz(@RequestBody QuizSubmitRequestDTO request) {
        QuizQuestion quizQuestion = quizQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Quiz question not found"));
        QuizSubmitResponse response = new QuizSubmitResponse();
        response.setQuestionId(request.getQuestionId());
        response.setCorrectAnswer(quizQuestion.getCorrectAnswer());
        response.setCorrect(request.getSelectedAnswer().equals(quizQuestion.getCorrectAnswer()));
        return response;
    }

}
