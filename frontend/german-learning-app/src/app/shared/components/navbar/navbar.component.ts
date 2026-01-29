import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = computed(() => this.authService.isLoggedInSignal());
  isAdmin = computed(() => this.authService.isAdmin());

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
