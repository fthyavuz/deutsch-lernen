export enum QuizQuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
    MATCHING = 'MATCHING'
}

export interface QuizQuestionDTO {
    id: number;
    question: string;
    type: QuizQuestionType;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    optionD?: string;
    matchingPairs?: string; // Format: "Hund:Dog|Katze:Cat|Haus:House"
}

export interface QuizSubmitRequest {
    questionId: number;
    selectedAnswer: string;
}

export interface QuizSubmitResponse {
    questionId: number;
    correctAnswer: string;
    correct: boolean;
}
