package com.fatih.germanapp.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.ProgressRequestDTO;
import com.fatih.germanapp.dto.UserProgressResponseDTO;
import com.fatih.germanapp.model.Lesson;
import com.fatih.germanapp.model.User;
import com.fatih.germanapp.model.UserProgress;
import com.fatih.germanapp.repository.LessonRepository;
import com.fatih.germanapp.repository.UserProgressRepository;
import com.fatih.germanapp.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/progress")
public class UserProgressController {
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public UserProgressController(UserProgressRepository userProgressRepository, UserRepository userRepository,
            LessonRepository lessonRepository) {
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    @PostMapping
    public UserProgressResponseDTO saveProgress(
            @RequestBody ProgressRequestDTO request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        UserProgress progress = userProgressRepository
                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElse(new UserProgress());

        progress.setUser(user);
        progress.setLesson(lesson);
        progress.setScore(request.getScore());

        boolean completed = request.getScore() >= 70;
        progress.setCompleted(completed);

        if (completed && progress.getCompletedAt() == null) {
            progress.setCompletedAt(LocalDateTime.now());
        }

        UserProgress saved = userProgressRepository.save(progress);

        log.info("Progress saved for user {}: Lesson '{}' - Completed: {}, Score: {}",
                email, lesson.getTitle(), saved.isCompleted(), saved.getScore());

        UserProgressResponseDTO dto = new UserProgressResponseDTO();
        dto.setLessonId(lesson.getId());
        dto.setLessonTitle(lesson.getTitle());
        dto.setCompleted(saved.isCompleted());
        dto.setScore(saved.getScore());
        dto.setCompletedAt(saved.getCompletedAt());

        return dto;
    }

    @GetMapping("/me")
    public List<UserProgressResponseDTO> getMyProgress(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProgressRepository.findByUserId(user.getId())
                .stream()
                .map(progress -> {
                    UserProgressResponseDTO dto = new UserProgressResponseDTO();
                    dto.setLessonId(progress.getLesson().getId());
                    dto.setLessonTitle(progress.getLesson().getTitle());
                    dto.setCompleted(progress.isCompleted());
                    dto.setScore(progress.getScore());
                    dto.setCompletedAt(progress.getCompletedAt());
                    return dto;
                })
                .toList();
    }

}
