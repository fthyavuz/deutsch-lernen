import { Routes } from "@angular/router";
import { LessonListComponent } from "./lesson-list/lesson-list.component";
import { LessonFormComponent } from "./lesson-form/lesson-form.component";


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
    }

]