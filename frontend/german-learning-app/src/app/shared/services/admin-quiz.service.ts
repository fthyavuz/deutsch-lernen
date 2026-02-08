import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminQuizQuestionRequestDTO, AdminQuizQuestionResponseDTO } from '../models/admin-quiz.model';

@Injectable({
    providedIn: 'root',
})
export class AdminQuizService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/admin/quizzes';

    getByLesson(lessonId: number): Observable<AdminQuizQuestionResponseDTO[]> {
        return this.http.get<AdminQuizQuestionResponseDTO[]>(`${this.apiUrl}/lesson/${lessonId}`);
    }

    create(quiz: AdminQuizQuestionRequestDTO): Observable<AdminQuizQuestionResponseDTO> {
        return this.http.post<AdminQuizQuestionResponseDTO>(this.apiUrl, quiz);
    }

    update(id: number, quiz: AdminQuizQuestionRequestDTO): Observable<AdminQuizQuestionResponseDTO> {
        return this.http.put<AdminQuizQuestionResponseDTO>(`${this.apiUrl}/${id}`, quiz);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
