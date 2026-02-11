import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    ]]
  });

  register() {
    if (this.registerForm.invalid) {
      if (this.registerForm.get('password')?.errors?.['pattern']) {
        this.error.set('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
      } else {
        this.error.set('Please fill in all fields correctly.');
      }
      return;
    }

    const { email, password } = this.registerForm.getRawValue();

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.error.set(err.error?.message || 'Registration failed. This email might already be in use.');
      }
    });
  }
}
