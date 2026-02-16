import { LessonDTO } from './lesson.model';

export interface LevelDTO {
    id: number;
    code: string;
    title: string;
    description: string;
    displayOrder: number;
    lessons?: LessonDTO[];
}
