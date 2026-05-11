export interface GrammarCardDTO {
  id: number;
  orderIndex: number;
  title: string;
  explanation: string;
  examples: string; // pipe-separated
}

export interface GrammarExerciseDTO {
  id: number;
  orderIndex: number;
  sentence: string;
  hint: string;
}

export interface GrammarTopicDTO {
  id: number;
  lessonId: number;
  name: string;
  cards: GrammarCardDTO[];
  exercises: GrammarExerciseDTO[];
}

export interface GrammarSubmitRequest {
  exerciseId: number;
  userAnswer: string;
}

export interface GrammarSubmitResponse {
  correct: boolean;
  correctAnswer: string;
}

export interface GrammarImportDTO {
  lessonId: number;
  topics: GrammarTopicImportDTO[];
}

export interface GrammarTopicImportDTO {
  name: string;
  cards: GrammarCardImportDTO[];
  exercises: GrammarExerciseImportDTO[];
}

export interface GrammarCardImportDTO {
  orderIndex: number;
  title: string;
  explanation: string;
  examples: string;
}

export interface GrammarExerciseImportDTO {
  orderIndex: number;
  sentence: string;
  answer: string;
  hint: string;
}
