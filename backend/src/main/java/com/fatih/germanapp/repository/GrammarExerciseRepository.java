package com.fatih.germanapp.repository;

import com.fatih.germanapp.model.GrammarExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrammarExerciseRepository extends JpaRepository<GrammarExercise, Long> {
    List<GrammarExercise> findByTopicIdOrderByOrderIndex(Long topicId);
}
