package com.fatih.germanapp.controller;

import com.fatih.germanapp.dto.LessonImportDTO;
import com.fatih.germanapp.model.Lesson;
import com.fatih.germanapp.service.AdminImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class AdminImportController {

    private final AdminImportService importService;

    @PostMapping("/lesson")
    public ResponseEntity<com.fatih.germanapp.dto.AdminLessonResponseDTO> importLesson(
            @RequestBody LessonImportDTO importDTO) {
        Lesson importedLesson = importService.importLesson(importDTO);
        return ResponseEntity.ok(toResponse(importedLesson));
    }

    private com.fatih.germanapp.dto.AdminLessonResponseDTO toResponse(Lesson lesson) {
        com.fatih.germanapp.dto.AdminLessonResponseDTO response = new com.fatih.germanapp.dto.AdminLessonResponseDTO();
        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setDescription(lesson.getDescription());
        response.setLessonOrder(lesson.getLessonOrder());
        if (lesson.getLevel() != null) {
            response.setLevelId(lesson.getLevel().getId());
            response.setLevelCode(lesson.getLevel().getCode());
        }
        return response;
    }
}
