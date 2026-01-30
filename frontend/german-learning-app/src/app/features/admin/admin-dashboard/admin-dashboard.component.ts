import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { effect } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.isAdmin()) {
        this.router.navigate(['/']);
      }
    });
  }
}
