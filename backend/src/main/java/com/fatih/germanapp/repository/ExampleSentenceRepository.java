package com.fatih.germanapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatih.germanapp.model.ExampleSentence;

@Repository
public interface ExampleSentenceRepository extends JpaRepository<ExampleSentence, Long> {

    List<ExampleSentence> findByVocabularyId(Long vocabularyId);
}
