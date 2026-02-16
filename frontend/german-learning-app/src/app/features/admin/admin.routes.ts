import { Routes } from "@angular/router";
import { adminGuard } from "../../core/auth/admin.guard";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'lessons', pathMatch: 'full' },
            {
                path: 'lessons',
                loadChildren: () =>
                    import('./pages/admin-lessons.routes')
                        .then(m => m.adminLessonsRoutes)
            },
            {
                path: 'levels',
                loadComponent: () => import('./pages/level-list/level-list.component').then(m => m.LevelListComponent)
            },
            {
                path: 'levels/new',
                loadComponent: () => import('./pages/level-form/level-form.component').then(m => m.LevelFormComponent)
            },
            {
                path: 'levels/edit/:id',
                loadComponent: () => import('./pages/level-form/level-form.component').then(m => m.LevelFormComponent)
            }
        ]
    }
];