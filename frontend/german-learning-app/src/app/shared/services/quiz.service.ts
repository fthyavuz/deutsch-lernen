// src/app/shared/services/quiz.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizQuestionDTO } from '../models/quiz.model';

interface QuizSubmitRequest {
  questionId: number;
  selectedAnswer: string;
}

interface QuizSubmitResponse {
  questionId: number;
  correct: boolean;
  correctAnswer: string;
}

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
