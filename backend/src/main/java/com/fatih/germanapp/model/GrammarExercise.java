package com.fatih.germanapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grammar_exercises")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int orderIndex;

    @Column(columnDefinition = "TEXT")
    private String sentence;

    private String answer;
    private String hint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonIgnore
    private GrammarTopic topic;
}
