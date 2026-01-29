import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  error = signal<string | null>(null);

  login() {
    this.error.set(null);
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set('Login failed')
    });
  }

}
