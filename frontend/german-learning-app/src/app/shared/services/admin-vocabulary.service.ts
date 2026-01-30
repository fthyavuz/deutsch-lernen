import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VocabularyDTO } from '../models/vocabulary.model';

@Injectable({
  providedIn: 'root',
})
export class AdminVocabularyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/admin/vocabularies';

  getAll(): Observable<VocabularyDTO[]> {
    return this.http.get<VocabularyDTO[]>(this.apiUrl);
  }

  create(vocabulary: VocabularyDTO): Observable<VocabularyDTO> {
    return this.http.post<VocabularyDTO>(this.apiUrl, vocabulary);
  }

  update(vocabulary: VocabularyDTO): Observable<VocabularyDTO> {
    return this.http.put<VocabularyDTO>(`${this.apiUrl}/${vocabulary.id}`, vocabulary);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
