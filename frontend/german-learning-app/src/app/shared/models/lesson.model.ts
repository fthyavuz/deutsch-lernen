import { QuizQuestionDTO } from "./quiz.model";
import { VocabularyDTO } from "./vocabulary.model";

export interface LessonDTO {
    id: number;
    title: string;
    description: string;
    lessonOrder?: number;
    vocabularies?: VocabularyDTO[];
    quizQuestions?: QuizQuestionDTO[];

}