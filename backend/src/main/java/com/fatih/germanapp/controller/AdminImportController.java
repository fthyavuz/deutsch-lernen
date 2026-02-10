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
    public ResponseEntity<Lesson> importLesson(@RequestBody LessonImportDTO importDTO) {
        Lesson importedLesson = importService.importLesson(importDTO);
        return ResponseEntity.ok(importedLesson);
    }
}
