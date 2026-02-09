import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component')
                .then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register.component')
                .then(m => m.RegisterComponent)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/lessons/lesson-list/student-lesson-list.component')
                .then(m => m.StudentLessonListComponent)
    },
    {
        path: 'lessons/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/lessons/lesson-detail/student-lesson-detail.component')
                .then(m => m.StudentLessonDetailComponent)
    },
    {
        path: 'lessons/:lessonId/quiz',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/quiz/student-quiz.component')
                .then(m => m.StudentQuizComponent)
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadChildren: () =>
            import('./features/admin/admin.routes')
                .then(m => m.adminRoutes)
    }
];
