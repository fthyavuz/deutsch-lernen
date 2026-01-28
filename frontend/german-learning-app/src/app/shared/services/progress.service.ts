// src/app/shared/services/progress.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProgressDTO } from '../models/user-progress.model';

interface SaveProgressRequest {
  userId: number;
  lessonId: number;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/progress';

  getUserProgress(userId: number): Observable<UserProgressDTO[]> {
    return this.http.get<UserProgressDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  saveProgress(request: SaveProgressRequest): Observable<UserProgressDTO> {
    return this.http.post<UserProgressDTO>(this.apiUrl, request);
  }
}
