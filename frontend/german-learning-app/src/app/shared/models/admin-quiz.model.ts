export enum QuizQuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
    MATCHING = 'MATCHING'
}

export interface AdminQuizQuestionRequestDTO {
    lessonId: number;
    type: QuizQuestionType;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
}

export interface AdminQuizQuestionResponseDTO {
    id: number;
    type: QuizQuestionType;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
}
