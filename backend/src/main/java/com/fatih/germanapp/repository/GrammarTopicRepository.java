package com.fatih.germanapp.repository;

import com.fatih.germanapp.model.GrammarTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrammarTopicRepository extends JpaRepository<GrammarTopic, Long> {
    List<GrammarTopic> findByLessonId(Long lessonId);
    void deleteByLessonId(Long lessonId);
}
