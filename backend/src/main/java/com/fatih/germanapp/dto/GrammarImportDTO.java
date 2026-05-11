package com.fatih.germanapp.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GrammarImportDTO {
    private Long lessonId;
    private List<GrammarTopicImportDTO> topics;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class GrammarTopicImportDTO {
        private String name;
        private List<GrammarCardImportDTO> cards;
        private List<GrammarExerciseImportDTO> exercises;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class GrammarCardImportDTO {
        private int orderIndex;
        private String title;
        private String explanation;
        private String examples;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class GrammarExerciseImportDTO {
        private int orderIndex;
        private String sentence;
        private String answer;
        private String hint;
    }
}
