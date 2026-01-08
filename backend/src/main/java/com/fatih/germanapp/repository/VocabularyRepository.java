package com.fatih.germanapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatih.germanapp.model.Vocabulary;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {

    List<Vocabulary> findByLessonId(Long lessonId);
}
