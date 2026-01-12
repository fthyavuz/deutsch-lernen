package com.fatih.germanapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.LessonSummaryResponseDTO;
import com.fatih.germanapp.model.Lesson;
import com.fatih.germanapp.repository.LessonRepository;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonRepository lessonRepository;

    public LessonController(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @GetMapping
    public List<LessonSummaryResponseDTO> getAllLessons() {
        List<Lesson> lessons = lessonRepository.findAllByOrderByLessonOrderAsc();
        return lessons.stream().map(lesson -> {
            LessonSummaryResponseDTO dto = new LessonSummaryResponseDTO();
            dto.setId(lesson.getId());
            dto.setTitle(lesson.getTitle());
            dto.setDescription(lesson.getDescription());
            dto.setLessonOrder(lesson.getLessonOrder());
            return dto;
        }).toList();
    }
}
