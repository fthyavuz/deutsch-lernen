package com.fatih.germanapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public UserProgressResponseDTO saveProgress(@RequestBody ProgressRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        UserProgress userProgress = userProgressRepository
                .findByUserIdAndLessonId(request.getUserId(), request.getLessonId())
                .orElse(new UserProgress());

        userProgress.setUser(user);
        userProgress.setLesson(lesson);
        userProgress.setScore(request.getScore());
        userProgress.setCompleted(request.isCompleted());

        UserProgress savedUserProgress = userProgressRepository.save(userProgress);
        UserProgressResponseDTO dto = new UserProgressResponseDTO();
        dto.setLessonId(savedUserProgress.getLesson().getId());
        dto.setLessonTitle(savedUserProgress.getLesson().getTitle());
        dto.setCompleted(savedUserProgress.isCompleted());
        dto.setScore(savedUserProgress.getScore());
        return dto;
    }

    @GetMapping("/user/{userId}")
    public List<UserProgressResponseDTO> getUserProgress(@PathVariable Long userId) {
        return userProgressRepository.findByUserId(userId)
                .stream()
                .map(progress -> {
                    UserProgressResponseDTO dto = new UserProgressResponseDTO();
                    dto.setLessonId(progress.getLesson().getId());
                    dto.setLessonTitle(progress.getLesson().getTitle());
                    dto.setCompleted(progress.isCompleted());
                    dto.setScore(progress.getScore());
                    return dto;
                })
                .toList();

    }
}
