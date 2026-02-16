package com.fatih.germanapp.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.LevelResponseDTO;
import com.fatih.germanapp.dto.LessonSummaryResponseDTO;
import com.fatih.germanapp.model.Level;
import com.fatih.germanapp.repository.LevelRepository;
import com.fatih.germanapp.exception.ResourceNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/levels")
public class LevelController {

    private final LevelRepository levelRepository;

    public LevelController(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    @GetMapping
    public List<LevelResponseDTO> getAllLevels() {
        log.info("Fetching all levels");
        List<Level> levels = levelRepository.findAllByOrderByDisplayOrderAsc();
        return levels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LevelResponseDTO getLevelById(@PathVariable Long id) {
        log.info("Fetching level by id: {}", id);
        return levelRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Level not found"));
    }

    private LevelResponseDTO convertToDTO(Level level) {
        LevelResponseDTO dto = new LevelResponseDTO();
        dto.setId(level.getId());
        dto.setCode(level.getCode());
        dto.setTitle(level.getTitle());
        dto.setDescription(level.getDescription());
        dto.setDisplayOrder(level.getDisplayOrder());

        if (level.getLessons() != null) {
            dto.setLessons(level.getLessons().stream().map(lesson -> {
                LessonSummaryResponseDTO lDto = new LessonSummaryResponseDTO();
                lDto.setId(lesson.getId());
                lDto.setTitle(lesson.getTitle());
                lDto.setDescription(lesson.getDescription());
                lDto.setLessonOrder(lesson.getLessonOrder());
                lDto.setLevelId(level.getId());
                lDto.setLevelCode(level.getCode());
                return lDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
