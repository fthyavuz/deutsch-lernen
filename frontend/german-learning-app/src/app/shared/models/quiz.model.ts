// src/app/shared/models/quiz.model.ts
export type QuizType = 'MULTIPLE_CHOICE' | 'FILL_IN_THE_BLANK' | 'MATCHING';

export interface QuizQuestionDTO {
    id: number;
    type: QuizType;
    question: string;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    optionD?: string;
    correctAnswer: string;
}
