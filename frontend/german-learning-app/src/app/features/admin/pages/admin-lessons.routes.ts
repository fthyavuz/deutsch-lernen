import { Routes } from "@angular/router";
import { LessonListComponent } from "./lesson-list/lesson-list.component";
import { LessonFormComponent } from "./lesson-form/lesson-form.component";
import { LessonDetailComponent } from "./lesson-detail/lesson-detail.component";


export const adminLessonsRoutes: Routes = [
    {
        path: '',
        component: LessonListComponent
    },
    {
        path: 'new',
        component: LessonFormComponent
    },
    {
        path: 'edit/:id',
        component: LessonFormComponent
    },
    {
        path: ':id',
        component: LessonDetailComponent
    },
    {
        path: ':id/vocab/new',
        loadComponent: () => import('./lesson-detail/lesson-vocabulary-form/lesson-vocabulary-form.component').then(m => m.LessonVocabularyFormComponent)
    }

]