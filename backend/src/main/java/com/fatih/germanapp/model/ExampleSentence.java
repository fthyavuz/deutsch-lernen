package com.fatih.germanapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "example_sentences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExampleSentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String germanSentence;
    private String englishTranslation;
    private String turkishTranslation;

    @ManyToOne
    @JoinColumn(name = "vocabulary_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Vocabulary vocabulary;

}
