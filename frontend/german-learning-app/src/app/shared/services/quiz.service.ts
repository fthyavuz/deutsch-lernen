import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizQuestionDTO, QuizSubmitRequest, QuizSubmitResponse } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/quizzes';

  getQuizByLesson(lessonId: number): Observable<QuizQuestionDTO[]> {
    return this.http.get<QuizQuestionDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }

  submitAnswer(request: QuizSubmitRequest): Observable<QuizSubmitResponse> {
    return this.http.post<QuizSubmitResponse>(`${this.apiUrl}/submit`, request);
  }
}
