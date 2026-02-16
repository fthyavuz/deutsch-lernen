package com.fatih.germanapp.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;

import com.fatih.germanapp.dto.LevelResponseDTO;
import com.fatih.germanapp.model.Level;
import com.fatih.germanapp.repository.LevelRepository;
import com.fatih.germanapp.exception.ResourceNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin/levels")
public class AdminLevelController {

    private final LevelRepository levelRepository;

    public AdminLevelController(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    @GetMapping
    public List<LevelResponseDTO> getAllLevels() {
        return levelRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public LevelResponseDTO createLevel(@RequestBody Level levelRequest) {
        log.info("Creating new level: {}", levelRequest.getCode());
        Level level = new Level();
        level.setCode(levelRequest.getCode());
        level.setTitle(levelRequest.getTitle());
        level.setDescription(levelRequest.getDescription());
        level.setDisplayOrder(levelRequest.getDisplayOrder());
        return convertToDTO(levelRepository.save(level));
    }

    @PutMapping("/{id}")
    public LevelResponseDTO updateLevel(@PathVariable Long id, @RequestBody Level levelRequest) {
        log.info("Updating level id: {}", id);
        Level level = levelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Level not found"));

        level.setCode(levelRequest.getCode());
        level.setTitle(levelRequest.getTitle());
        level.setDescription(levelRequest.getDescription());
        level.setDisplayOrder(levelRequest.getDisplayOrder());

        return convertToDTO(levelRepository.save(level));
    }

    @DeleteMapping("/{id}")
    public void deleteLevel(@PathVariable Long id) {
        log.info("Deleting level id: {}", id);
        levelRepository.deleteById(id);
    }

    private LevelResponseDTO convertToDTO(Level level) {
        LevelResponseDTO dto = new LevelResponseDTO();
        dto.setId(level.getId());
        dto.setCode(level.getCode());
        dto.setTitle(level.getTitle());
        dto.setDescription(level.getDescription());
        dto.setDisplayOrder(level.getDisplayOrder());
        return dto;
    }
}
