// src/app/shared/services/lesson.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LessonDTO } from '../models/lesson.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/lessons`;

  getAllLessons(): Observable<LessonDTO[]> {
    return this.http.get<LessonDTO[]>(this.apiUrl);
  }

  getLessonById(id: number): Observable<LessonDTO> {
    return this.http.get<LessonDTO>(`${this.apiUrl}/${id}`);
  }
}
