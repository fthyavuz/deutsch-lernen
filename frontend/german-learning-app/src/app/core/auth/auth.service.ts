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
  role: 'ADMIN' | 'STUDENT';
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  email: string;
  role: 'ADMIN' | 'STUDENT';
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
  readonly isLoggedInSignal = signal<boolean>(false);

  readonly userRoleSignal = signal<string | null>(null);

  constructor() {
    this.checkTokenOnLoad();
  }

  private checkTokenOnLoad() {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      const role = localStorage.getItem(this.roleKey);
      this.isLoggedInSignal.set(true);
      this.userRoleSignal.set(role);
    } else {
      this.logout();
    }
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.setSession(response.token, response.role);
      })
    );
  }

  isLoggedIn(): boolean {
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return this.isLoggedInSignal();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedInSignal.set(false);
    this.userRoleSignal.set(null);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return this.userRoleSignal();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;
    const expiry = decoded.exp * 1000; // exp is in seconds
    return Date.now() > expiry;
  }
  private setSession(token: string, role: string) {
    localStorage.setItem(this.tokenKey, token);
    if (role) {
      localStorage.setItem(this.roleKey, role);
      this.userRoleSignal.set(role);
    }
    this.isLoggedInSignal.set(true);
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
