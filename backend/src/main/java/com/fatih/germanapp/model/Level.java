package com.fatih.germanapp.model;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // e.g. "A1.1", "B1.2"

    private String title; // e.g. "Beginner I"
    private String description;

    private int displayOrder; // for ordering levels

    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("level")
    private List<Lesson> lessons;
}
