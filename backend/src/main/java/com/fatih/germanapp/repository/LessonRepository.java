package com.fatih.germanapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatih.germanapp.model.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findAllByOrderByLessonOrderAsc();

    java.util.Optional<Lesson> findByTitle(String title);

    java.util.Optional<Lesson> findByTitleIgnoreCase(String title);
}
