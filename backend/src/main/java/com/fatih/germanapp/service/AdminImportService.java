package com.fatih.germanapp.service;

import com.fatih.germanapp.dto.*;
import com.fatih.germanapp.model.*;
import com.fatih.germanapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminImportService {

    private final LessonRepository lessonRepository;
    private final VocabularyRepository vocabularyRepository;
    private final ExampleSentenceRepository exampleSentenceRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final LevelRepository levelRepository;

    @Transactional
    public Lesson importLesson(LessonImportDTO importDTO) {
        log.info("Starting bulk import for lesson: {}", importDTO.getTitle());

        // 1. Check if lesson exists by title
        Lesson lesson = lessonRepository.findByTitle(importDTO.getTitle())
                .orElse(new Lesson());

        // Update fields
        lesson.setTitle(importDTO.getTitle());
        lesson.setDescription(importDTO.getDescription());
        lesson.setLessonOrder(importDTO.getLessonOrder());

        // Handle Level
        if (importDTO.getLevelCode() != null) {
            Level level = levelRepository.findByCode(importDTO.getLevelCode())
                    .orElseThrow(() -> new com.fatih.germanapp.exception.ResourceNotFoundException(
                            "Level not found: " + importDTO.getLevelCode()));
            lesson.setLevel(level);
        }

        // If updating existing, clear old associations
        if (lesson.getId() != null) {
            // Note: because of CascadeType.ALL and orphanRemoval (if added) or explicit
            // delete,
            // we should handle clearing children.
            // JPA will take care of children if we clear the lists and have
            // orphanRemoval=true
            if (lesson.getVocabularies() != null) {
                lesson.getVocabularies().clear();
            }
            if (lesson.getQuizQuestions() != null) {
                lesson.getQuizQuestions().clear();
            }
        }

        lesson = lessonRepository.save(lesson);
        // Ensure lists are initialized
        if (lesson.getVocabularies() == null)
            lesson.setVocabularies(new java.util.ArrayList<>());
        if (lesson.getQuizQuestions() == null)
            lesson.setQuizQuestions(new java.util.ArrayList<>());

        // 2. Handle Vocabularies
        if (importDTO.getVocabularies() != null) {
            for (VocabularyImportDTO vocabDTO : importDTO.getVocabularies()) {
                Vocabulary vocabulary = new Vocabulary();
                vocabulary.setGermanWord(vocabDTO.getGermanWord());
                vocabulary.setEnglishMeaning(vocabDTO.getEnglishMeaning());
                vocabulary.setTurkishMeaning(vocabDTO.getTurkishMeaning());
                vocabulary.setGermanExplanation(vocabDTO.getGermanExplanation());
                vocabulary.setRelatedWords(vocabDTO.getRelatedWords());
                vocabulary.setLesson(lesson);
                Vocabulary savedVocab = vocabularyRepository.save(vocabulary);

                // 3. Handle Example Sentences
                if (vocabDTO.getExampleSentences() != null) {
                    for (ExampleSentenceImportDTO sentenceDTO : vocabDTO.getExampleSentences()) {
                        ExampleSentence sentence = new ExampleSentence();
                        sentence.setGermanSentence(sentenceDTO.getGermanSentence());
                        sentence.setEnglishTranslation(sentenceDTO.getEnglishTranslation());
                        sentence.setTurkishTranslation(sentenceDTO.getTurkishTranslation());
                        sentence.setVocabulary(savedVocab);
                        exampleSentenceRepository.save(sentence);
                    }
                }
            }
        }

        // 4. Handle Quiz Questions
        if (importDTO.getQuizQuestions() != null) {
            for (QuizQuestionImportDTO quizDTO : importDTO.getQuizQuestions()) {
                QuizQuestion question = new QuizQuestion();
                question.setType(quizDTO.getType());
                question.setQuestion(quizDTO.getQuestion());
                question.setOptionA(quizDTO.getOptionA());
                question.setOptionB(quizDTO.getOptionB());
                question.setOptionC(quizDTO.getOptionC());
                question.setOptionD(quizDTO.getOptionD());
                question.setMatchingPairs(quizDTO.getMatchingPairs());
                question.setCorrectAnswer(quizDTO.getCorrectAnswer());
                question.setLesson(lesson);
                quizQuestionRepository.save(question);
            }
        }

        log.info("Successfully imported lesson: {} with {} vocabularies", lesson.getTitle(),
                importDTO.getVocabularies() != null ? importDTO.getVocabularies().size() : 0);
        return lesson;
    }
}
