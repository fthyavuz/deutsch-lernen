import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressRequestDTO, UserProgressResponseDTO } from '../models/user-progress.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/progress`;

  getMyProgress(): Observable<UserProgressResponseDTO[]> {
    return this.http.get<UserProgressResponseDTO[]>(`${this.apiUrl}/me`);
  }

  saveProgress(request: ProgressRequestDTO): Observable<UserProgressResponseDTO> {
    return this.http.post<UserProgressResponseDTO>(this.apiUrl, request);
  }
}
