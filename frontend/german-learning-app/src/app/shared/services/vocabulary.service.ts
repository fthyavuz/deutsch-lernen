import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VocabularyDTO } from '../models/vocabulary.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vocabularies`;

  getByLesson(lessonId: number): Observable<VocabularyDTO[]> {
    return this.http.get<VocabularyDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }
}

