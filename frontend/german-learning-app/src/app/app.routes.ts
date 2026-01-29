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
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/lessons/lesson-list/lesson-list.component')
                .then(m => m.LessonListComponent)
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadChildren: () =>
            import('./features/admin/admin.routes')
                .then(m => m.adminRoutes)
    }
];
