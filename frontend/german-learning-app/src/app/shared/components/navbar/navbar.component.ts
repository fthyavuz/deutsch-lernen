import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
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
