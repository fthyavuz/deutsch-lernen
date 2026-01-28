import { Routes } from '@angular/router';
import { LessonListComponent } from './features/lessons/lesson-list/lesson-list.component';
import { FlashcardComponent } from './features/flashcard/flashcard.component';
import { QuizComponent } from './features/quiz/quiz.component';
import { ProgressComponent } from './features/progress/progress.component';
import { AdminGuard } from './core/auth/admin.guard';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: LessonListComponent
    },
    {
        path: 'flashcards/:lessonId',
        component: FlashcardComponent
    },
    {
        path: 'quiz/:lessonId',
        component: QuizComponent
    },
    {
        path: 'progress',
        component: ProgressComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '',
        redirectTo: 'register',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
        canActivate: [AdminGuard]
    },
    { path: '**', redirectTo: '' }
];
