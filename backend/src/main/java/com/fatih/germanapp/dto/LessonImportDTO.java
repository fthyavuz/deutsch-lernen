package com.fatih.germanapp.dto;

import java.util.List;
import lombok.Data;

@Data
public class LessonImportDTO {
    private String title;
    private String description;
    private int lessonOrder;
    private String levelCode; // e.g. "A1.1"
    private List<VocabularyImportDTO> vocabularies;
    private List<QuizQuestionImportDTO> quizQuestions;
}
