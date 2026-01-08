package com.fatih.germanapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatih.germanapp.model.UserProgress;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserId(Long userId);

    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
}
