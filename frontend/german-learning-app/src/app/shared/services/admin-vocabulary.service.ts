import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VocabularyDTO } from '../models/vocabulary.model';
import { AdminVocabularyRequest } from '../models/admin-vocabulary-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminVocabularyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/vocabularies`;

  getByLesson(lessonId: number): Observable<VocabularyDTO[]> {
    return this.http.get<VocabularyDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }

  create(vocabulary: AdminVocabularyRequest): Observable<VocabularyDTO> {
    return this.http.post<VocabularyDTO>(this.apiUrl, vocabulary);
  }

  update(id: number, vocabulary: AdminVocabularyRequest): Observable<VocabularyDTO> {
    return this.http.put<VocabularyDTO>(`${this.apiUrl}/${id}`, vocabulary);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
