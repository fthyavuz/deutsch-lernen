package com.fatih.germanapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.AdminLessonRequestDTO;
import com.fatih.germanapp.dto.AdminLessonResponseDTO;
import com.fatih.germanapp.exception.ResourceNotFoundException;
import com.fatih.germanapp.model.Lesson;
import com.fatih.germanapp.repository.LessonRepository;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin/lessons")
public class AdminLessonController {

    private final LessonRepository lessonRepository;

    public AdminLessonController(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    // CREATE
    @PostMapping
    public AdminLessonResponseDTO createLesson(
            @RequestBody AdminLessonRequestDTO request) {

        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setLessonOrder(request.getLessonOrder());

        Lesson saved = lessonRepository.save(lesson);

        return toResponse(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AdminLessonResponseDTO updateLesson(
            @PathVariable Long id,
            @RequestBody AdminLessonRequestDTO request) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setLessonOrder(request.getLessonOrder());

        Lesson updated = lessonRepository.save(lesson);
        return toResponse(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteLesson(@PathVariable Long id) {
        lessonRepository.deleteById(id);
    }

    // LIST (admin view)
    @GetMapping
    public List<AdminLessonResponseDTO> getAllLessons() {
        return lessonRepository.findAllByOrderByLessonOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AdminLessonResponseDTO toResponse(Lesson lesson) {
        AdminLessonResponseDTO response = new AdminLessonResponseDTO();
        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setDescription(lesson.getDescription());
        response.setLessonOrder(lesson.getLessonOrder());
        return response;
    }
}
