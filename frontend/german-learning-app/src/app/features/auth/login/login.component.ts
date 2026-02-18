import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  login() {
    if (this.loginForm.invalid) return;

    this.error.set(null);
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: () => {
        const target = this.authService.isAdmin() ? '/admin/lessons' : '/';
        this.router.navigate([target]);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 0) {
          this.error.set('Server is not responding. Please check your internet connection or try again later.');
        } else if (err.status === 401 || err.status === 403) {
          this.error.set('Invalid email or password.');
        } else {
          this.error.set(err.error?.message || 'An unexpected error occurred. Please try again.');
        }
      }
    });
  }
}
