package com.fatih.germanapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grammar_cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int orderIndex;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // Pipe-separated example sentences: "Ich sehe den Mann.|Er kauft einen Apfel."
    @Column(columnDefinition = "TEXT")
    private String examples;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonIgnore
    private GrammarTopic topic;
}
