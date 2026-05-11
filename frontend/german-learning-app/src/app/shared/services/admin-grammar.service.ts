import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GrammarTopicDTO, GrammarTopicImportDTO,
  GrammarCardDTO, GrammarExerciseDTO, GrammarImportDTO
} from '../models/grammar.model';

@Injectable({ providedIn: 'root' })
export class AdminGrammarService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/grammar`;

  getByLesson(lessonId: number): Observable<GrammarTopicDTO[]> {
    return this.http.get<GrammarTopicDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }

  createTopic(lessonId: number, name: string): Observable<GrammarTopicDTO> {
    return this.http.post<GrammarTopicDTO>(`${this.apiUrl}/topics`, { lessonId, name });
  }

  updateTopic(id: number, name: string): Observable<GrammarTopicDTO> {
    return this.http.put<GrammarTopicDTO>(`${this.apiUrl}/topics/${id}`, { name });
  }

  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/topics/${id}`);
  }

  createCard(card: { topicId: number; orderIndex: number; title: string; explanation: string; examples: string }): Observable<GrammarCardDTO> {
    return this.http.post<GrammarCardDTO>(`${this.apiUrl}/cards`, card);
  }

  updateCard(id: number, card: { orderIndex: number; title: string; explanation: string; examples: string }): Observable<GrammarCardDTO> {
    return this.http.put<GrammarCardDTO>(`${this.apiUrl}/cards/${id}`, card);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${id}`);
  }

  createExercise(ex: { topicId: number; orderIndex: number; sentence: string; answer: string; hint: string }): Observable<GrammarExerciseDTO> {
    return this.http.post<GrammarExerciseDTO>(`${this.apiUrl}/exercises`, ex);
  }

  updateExercise(id: number, ex: { orderIndex: number; sentence: string; answer: string; hint: string }): Observable<GrammarExerciseDTO> {
    return this.http.put<GrammarExerciseDTO>(`${this.apiUrl}/exercises/${id}`, ex);
  }

  deleteExercise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exercises/${id}`);
  }

  importGrammar(data: GrammarImportDTO): Observable<GrammarTopicDTO[]> {
    return this.http.post<GrammarTopicDTO[]>(`${this.apiUrl}/import`, data);
  }
}
