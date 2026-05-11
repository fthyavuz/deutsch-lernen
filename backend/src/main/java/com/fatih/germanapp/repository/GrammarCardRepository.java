package com.fatih.germanapp.repository;

import com.fatih.germanapp.model.GrammarCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrammarCardRepository extends JpaRepository<GrammarCard, Long> {
    List<GrammarCard> findByTopicIdOrderByOrderIndex(Long topicId);
}
