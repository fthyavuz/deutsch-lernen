package com.fatih.germanapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public List<QuizQuestion> getQuizByLesson(@PathVariable Long lessonId) {
        return quizQuestionRepository.findByLessonId(lessonId);
    }
}
