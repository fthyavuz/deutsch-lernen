export interface AdminLessonDTO {
    id?: number;
    title: string;
    description: string;
    lessonOrder: number;
    levelId?: number;
    levelCode?: string;
}