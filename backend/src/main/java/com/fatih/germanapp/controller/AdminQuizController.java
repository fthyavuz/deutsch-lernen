package com.fatih.germanapp.controller;

import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.AdminQuizQuestionRequestDTO;
import com.fatih.germanapp.dto.AdminQuizQuestionResponseDTO;
import com.fatih.germanapp.exception.ResourceNotFoundException;
import com.fatih.germanapp.model.Lesson;
import com.fatih.germanapp.model.QuizQuestion;
import com.fatih.germanapp.repository.LessonRepository;
import com.fatih.germanapp.repository.QuizQuestionRepository;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin/quizzes")
public class AdminQuizController {

    private final QuizQuestionRepository quizQuestionRepository;
    private final LessonRepository lessonRepository;

    public AdminQuizController(QuizQuestionRepository quizQuestionRepository,
            LessonRepository lessonRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.lessonRepository = lessonRepository;
    }

    // CREATE
    @PostMapping
    public AdminQuizQuestionResponseDTO create(
            @RequestBody AdminQuizQuestionRequestDTO request) {

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        QuizQuestion question = new QuizQuestion();
        question.setLesson(lesson);
        question.setType(request.getType());
        question.setQuestion(request.getQuestion());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());

        QuizQuestion saved = quizQuestionRepository.save(question);
        return toResponse(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AdminQuizQuestionResponseDTO update(
            @PathVariable Long id,
            @RequestBody AdminQuizQuestionRequestDTO request) {

        QuizQuestion question = quizQuestionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz question not found"));

        question.setType(request.getType());
        question.setQuestion(request.getQuestion());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());

        QuizQuestion updated = quizQuestionRepository.save(question);
        return toResponse(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        quizQuestionRepository.deleteById(id);
    }

    // LIST by lesson
    @GetMapping("/lesson/{lessonId}")
    public List<AdminQuizQuestionResponseDTO> getByLesson(
            @PathVariable Long lessonId) {

        return quizQuestionRepository.findByLessonId(lessonId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AdminQuizQuestionResponseDTO toResponse(QuizQuestion q) {
        AdminQuizQuestionResponseDTO res = new AdminQuizQuestionResponseDTO();
        res.setId(q.getId());
        res.setType(q.getType());
        res.setQuestion(q.getQuestion());
        res.setOptionA(q.getOptionA());
        res.setOptionB(q.getOptionB());
        res.setOptionC(q.getOptionC());
        res.setOptionD(q.getOptionD());
        res.setCorrectAnswer(q.getCorrectAnswer());
        return res;
    }
}
