// src/app/shared/models/user-progress.model.ts
import { LessonDTO } from './lesson.model';
import { UserDTO } from './user.model';

export interface UserProgressDTO {
    id: number;
    completed: boolean;
    score: number;
    completedAt?: string; // ISO string
    user: UserDTO;
    lesson: LessonDTO;
}
