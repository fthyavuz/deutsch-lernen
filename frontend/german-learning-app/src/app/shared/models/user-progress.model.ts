export interface UserProgressResponseDTO {
    lessonId: number;
    lessonTitle: string;
    completed: boolean;
    score: number;
    completedAt?: string;
}

export interface ProgressRequestDTO {
    lessonId: number;
    score: number;
}
