import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // optional: backend could return role here too
  role?: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'jwtToken';
  private readonly roleKey = 'userRole';

  // reactive login state
  readonly isLoggedIn = signal<boolean>(false);
  readonly userRole = signal<string | null>(null);

  constructor() {
    const token = this.getToken();
    const role = localStorage.getItem(this.roleKey);

    this.isLoggedIn.set(!!token);
    this.userRole.set(role);
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.setSession(response.token, response.role ?? null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedIn.set(false);
    this.userRole.set(null);
  }

  private setSession(token: string, role: string | null) {
    localStorage.setItem(this.tokenKey, token);
    if (role) {
      localStorage.setItem(this.roleKey, role);
      this.userRole.set(role);
    }
    this.isLoggedIn.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return this.userRole();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}
