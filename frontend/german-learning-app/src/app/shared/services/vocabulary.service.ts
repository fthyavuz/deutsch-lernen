// src/app/shared/services/vocabulary.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VocabularyDTO } from '../models/vocabulary.model';

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/vocabularies';

  getByLesson(lessonId: number): Observable<VocabularyDTO[]> {
    return this.http.get<VocabularyDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }
}
