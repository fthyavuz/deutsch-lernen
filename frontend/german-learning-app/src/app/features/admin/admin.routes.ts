import { Routes } from "@angular/router";
import { adminGuard } from "../../core/auth/admin.guard";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
    }
];