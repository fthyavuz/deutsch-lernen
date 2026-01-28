import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  error = signal<string | null>(null);

  register() {
    this.authService.register({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error.set('Registration failed')
    });
  }
}
