import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GrammarTopicDTO, GrammarSubmitRequest, GrammarSubmitResponse } from '../models/grammar.model';

@Injectable({ providedIn: 'root' })
export class GrammarService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/grammar`;

  getByLesson(lessonId: number): Observable<GrammarTopicDTO[]> {
    return this.http.get<GrammarTopicDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }

  submitAnswer(request: GrammarSubmitRequest): Observable<GrammarSubmitResponse> {
    return this.http.post<GrammarSubmitResponse>(`${this.apiUrl}/submit`, request);
  }
}
